import * as React from "react";
import { Container, Eyebrow, Reveal, Section } from "./primitives";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  time: string;
  title: string;
  body: string;
  event: { channel: string; label: string; meta: string; value?: string };
};

const steps: Step[] = [
  {
    id: "arrive",
    time: "T+0s",
    title: "A signal arrives",
    body: "A paid click, a search visit, an Instagram DM or an inbound call — every entry point lands in the same graph with full source context.",
    event: { channel: "Instagram DM", label: "New signal captured", meta: "campaign: q3-retarget-04" },
  },
  {
    id: "respond",
    time: "T+9s",
    title: "Immediate AI response",
    body: "QWA answers in the channel the customer chose, in your voice, with your offer logic — before intent decays.",
    event: { channel: "DM reply", label: "First response sent", meta: "latency 9.2s" },
  },
  {
    id: "qualify",
    time: "T+1m",
    title: "Qualification",
    body: "Budget, timing, location and fit are resolved conversationally and written to the customer record — no forms, no drop-off.",
    event: { channel: "Qualification", label: "Fit score 87", meta: "budget · timing · service area" },
  },
  {
    id: "followup",
    time: "T+6m",
    title: "Voice, SMS and DM follow-up",
    body: "Sequenced, governed follow-up across channels. Cadence adapts to observed response behavior, not a static drip.",
    event: { channel: "Voice + SMS", label: "Follow-up executed", meta: "3 touches · 1 answered" },
  },
  {
    id: "appointment",
    time: "T+11m",
    title: "Appointment booked",
    body: "Real availability, real calendars, confirmations and reminders. Show-rate protection built into the sequence.",
    event: { channel: "Calendar", label: "Appointment set", meta: "Tue 10:20am · rep: J. Ruiz" },
  },
  {
    id: "assist",
    time: "In room",
    title: "Salesperson assistance",
    body: "Your rep gets the full history, the likely objection, and the next best offer — one screen, before the conversation starts.",
    event: { channel: "Sales assist", label: "Brief delivered", meta: "next best offer: bundle B" },
  },
  {
    id: "sale",
    time: "T+2d",
    title: "Sale",
    body: "Closed-won is written back to the graph and joined to every touch that produced it.",
    event: { channel: "CRM", label: "Closed–won", meta: "contract signed", value: "$14,200" },
  },
  {
    id: "attribute",
    time: "Continuous",
    title: "Revenue attribution",
    body: "Revenue is assigned to campaigns, creatives, keywords, conversations and reps — not to clicks or last-touch fiction.",
    event: { channel: "Attribution", label: "Revenue assigned", meta: "q3-retarget-04 · creative 12", value: "$14,200" },
  },
  {
    id: "reactivate",
    time: "Ongoing",
    title: "Reactivation",
    body: "Dormant and lost records re-enter the loop when the model detects renewed intent or a changed offer fit.",
    event: { channel: "Reactivation", label: "Audience rebuilt", meta: "412 records re-scored" },
  },
];

export function RevenueEngine() {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset["index"]);
            setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = steps[active] ?? steps[0]!;

  return (
    <Section id="revenue-engine" tone="paper" className="overflow-hidden">
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>The Revenue Engine</Eyebrow>
            <h2 className="text-display mt-5 text-[clamp(2rem,4.6vw,3.5rem)]">
              One lead, followed end to end.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Most stacks lose the thread between the click and the invoice. QWA keeps a single
              record of the customer, the conversation and the money.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Narrative column */}
          <ol className="relative">
            <div className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-hairline lg:block" />
            {steps.map((s, i) => (
              <li key={s.id}>
                <div
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-index={i}
                  className={cn(
                    "relative py-8 transition-opacity duration-500 lg:py-14 lg:pl-10",
                    i === active ? "opacity-100" : "lg:opacity-40",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-[2.35rem] hidden h-[15px] w-[15px] rounded-full border-2 bg-paper transition-colors duration-500 lg:block",
                      i === active ? "border-signal" : "border-hairline-strong",
                    )}
                    aria-hidden="true"
                  />
                  <p className="text-eyebrow">
                    {String(i + 1).padStart(2, "0")} · {s.time}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {s.body}
                  </p>

                  {/* Mobile inline event card */}
                  <div className="mt-5 lg:hidden">
                    <EventCard step={s} />
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Sticky system view (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="surface-card overflow-hidden shadow-lift">
                <div className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
                  <span className="text-eyebrow">Record · QWA-84213</span>
                  <span className="text-data text-[0.7rem] text-muted-foreground">
                    stage {active + 1}/{steps.length}
                  </span>
                </div>
                <div className="h-px w-full bg-hairline">
                  <div
                    className="h-px bg-signal transition-all duration-700 ease-out"
                    style={{ width: `${((active + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <div className="grid gap-2.5 p-5">
                  {steps.slice(0, active + 1).slice(-5).map((s) => (
                    <EventCard key={s.id} step={s} dim={s.id !== current.id} />
                  ))}
                </div>
                <div className="grid grid-cols-3 border-t border-hairline">
                  {[
                    ["Response", active >= 1 ? "9.2s" : "—"],
                    ["Appointment", active >= 4 ? "Booked" : "—"],
                    ["Attributed", active >= 7 ? "$14,200" : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="border-r border-hairline px-5 py-4 last:border-r-0">
                      <p className="text-[0.7rem] text-muted-foreground">{k}</p>
                      <p className="text-data mt-1 text-sm font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function EventCard({ step, dim }: { step: Step; dim?: boolean }) {
  return (
    <div
      className={cn(
        "animate-rise rounded-xl border border-hairline bg-paper px-4 py-3 transition-opacity duration-500",
        dim && "opacity-45",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">{step.event.label}</p>
        <span className="text-data shrink-0 text-[0.65rem] text-muted-foreground">{step.time}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-data truncate text-[0.7rem] text-muted-foreground">
          {step.event.channel} · {step.event.meta}
        </p>
        {step.event.value ? (
          <span className="text-data shrink-0 text-[0.75rem] font-medium text-positive">
            {step.event.value}
          </span>
        ) : null}
      </div>
    </div>
  );
}
