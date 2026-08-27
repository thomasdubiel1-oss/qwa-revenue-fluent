/**
 * SERVER ONLY. Never import this from a component or any client-reachable
 * module — the `.server.ts` suffix keeps it out of browser bundles.
 *
 * All provider credentials are read here, inside functions, at request time
 * (Cloudflare Workers inject env per-request, so module-scope reads are unsafe).
 * No value in this file may ever be returned to the browser.
 */
import type { ProviderId } from "./types";

/** Server env var names per provider. Add secrets in Project Settings → Secrets. */
export const PROVIDER_ENV: Partial<Record<ProviderId, { apiKey: string; baseUrl: string }>> = {
  veo: { apiKey: "VEO_API_KEY", baseUrl: "VEO_BASE_URL" },
  seedance: { apiKey: "SEEDANCE_API_KEY", baseUrl: "SEEDANCE_BASE_URL" },
  kling: { apiKey: "KLING_API_KEY", baseUrl: "KLING_BASE_URL" },
  runway: { apiKey: "RUNWAY_API_KEY", baseUrl: "RUNWAY_BASE_URL" },
  higgsfield: { apiKey: "HIGGSFIELD_API_KEY", baseUrl: "HIGGSFIELD_BASE_URL" },
  // ltx: intentionally absent — manual-handoff workflow provider, no credentials.
};

export interface ProviderConfig {
  apiKey: string | null;
  /** TODO: confirm the real vendor endpoint before enabling live calls. */
  baseUrl: string | null;
  configured: boolean;
  missingEnv: string[];
}

/** Read a provider's credentials. Call inside a handler, never at module scope. */
export function readProviderConfig(id: ProviderId): ProviderConfig {
  const names = PROVIDER_ENV[id];
  if (!names) {
    // Manual-handoff provider: nothing to read, nothing missing.
    return { apiKey: null, baseUrl: null, configured: false, missingEnv: [] };
  }
  const apiKey = process.env[names.apiKey] ?? null;
  const baseUrl = process.env[names.baseUrl] ?? null;
  const missingEnv = apiKey ? [] : [names.apiKey];
  return { apiKey, baseUrl, configured: missingEnv.length === 0, missingEnv };
}

/** Safe projection for internal UI: presence only, never values. */
export function describeProviderConfig(id: ProviderId): {
  configured: boolean;
  missingEnv: string[];
  hasBaseUrlOverride: boolean;
} {
  const config = readProviderConfig(id);
  return {
    configured: config.configured,
    missingEnv: config.missingEnv,
    hasBaseUrlOverride: config.baseUrl !== null,
  };
}
