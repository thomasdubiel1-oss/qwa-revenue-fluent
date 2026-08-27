/** SERVER ONLY — provider registry. Add a new provider here and nowhere else. */
import type { ProviderId, VideoProviderAdapter } from "../types";
import { veoAdapter } from "./veo.server";
import { seedanceAdapter } from "./seedance.server";
import { klingAdapter } from "./kling.server";
import { runwayAdapter } from "./runway.server";
import { higgsfieldAdapter } from "./higgsfield.server";
import { ltxAdapter } from "./ltx.server";

export const ADAPTERS: Record<ProviderId, VideoProviderAdapter> = {
  veo: veoAdapter,
  seedance: seedanceAdapter,
  kling: klingAdapter,
  runway: runwayAdapter,
  higgsfield: higgsfieldAdapter,
  ltx: ltxAdapter,
};

export function listAdapters(): VideoProviderAdapter[] {
  return Object.values(ADAPTERS);
}

/** Adapters that generate delivered shots — the ranking pool. */
export function listShotAdapters(): VideoProviderAdapter[] {
  return listAdapters().filter((a) => a.capabilities.role === "shot_generation");
}

/** Planning / pre-production adapters (storyboard, shot plan, rough cut). */
export function listPlanningAdapters(): VideoProviderAdapter[] {
  return listAdapters().filter((a) => a.capabilities.role === "planning");
}

export function getAdapter(id: ProviderId): VideoProviderAdapter {
  return ADAPTERS[id];
}
