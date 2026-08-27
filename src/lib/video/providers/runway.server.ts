/** SERVER ONLY — Runway adapter (integration pending). */
import { createAdapter } from "./base.server";

export const runwayAdapter = createAdapter(
  "runway",
  { usdPerSecond: 0.2, secondsPerClip: 75, queueOverheadSeconds: 12 },
  "TODO: confirm Runway endpoint + auth scheme, then implement submit/poll.",
);
