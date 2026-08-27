import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./primitives";
import { isLiveRoute, navigation } from "@/config/site";
import { useDemoRequest } from "./demo-request";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";


export function SiteHeader() {
  const { open } = useDemoRequest();
  const [scrolled, setScrolled] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const closeTimer = React.useRef<number | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCurrent = (href: string) => href !== "/" && pathname === href;
  const groupIsCurrent = (label: string) =>
    navigation
      .find((g) => g.label === label)
      ?.columns.some((c) => c.items.some((i) => isCurrent(i.href))) ?? false;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock background scroll while the mobile drawer is open (iOS-safe),
  // restoring the previous scroll position on close.
  React.useEffect(() => {
    if (!mobileOpen) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() =>
        window.scrollTo({ top: scrollY, left: 0, behavior: "instant" as ScrollBehavior }),
      );
    };
  }, [mobileOpen]);


  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || openMenu || mobileOpen
          ? "border-b border-hairline bg-background/92 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
      onMouseLeave={scheduleClose}
    >
      <Container className="flex h-16 items-center gap-6 lg:h-[4.5rem]">
        <Link to="/" className="flex min-h-11 shrink-0 items-center gap-2.5" aria-label="Quantum Web AI home">
          <Mark />
          <span className="text-[0.95rem] font-semibold tracking-tight">Quantum Web AI</span>
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 flex-1 items-center gap-0.5 xl:flex">
          {navigation.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => {
                cancelClose();
                setOpenMenu(group.label);
              }}
            >
              <button
                type="button"
                aria-expanded={openMenu === group.label}
                onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
                onFocus={() => setOpenMenu(group.label)}
                className={cn(
                  "relative inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  (openMenu === group.label || groupIsCurrent(group.label)) && "text-foreground",
                )}
              >
                {openMenu === group.label ? (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "relative h-3.5 w-3.5 transition-transform duration-200",
                    openMenu === group.label && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}

        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <Link
            to="/"
            className="hidden min-h-11 items-center rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Button variant="ink" size="pill" onClick={() => open("site_header")} className="hidden sm:inline-flex">
            Book a demo
          </Button>
          <button
            type="button"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-hairline xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </Container>

      {/* Desktop mega menu */}
      <div className="hidden xl:block" onMouseEnter={cancelClose}>
        <AnimatePresence initial={false}>
          {openMenu ? (
            <motion.div
              key={openMenu}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: duration.fast, ease: ease.standard }}
              className="overflow-hidden border-t border-hairline"
            >
              {navigation
                .filter((g) => g.label === openMenu)
                .map((group) => (
                  <Container key={group.label} className="grid grid-cols-2 gap-x-16 gap-y-8 py-10">
                    {group.columns.map((col, ci) => (
                      <motion.div
                        key={col.heading}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: duration.base,
                          ease: ease.out,
                          delay: 0.04 + ci * 0.05,
                        }}
                      >
                        <p className="text-eyebrow mb-5">{col.heading}</p>
                        <ul className="grid gap-1">
                          {col.items.map((item) => (
                            <li key={item.label}>
                              <NavTarget
                                href={item.href}
                                onNavigate={() => setOpenMenu(null)}
                                current={isCurrent(item.href)}
                                className={cn(
                                  "group flex flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-accent",
                                  isCurrent(item.href) && "bg-accent",
                                )}
                              >
                                <span className="text-sm font-medium">{item.label}</span>
                                {item.description ? (
                                  <span className="text-sm text-muted-foreground">
                                    {item.description}
                                  </span>
                                ) : null}
                              </NavTarget>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </Container>
                ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>


      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.fast, ease: ease.standard }}
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-hairline bg-background xl:hidden"
          >
          <Container className="py-6">
            <ul className="grid gap-2">
              {navigation.map((group) => (
                <li key={group.label} className="border-b border-hairline pb-2">
                  <details className="group">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-3 text-base font-medium">
                      {group.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="grid gap-5 pb-4">
                      {group.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="text-eyebrow mb-2">{col.heading}</p>
                          <ul className="grid">
                            {col.items.map((item) => (
                              <li key={item.label}>
                                <NavTarget
                                  href={item.href}
                                  onNavigate={() => setMobileOpen(false)}
                                  current={isCurrent(item.href)}
                                  className={cn(
                                    "flex min-h-11 items-center py-2 text-sm",
                                    isCurrent(item.href)
                                      ? "font-medium text-foreground"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {item.label}
                                </NavTarget>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="ink"
                size="xl"
                onClick={() => {
                  setMobileOpen(false);
                  open("site_header");
                }}
              >
                Book a demo
              </Button>
              <Button variant="quiet" size="xl" asChild>
                <Link to="/">Sign in</Link>
              </Button>
            </div>
          </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </header>
  );
}

/**
 * Nav items point at Phase 2 routes. Only routes that exist are linked;
 * the rest stay inert until their page ships, so nothing 404s.
 */
function NavTarget({
  href,
  onNavigate,
  className,
  current = false,
  children,
}: {
  href: string;
  onNavigate: () => void;
  className?: string;
  /** Marks the item as the page currently being viewed. */
  current?: boolean;
  children: React.ReactNode;
}) {
  if (isLiveRoute(href)) {
    return (
      <Link
        to={href}
        onClick={onNavigate}
        className={className}
        {...(current ? { "aria-current": "page" as const } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <span className={cn(className, "cursor-default opacity-55")} aria-disabled="true">
      {children}
    </span>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn("grid h-7 w-7 place-items-center rounded-[0.5rem] bg-ink", className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" className="text-ink-foreground" opacity="0.5" />
        <circle cx="12" cy="12" r="2.6" className="fill-signal" />
        <path d="M16.5 16.5 L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-ink-foreground" />
      </svg>
    </span>
  );
}
