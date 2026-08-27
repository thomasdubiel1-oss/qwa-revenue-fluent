import { Link } from "@tanstack/react-router";
import { Container } from "./primitives";
import { footerColumns, isLiveRoute } from "@/config/site";
import { Mark } from "./site-header";

/** Only routes that exist are linked; the rest stay inert until published. */
const legalLinks: { label: string; href?: "/privacy" | "/terms" }[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Security" },
  { label: "Responsible AI" },
  { label: "Status" },
];


export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-paper">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,3fr)]">
          <div className="max-w-xs">
            <div className="flex min-h-11 items-center gap-2.5">
              <Mark />
              <span className="text-[0.95rem] font-semibold tracking-tight">Quantum Web AI</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The AI Revenue Operating System. One closed loop from first signal to attributed
              revenue.
            </p>
            <p className="text-data mt-6 text-xs text-muted-foreground">San Francisco, California</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerColumns.map((col) => (
              <div key={col.heading} className="min-w-0">
                <p className="text-eyebrow mb-4">{col.heading}</p>
                <ul className="grid gap-2.5">
                  {col.items.map((item) =>
                    isLiveRoute(item.href) ? (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className="-my-3 inline-flex min-h-11 items-center py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={item.label} className="text-sm text-muted-foreground/55">
                        {item.label}
                      </li>
                    ),
                  )}


                </ul>

              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Quantum Web AI, Inc. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="-my-3 inline-flex min-h-11 items-center py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="-my-3 inline-flex min-h-11 items-center py-3 text-xs text-muted-foreground/70">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
