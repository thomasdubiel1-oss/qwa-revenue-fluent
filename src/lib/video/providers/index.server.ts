/** SERVER ONLY — provider registry. Add a new provider here and nowhere else. */
import type { ProviderId, VideoProviderAdapter } from "../types";
import { veoAdapter } from "./veo.server";
import { seedanceAdapter } from "./seedance.server";
import { klingAdapter } from "./kling.server";
import { runwayAdapter } from "./runway.server";
import { higgsfieldAdapter } from "./higgsfield.server";

export const ADAPTERS: Record<ProviderId, VideoProviderAdapter> = {
  veo: veoAdapter,
  seedance: seedanceAdapter,
  kling: klingAdapter,
  runway: runwayAdapter,
  higgsfield: higgsfieldAdapter,
};

export function listAdapters(): VideoProviderAdapter[] {
  return Object.values(ADAPTERS);
}

export function getAdapter(id: ProviderId): VideoProviderAdapter {
  return ADAPTERS[id];
}
