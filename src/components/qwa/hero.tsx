import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Container } from "./primitives";
import { useDemoRequest } from "./demo-request";
import { RiveStage } from "./rive-stage";
import { SignalFlow } from "./signal-flow";
import { FlagshipMedia } from "@/components/qwa/media/flagship-media";
import { ease } from "@/lib/motion";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

const proofPoints: [string, string][] = [
  ["Answered in seconds", "Every channel, day or night"],
  ["One customer record", "Conversation, calendar, revenue"],
  ["Spend scored on revenue", "Not on clicks or last touch"],
];

export function Hero() {
  const { open } = useDemoRequest();
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  // The hidden variant must be identical on server and client; reduced motion
  // is honoured by collapsing the transition, not by changing the first frame.
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.8, ease: ease.out },
    },
  };

  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-44">
      <div className="qwa-mesh pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <Container className="pb-24 lg:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-20 xl:gap-24">
          <motion.div className="min-w-0" variants={container} initial="hidden" animate="visible">
            <motion.p
              variants={item}
              className="text-eyebrow flex items-center gap-2.5"
            >
              <span className="h-1 w-1 rounded-full bg-signal animate-node-pulse" />
              The AI Revenue Operating System
            </motion.p>

            <motion.h1
              variants={item}
              className="text-display mt-7 max-w-[12ch] text-[clamp(2.9rem,6.6vw,4.75rem)]"
            >
              Turn every customer signal into revenue.
            </motion.h1>

            <motion.p variants={item} className="text-lede mt-7 max-w-[33rem]">
              QWA answers, qualifies, books and assists every inbound conversation — then joins the
              revenue back to the ad, message or call that produced it.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <Button variant="ink" size="xl" onClick={open}>
                Book a demo
              </Button>
              <Button variant="quiet" size="xl" asChild>
                <a href="#revenue-engine">See how the loop runs</a>
              </Button>
            </motion.div>

            <motion.dl
              variants={item}
              className="mt-14 grid max-w-2xl grid-cols-1 gap-y-5 border-t border-hairline pt-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0"
            >
              {proofPoints.map(([v, k]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-[0.875rem] font-medium tracking-tight">{v}</dt>
                  <dd className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground">
                    {k}
                  </dd>
                </div>
              ))}

            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 1, ease: ease.out, delay: reduced ? 0 : 0.18 }}
            className="min-w-0"
          >
            <FlagshipMedia
              id="home-hero"
              unframed
              label="Simulation: customer signals from ads, search, direct messages, voice and web are interpreted by QWA and resolved into an appointment, a sale and attributed revenue"
              className="min-w-0"
            >
              <RiveStage
                label="Simulation: customer signals from ads, search, direct messages, voice and web are interpreted by QWA and resolved into an appointment, a sale and attributed revenue"
                className="min-w-0"
                fallback={<SignalFlow />}
              />
            </FlagshipMedia>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
