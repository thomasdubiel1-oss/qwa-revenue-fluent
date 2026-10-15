/** Server-side safety policy for destinations receiving lead personal data. */
export function validateWebhookDestination(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
    const host = url.hostname.toLowerCase().replace(/\\.$/, "");
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return null;
    // Avoid obvious literal IP/private network endpoints; production networks must
    // ALSO restrict egress and DNS resolution to prevent DNS rebinding attacks.
    if (/^\\[.*\\]$/.test(host) || /^(?:\\d{1,3}\\.){3}\\d{1,3}$/.test(host)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Never persist arbitrary network error messages, which may include secrets. */
export function classifyWebhookError(error: unknown): string {
  if (error instanceof Error && /^http_\\d{3}$/.test(error.message)) return error.message;
  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) return "timeout";
  return "delivery_network_error";
}
