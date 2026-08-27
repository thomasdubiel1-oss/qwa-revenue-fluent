import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Ctx = { open: () => void };
const DemoRequestContext = React.createContext<Ctx | null>(null);

export function useDemoRequest() {
  const ctx = React.useContext(DemoRequestContext);
  if (!ctx) throw new Error("useDemoRequest must be used within DemoRequestProvider");
  return ctx;
}

export type DemoRequestPayload = {
  email: string;
  name: string;
  company: string;
  website: string;
  monthlyLeads: string;
  primaryGoal: string;
  phone?: string | undefined;
};

/**
 * INTEGRATION POINT (Phase 2):
 * Replace this stub with a TanStack `createServerFn` call that persists the
 * lead to Lovable Cloud and forwards it to the CRM / notification pipeline.
 */
async function submitDemoRequest(payload: DemoRequestPayload): Promise<void> {
  console.info("[QWA] demo request (not yet wired to CRM)", payload);
  await new Promise((r) => setTimeout(r, 700));
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
  const value = React.useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <DemoRequestContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
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
            <DemoRequestForm onDone={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </DemoRequestContext.Provider>
  );
}

export function DemoRequestForm({
  onDone,
  className,
}: {
  onDone?: () => void;
  className?: string;
}) {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle");
  const [leads, setLeads] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: DemoRequestPayload = {
      email: String(form.get("email") ?? ""),
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      website: String(form.get("website") ?? ""),
      monthlyLeads: leads,
      primaryGoal: goal,
      phone: String(form.get("phone") ?? "") || undefined,
    };
    if (!leads || !goal) {
      setError("Please select monthly lead volume and your primary goal.");
      return;
    }
    setError(null);
    setStatus("submitting");
    await submitDemoRequest(payload);
    setStatus("done");
    window.setTimeout(() => onDone?.(), 2600);
  }

  if (status === "done") {
    return (
      <div className={cn("animate-rise flex flex-col items-start gap-4 py-6", className)}>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-signal-soft text-signal">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xl font-medium tracking-tight">Request received</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            A revenue architect will reach out within one business day with two proposed times.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("grid gap-5", className)} noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label="Work email" type="email" required placeholder="you@company.com" />
        <Field id="name" label="Full name" required placeholder="Alex Moreno" />
        <Field id="company" label="Company" required placeholder="Northline Group" />
        <Field id="website" label="Website" required placeholder="northline.com" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid min-w-0 gap-2">
          <Label htmlFor="monthlyLeads">Monthly leads</Label>
          <Select value={leads} onValueChange={setLeads}>
            <SelectTrigger id="monthlyLeads" className="h-11 rounded-lg">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {leadRanges.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid min-w-0 gap-2">
          <Label htmlFor="primaryGoal">Primary goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger id="primaryGoal" className="h-11 rounded-lg">
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent>
              {goals.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Field id="phone" label="Phone (optional)" type="tel" placeholder="+1 (415) 555-0134" />

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        By submitting, you agree that QWA may contact you about this request. We do not sell
        personal data. Placeholder privacy language — final policy to be linked at launch.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="ink" size="xl" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request demo"}
        </Button>
        <span className="text-xs text-muted-foreground">Typical reply: under 1 business day</span>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={id === "email" ? "email" : id === "name" ? "name" : "on"}
        className="h-11 rounded-lg"
      />
    </div>
  );
}
