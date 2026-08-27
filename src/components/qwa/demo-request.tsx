import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { track, type DemoSource } from "@/lib/analytics";
import { captureCampaignContext, getAttribution } from "@/lib/leads/attribution";
import { submitDemoRequest } from "@/lib/leads/provider";
import {
  MIN_FILL_MS,
  validateDemoForm,
  type DemoFormValues,
  type FieldErrors,
} from "@/lib/leads/validation";
import type { DemoRequestPayload } from "@/lib/leads/types";

export type { DemoRequestPayload };

type Ctx = { open: (source?: DemoSource) => void };
const DemoRequestContext = React.createContext<Ctx | null>(null);

export function useDemoRequest() {
  const ctx = React.useContext(DemoRequestContext);
  if (!ctx) throw new Error("useDemoRequest must be used within DemoRequestProvider");
  return ctx;
}

const leadRanges = [
  "Under 250 / month",
  "250 – 1,000 / month",
  "1,000 – 5,000 / month",
  "5,000 – 25,000 / month",
  "25,000+ / month",
];

const goals = [
  "Respond to inbound faster",
  "Increase lead-to-sale conversion",
  "Attribute revenue across channels",
  "Lower customer acquisition cost",
  "Recover dormant pipeline",
  "Consolidate my martech stack",
];

export function DemoRequestProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [source, setSource] = React.useState<DemoSource>("unknown");
  // The modal is opened programmatically rather than through a Radix trigger,
  // so focus restoration has to be handled here.
  const triggerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    captureCampaignContext();
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({
      open: (from: DemoSource = "unknown") => {
        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setSource(from);
        track("demo_cta_clicked", { source: from });
        track("demo_modal_opened", { source: from });
        setOpen(true);
      },
    }),
    [],
  );

  return (
    <DemoRequestContext.Provider value={value}>
      {children}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            track("demo_modal_dismissed", { source });
            const trigger = triggerRef.current;
            if (trigger?.isConnected) {
              window.requestAnimationFrame(() => trigger.focus());
            }
          }
          setOpen(next);
        }}
      >

        <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-2xl border-hairline p-0 sm:max-w-2xl">
          <DialogHeader className="space-y-3 border-b border-hairline px-6 py-6 text-left sm:px-8">
            <DialogTitle className="text-display text-2xl sm:text-3xl">
              Book a private demo
            </DialogTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A 30-minute working session with a QWA revenue architect. We map your current
              acquisition and conversion path, then show the closed loop against your numbers.
            </p>
          </DialogHeader>
          <div className="px-6 py-6 sm:px-8">
            <DemoRequestForm source={source} onDone={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </DemoRequestContext.Provider>
  );
}

const emptyValues: DemoFormValues = {
  email: "",
  name: "",
  company: "",
  website: "",
  monthlyLeads: "",
  primaryGoal: "",
  phone: "",
  notes: "",
  consent: false,
};

