import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  tone?: "default" | "paper" | "ink";
  bleed?: boolean;
};

export function Section({
  tone = "default",
  bleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative w-full",
        !bleed && "py-24 sm:py-28 lg:py-36",
        tone === "paper" && "bg-paper",
        tone === "ink" && "bg-ink text-ink-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("text-eyebrow", className)}>
      <span className="mr-2 inline-block h-1 w-1 translate-y-[-2px] rounded-full bg-signal align-middle" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-[46rem] flex-col",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow className="mb-6">{eyebrow}</Eyebrow> : null}
      <h2 className="text-display text-[clamp(2rem,4.2vw,3.25rem)]">{title}</h2>
      {lede ? <p className="text-lede mt-6 max-w-[38rem]">{lede}</p> : null}
    </div>
  );
}

/**
 * QWA motif: a hairline that carries a signal node and a dashed return path.
 * Used as a section divider and as a small structural accent inside panels.
 */
export function SignalRule({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "ink";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex w-full items-center gap-3", className)}
    >
      <span
        className={cn(
          "h-px flex-1",
          tone === "ink" ? "bg-ink-foreground/15" : "bg-hairline",
        )}
      />
      <svg viewBox="0 0 64 8" className="h-2 w-16 text-signal" fill="none">
        <path d="M0 4h18" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="24" cy="4" r="2.5" fill="currentColor" />
        <path
          d="M30 4h34"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.6"
        />
      </svg>
      <span
        className={cn(
          "h-px flex-1",
          tone === "ink" ? "bg-ink-foreground/15" : "bg-hairline",
        )}
      />
    </div>
  );
}


/** Scroll reveal without animation libraries. Honors prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(shown ? "reveal-in" : "reveal-init", className)}
    >
      {children}
    </Tag>
  );
}

export function Hairline({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-hairline", className)} aria-hidden="true" />;
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-hairline bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
