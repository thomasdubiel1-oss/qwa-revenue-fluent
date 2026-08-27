import { Button } from "@/components/ui/button";
import { Container, Section } from "./primitives";
import { MotionReveal } from "./motion-primitives";
import { useDemoRequest } from "./demo-request";

export function ClosingCta() {
  const { open } = useDemoRequest();

  return (
    <Section tone="ink" className="py-24 sm:py-28 lg:py-32">
      <Container>
        <MotionReveal className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="text-eyebrow text-ink-foreground/60">Get started</p>
            <h2 className="text-display mt-5 max-w-2xl text-[clamp(2rem,4.4vw,3.25rem)]">
              See your own funnel run inside QWA.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/70">
              A working session with our team: we map your channels, your response times and your
              revenue data, then show exactly where the loop is broken.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button variant="onInk" size="xl" onClick={open}>
              Book a private demo
            </Button>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}