export function DemoRequestForm({
  onDone,
  className,
  source = "unknown",
}: {
  onDone?: () => void;
  className?: string;
  source?: DemoSource;
}) {
  const [values, setValues] = React.useState<DemoFormValues>(emptyValues);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done" | "error">("idle");
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const startedRef = React.useRef(false);
  const mountedAtRef = React.useRef(Date.now());
  // Honeypot: hidden from humans and assistive tech, irresistible to bots.
  const trapRef = React.useRef<HTMLInputElement>(null);
  const errorSummaryRef = React.useRef<HTMLParagraphElement>(null);

  const set = <K extends keyof DemoFormValues>(key: K, value: DemoFormValues[K]) => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("demo_form_started", { source });
    }
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validateDemoForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    const elapsedMs = Date.now() - mountedAtRef.current;
    const payload: DemoRequestPayload = {
      email: values.email.trim(),
      name: values.name.trim(),
      company: values.company.trim(),
      website: values.website.trim(),
      monthlyLeads: values.monthlyLeads,
      primaryGoal: values.primaryGoal,
      phone: values.phone.trim() || undefined,
      notes: values.notes.trim() || undefined,
      consent: values.consent,
      attribution: getAttribution(source),
      elapsedMs,
    };

    setSubmitError(null);
    setStatus("submitting");
    track("demo_form_submitted", { source, monthly_leads: values.monthlyLeads });

    // Spam heuristics: filled honeypot or an impossibly fast completion are
    // accepted silently rather than surfaced, so bots get no signal.
    const looksAutomated = Boolean(trapRef.current?.value) || elapsedMs < MIN_FILL_MS;
    if (looksAutomated) {
      await new Promise((r) => setTimeout(r, 600));
      setStatus("done");
      return;
    }

    const result = await submitDemoRequest(payload);
    if (result.ok) {
      setStatus("done");
      track("demo_form_success", { source, provider: result.provider });
      window.setTimeout(() => onDone?.(), 2600);
    } else {
      setStatus("error");
      setSubmitError(
        result.retryable
          ? "We couldn't send that just now. Please try again."
          : "Something went wrong with this request. Please email us instead.",
      );
      track("demo_form_failed", { source, provider: result.provider, reason: result.error });
    }
  }

  if (status === "done") {
    return (
      <div className={cn("animate-rise flex flex-col items-start gap-4 py-6", className)}>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-signal-soft text-signal">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <div role="status" aria-live="polite">
          <p className="text-xl font-medium tracking-tight">Request received</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            A revenue architect will reach out within one business day with two proposed times.
          </p>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;
  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className={cn("grid gap-5", className)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(v) => set("email", v)}
          error={errors["email"]}
          required
        />
        <Field
          id="name"
          label="Full name"
          autoComplete="name"
          placeholder="Alex Moreno"
          value={values.name}
          onChange={(v) => set("name", v)}
          error={errors["name"]}
          required
        />
        <Field
          id="company"
          label="Company"
          autoComplete="organization"
          placeholder="Northline Group"
          value={values.company}
          onChange={(v) => set("company", v)}
          error={errors["company"]}
          required
        />
        <Field
          id="website"
          label="Website"
          autoComplete="url"
          placeholder="northline.com"
          value={values.website}
          onChange={(v) => set("website", v)}
          error={errors["website"]}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="monthlyLeads"
          label="Monthly leads"
          placeholder="Select a range"
          options={leadRanges}
          value={values.monthlyLeads}
          onChange={(v) => set("monthlyLeads", v)}
          error={errors["monthlyLeads"]}
        />
        <SelectField
          id="primaryGoal"
          label="Primary goal"
          placeholder="Select a goal"
          options={goals}
          value={values.primaryGoal}
          onChange={(v) => set("primaryGoal", v)}
          error={errors["primaryGoal"]}
        />
      </div>

      <Field
        id="phone"
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        placeholder="+1 (415) 555-0134"
        value={values.phone}
        onChange={(v) => set("phone", v)}
        error={errors["phone"]}
      />

      <div className="grid min-w-0 gap-2">
        <Label htmlFor="notes">What should we look at first? (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder="One real path we should trace — a missed call, a paid campaign, a stalled pipeline."
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          className="rounded-lg"
        />
        {errors["notes"] ? <FieldError id="notes">{errors["notes"]}</FieldError> : null}
      </div>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-website-url">Do not fill this field</label>
        <input
          ref={trapRef}
          id="company-website-url"
          name="company-website-url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex min-h-11 items-start gap-3 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={Boolean(errors["consent"])}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border border-hairline-strong accent-[var(--signal)]"
        />
        <span>
          QWA may contact me about this request. We do not sell personal data. Placeholder privacy
          language — final policy to be linked at launch.
        </span>
      </label>
      {errors["consent"] ? <FieldError id="consent">{errors["consent"]}</FieldError> : null}

      {hasErrors || submitError ? (
        <p
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive outline-none"
        >
          {submitError ?? "Please correct the highlighted fields and try again."}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="ink" size="xl" disabled={submitting}>
          {submitting ? "Sending…" : status === "error" ? (
            <>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </>
          ) : (
            "Request demo"
          )}
        </Button>
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {submitting ? "Sending your request…" : "Typical reply: under 1 business day"}
        </span>
      </div>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={`${id}-error`} className="text-[0.8125rem] leading-snug text-destructive">
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete ?? "on"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("h-11 rounded-lg", error && "border-destructive")}
      />
      {error ? <FieldError id={id}>{error}</FieldError> : null}
    </div>
  );
}

function SelectField({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("h-11 rounded-lg", error && "border-destructive")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <FieldError id={id}>{error}</FieldError> : null}
    </div>
  );
}
