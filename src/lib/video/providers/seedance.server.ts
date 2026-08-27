/** SERVER ONLY — ByteDance Seedance adapter (integration pending). */
import { createAdapter } from "./base.server";

export const seedanceAdapter = createAdapter(
  "seedance",
  { usdPerSecond: 0.08, secondsPerClip: 55, queueOverheadSeconds: 10 },
  "TODO: confirm Seedance endpoint + auth scheme, then implement submit/poll.",
);
