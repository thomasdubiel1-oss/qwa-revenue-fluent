import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Container } from "./primitives";
import { useDemoRequest } from "./demo-request";
import { RiveStage } from "./rive-stage";
import { SignalFlow } from "./signal-flow";
import { ease } from "@/lib/motion";

const proofPoints: [string, string][] = [
  ["Under 30s", "First response, any channel"],
  ["One record", "Customer, conversation, revenue"],
  ["Closed loop", "Spend scored on revenue"],
];

export function Hero() {
  const { open } = useDemoRequest();
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const item = reduced
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.85, ease: ease.out },
        },
      };

  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-44">
      <div className="qwa-mesh pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <Container className="pb-24 lg:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] lg:gap-20 xl:gap-24">
          <motion.div className="min-w-0" variants={container} initial="hidden" animate="visible">
            <motion.p variants={item} className="text-eyebrow flex items-center gap-2.5">
              <span className="h-1 w-1 rounded-full bg-signal animate-node-pulse" />
              The AI Revenue Operating System
            </motion.p>

            <motion.h1
              variants={item}
              className="text-display mt-8 max-w-[13ch] text-[clamp(2.75rem,6.4vw,4.6rem)]"
            >
              Turn every customer signal into revenue.
            </motion.h1>

            <motion.p variants={item} className="text-lede mt-8 max-w-[34rem]">
              QWA runs acquisition, conversation, booking, sales assistance and attribution as one
              system — so every ad, message and call is measured against the revenue it produced.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
              <Button variant="ink" size="xl" onClick={open}>
                Book a private demo
              </Button>
              <Button variant="quiet" size="xl" asChild>
                <a href="#revenue-engine">See how the loop runs</a>
              </Button>
            </motion.div>

            <motion.dl
              variants={item}
              className="mt-14 grid max-w-xl grid-cols-1 gap-6 border-t border-hairline pt-8 sm:grid-cols-3 sm:gap-8"
            >
              {proofPoints.map(([v, k]) => (
                <div key={k} className="min-w-0 sm:border-l sm:border-hairline sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
                  <dt className="text-data text-[1.0625rem] font-medium">{v}</dt>
                  <dd className="mt-1.5 max-w-[16ch] text-[0.8125rem] leading-snug text-muted-foreground">
                    {k}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.16 }}
            className="min-w-0"
          >
            <RiveStage
              label="Simulation: customer signals from ads, search, direct messages, voice and web are interpreted by QWA and resolved into an appointment, a sale and attributed revenue"
              className="min-w-0"
              fallback={<SignalFlow />}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
