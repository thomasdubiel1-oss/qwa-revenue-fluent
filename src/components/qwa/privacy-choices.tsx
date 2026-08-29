import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_CONSENT,
  getConsent,
  onConsentChange,
  setConsent,
  type ConsentState,
} from "@/lib/consent";

/**
 * Truthful exposure of the local consent state — nothing more.
 *
 * QWA loads no third-party analytics SDK and sets no third-party cookies, so
 * this control describes exactly two real things: first-party session
 * attribution (on by default, switchable) and future third-party analytics
 * (off, and not loadable until a provider is selected). It makes no legal
 * claim and implies no vendor.
 */
export function PrivacyChoices({ className }: { className?: string }) {
  const [state, setState] = React.useState<ConsentState>(DEFAULT_CONSENT);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(getConsent());
    setHydrated(true);
    return onConsentChange(setState);
  }, []);

  return (
    <Dialog>
      <DialogTrigger className={className}>Privacy choices</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Privacy choices</DialogTitle>
          <DialogDescription>
            These preferences are stored on this device only. Quantum Web AI loads no third-party
            analytics or advertising scripts on this site today.
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-5 py-2">
          <li className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium">Essential</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Required for the site to function, including demo-request form state. Always on.
              </p>
            </div>
            <Switch checked disabled aria-label="Essential storage is always on" />
          </li>

          <li className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium">Campaign attribution</p>
              <p className="mt-1 text-xs text-muted-foreground">
                First-party session storage that remembers which campaign or page brought you here,
                so a demo request reaches the right team. Cleared when the browser session ends.
              </p>
            </div>
            <Switch
              checked={state.attribution}
              disabled={!hydrated}
              onCheckedChange={(checked) => setConsent({ attribution: checked })}
              aria-label="Allow first-party campaign attribution"
            />
          </li>

          <li className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium">Analytics</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Off by default. No measurement provider is loaded on this site, so there is nothing
                to enable yet. If that changes, this switch controls it.
              </p>
            </div>
            <Switch
              checked={false}
              disabled
              aria-label="Analytics is off — no provider is loaded"
            />
          </li>
        </ul>

        <p className="text-xs text-muted-foreground">
          {hydrated && state.decidedAt
            ? `Preference saved on this device on ${new Date(state.decidedAt).toLocaleDateString()}.`
            : "No preference recorded yet — the defaults above are in effect."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
