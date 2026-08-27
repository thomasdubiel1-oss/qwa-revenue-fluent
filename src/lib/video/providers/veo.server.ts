/** SERVER ONLY — Google Veo adapter (integration pending). */
import { createAdapter } from "./base.server";

export const veoAdapter = createAdapter(
  "veo",
  { usdPerSecond: 0.4, secondsPerClip: 110, queueOverheadSeconds: 20 },
  "TODO: wire the Veo video job API (create → poll → download) and store outputs in project storage.",
);
