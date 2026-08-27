/** SERVER ONLY — Higgsfield adapter (integration pending). */
import { createAdapter } from "./base.server";

export const higgsfieldAdapter = createAdapter(
  "higgsfield",
  { usdPerSecond: 0.1, secondsPerClip: 45, queueOverheadSeconds: 10 },
  "TODO: confirm Higgsfield endpoint + auth scheme, then implement submit/poll.",
);
