import * as React from "react";
import { motion, useInView, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { duration, ease, riseVariants, staggerParent } from "@/lib/motion";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/** Media query hook that is SSR-safe (always false on the server). */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode;
  delay?: number;
  once?: boolean;
  amount?: number;
};

/** Single element entrance. Collapses to a plain element under reduced motion. */
export function MotionReveal({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.25,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: riseVariants.hidden,
        visible: {
          ...riseVariants.visible,
          transition: { duration: 0.62, ease: ease.out, delay },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers `MotionItem` children into view. */
export function MotionStagger({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  amount = 0.2,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerParent(stagger, delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children?: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={riseVariants} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * Numeric metric that counts to its value once in view.
 * Formatting is caller-controlled so currency, percent and duration units all
 * render from the same primitive.
 */
export function MetricValue({
  value,
  format,
  className,
  duration: dur = 1.1,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = React.useState(() => format(reduced ? value : 0));

  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(format(value));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (dur * 1000));
      // easeOutQuint — matches the visual language of ease.out
      const eased = 1 - Math.pow(1 - t, 5);
      setDisplay(format(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, dur, reduced, format]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/**
 * Restrained pointer response for feature cards: a few degrees of tilt and a
 * light that follows the cursor. Disabled on touch and reduced motion.
 */
export function PointerCard({
  children,
  className,
  intensity = 4,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const reduced = useReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 26 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 26 });
  const active = !reduced && fine;

  return (
    <motion.div
      className={cn("relative", className)}
      {...(active ? { style: { rotateX: rx, rotateY: ry, transformPerspective: 1200 } } : {})}
      onPointerMove={
        active
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              rx.set(-py * intensity);
              ry.set(px * intensity);
              e.currentTarget.style.setProperty("--px", `${(px + 0.5) * 100}%`);
              e.currentTarget.style.setProperty("--py", `${(py + 0.5) * 100}%`);
            }
          : undefined
      }
      onPointerLeave={
        active
          ? () => {
              rx.set(0);
              ry.set(0);
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
