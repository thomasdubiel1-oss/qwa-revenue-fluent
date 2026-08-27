import { Button } from "@/components/ui/button";
import { Container, Section } from "./primitives";
import { MotionReveal } from "./motion-primitives";
import { useDemoRequest } from "./demo-request";

export function ClosingCta() {
  const { open } = useDemoRequest();

  return (
    <Section tone="ink" className="py-24 lg:py-32">
      <Container>
        <MotionReveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-display max-w-[16ch] text-[clamp(2rem,3.8vw,3.05rem)]">
            See your own funnel run inside QWA.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-foreground/70">
            Thirty minutes with a revenue architect. We map your channels and response times, then
            show exactly where the loop breaks.
          </p>
          <div className="mt-10">
            <Button variant="onInk" size="xl" onClick={open}>
              Book a demo
            </Button>
          </div>
          <p className="mt-5 text-[0.8125rem] text-ink-foreground/50">
            No sales sequence. A reply within one business day.
          </p>
        </MotionReveal>
      </Container>
    </Section>
  );
}
