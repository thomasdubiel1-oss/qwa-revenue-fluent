import assert from "node:assert/strict";
import test from "node:test";
import { classifyWebhookError, validateWebhookDestination } from "../src/lib/leads/webhook-policy.ts";

test("allow HTTPS webhook hosts and reject unsafe destinations", () => {
  assert.equal(validateWebhookDestination("https://example.com/hook"), "https://example.com/hook");
  for (const url of ["http://example.com", "https://localhost/path", "https://127.0.0.1", "https://[::1]", "https://admin:pw@example.com", "file:///tmp/x", "not a url", "https://test.local/hook"]) {
    assert.equal(validateWebhookDestination(url), null, url);
  }
});

test("classify delivery failures without leaking arbitrary exception strings", () => {
  assert.equal(classifyWebhookError(new Error("http_429")), "http_429");
  assert.equal(classifyWebhookError(new Error("secret token is abc")), "delivery_network_error");
  assert.equal(classifyWebhookError(Object.assign(new Error("sensitive"), { name: "TimeoutError" })), "timeout");
});
