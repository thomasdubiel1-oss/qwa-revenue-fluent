/** SERVER ONLY — Kling adapter (integration pending). */
import { createAdapter } from "./base.server";

export const klingAdapter = createAdapter(
  "kling",
  { usdPerSecond: 0.16, secondsPerClip: 90, queueOverheadSeconds: 15 },
  "TODO: confirm Kling endpoint + auth scheme, then implement submit/poll.",
);
