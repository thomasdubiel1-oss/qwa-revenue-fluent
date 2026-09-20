/**
 * Phase 10 regression tests — server boundaries, secret containment, and
 * internal-surface hygiene. These are static source assertions: they read files
 * from the repository and never contact the database or mutate any data.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");
const list = (rel: string) => readdirSync(path.join(root, rel));

const OPS_FUNCTION_FILES = list("src/lib/ops").filter((f) => f.endsWith(".functions.ts"));
const INTERNAL_ROUTES = list("src/routes/internal").filter((f) => f.endsWith(".tsx"));

test("internal server functions exist and are discoverable", () => {
  assert.ok(OPS_FUNCTION_FILES.length >= 5, "expected the ops server-function modules");
  assert.ok(INTERNAL_ROUTES.length >= 5, "expected the internal console routes");
});

test("every internal server function authorizes server-side", () => {
  for (const file of OPS_FUNCTION_FILES) {
    const source = read(`src/lib/ops/${file}`);
    // Split on the exported server-function declarations so each handler is
    // inspected on its own.
    const blocks = source.split(/export const /).slice(1);
    const serverFns = blocks.filter((b) => b.includes("createServerFn"));
    assert.ok(serverFns.length > 0, `${file} declares no server functions`);
    for (const block of serverFns) {
      const name = block.slice(0, block.indexOf(" "));
      assert.match(
        block,
        /requireInternalAccess\("(viewer|ops|admin)"\)/,
        `${file}:${name} does not call requireInternalAccess with a literal minimum role`,
      );
    }
  }
});

test("no internal server function trusts a client-supplied role or access key", () => {
  for (const file of OPS_FUNCTION_FILES) {
    const source = read(`src/lib/ops/${file}`);
    assert.doesNotMatch(source, /INTERNAL_OPS_TOKEN|opsKey|accessKey|ops-key/i, `${file}`);
  }
});

test("shared-token plumbing is fully removed from the codebase", () => {
  const scan = (dir: string): string[] =>
    list(dir).flatMap((entry) => {
      const rel = `${dir}/${entry}`;
      try {
        return entry.includes(".") ? [rel] : scan(rel);
      } catch {
        return [];
      }
    });
  const files = scan("src").filter((f) => /\.(ts|tsx)$/.test(f));
  for (const file of files) {
    assert.doesNotMatch(read(file), /INTERNAL_OPS_TOKEN|qwa:ops-key|checkOpsAccess/, file);
  }
});

test("the service-role client is only reachable from server-only modules", () => {
  const scan = (dir: string): string[] =>
    list(dir).flatMap((entry) => {
      const rel = `${dir}/${entry}`;
      try {
        return entry.includes(".") ? [rel] : scan(rel);
      } catch {
        return [];
      }
    });
  const offenders = scan("src")
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .filter((f) => read(f).includes("integrations/supabase/client.server"))
    .filter((f) => !f.endsWith(".server.ts"));

  // Server-function modules may only reach it through a dynamic import inside a
  // handler, never a static import.
  for (const file of offenders) {
    const source = read(file);
    assert.doesNotMatch(
      source,
      /^import .*client\.server/m,
      `${file} statically imports the service-role client`,
    );
    assert.match(source, /await import\(["']@\/integrations\/supabase\/client\.server["']\)/, file);
  }
});

test("no secret-shaped credential is hardcoded in the source tree", () => {
  const scan = (dir: string): string[] =>
    list(dir).flatMap((entry) => {
      const rel = `${dir}/${entry}`;
      try {
        return entry.includes(".") ? [rel] : scan(rel);
      } catch {
        return [];
      }
    });
  const files = [...scan("src"), ...scan("scripts")].filter((f) => /\.(ts|tsx|mjs|js)$/.test(f));
  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /sb_secret_[A-Za-z0-9_-]{5,}/, `${file} contains a secret key`);
    assert.doesNotMatch(
      source,
      /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./,
      `${file} contains a JWT literal`,
    );
    assert.doesNotMatch(
      source,
      /SERVICE_ROLE_KEY["'\]]*\s*(\)|,|;)?\s*\)?\s*;?\s*(?=.*console\.(log|info))/,
      `${file} may log the service role key`,
    );
  }
});

test("the service-role key is never sent to the browser bundle", () => {
  const serverClient = read("src/integrations/supabase/client.server.ts");
  assert.match(serverClient, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(serverClient, /import\.meta\.env\[?["']VITE_SUPABASE_SERVICE/);
});

test("internal consoles are noindex and never server-rendered", () => {
  for (const file of INTERNAL_ROUTES) {
    const source = read(`src/routes/internal/${file}`);
    assert.match(source, /ssr:\s*false/, `${file} must not be server-rendered`);
    assert.match(source, /internalHead\(/, `${file} must emit internal head metadata`);
  }
  const seo = read("src/config/seo.ts");
  assert.match(seo, /noindex, nofollow, noarchive/);
});

test("internal and API routes never enter the public sitemap or nav", () => {
  const seo = read("src/config/seo.ts");
  const publicBlock = seo.slice(seo.indexOf("PUBLIC_ROUTES"), seo.indexOf("internalHead"));
  assert.doesNotMatch(publicBlock, /\/internal/, "internal route leaked into PUBLIC_ROUTES");
  assert.doesNotMatch(publicBlock, /\/api\//, "api route leaked into PUBLIC_ROUTES");

  for (const file of ["src/components/qwa/site-header.tsx", "src/components/qwa/site-footer.tsx"]) {
    assert.doesNotMatch(read(file), /\/internal\//, `${file} links to an internal console`);
  }
});

test("every internal console is wrapped in the server-verified access gate", () => {
  for (const file of INTERNAL_ROUTES) {
    const source = read(`src/routes/internal/${file}`);
    assert.match(source, /InternalGate/, `${file} is not wrapped in InternalGate`);
  }
});

test("the admin access console requires the admin role at the gate", () => {
  assert.match(read("src/routes/internal/access.tsx"), /minRole="admin"/);
});

test("the one-time first-admin bootstrap endpoint no longer exists", () => {
  const apiRoutes = (() => {
    try {
      return list("src/routes/api");
    } catch {
      return [];
    }
  })();
  assert.ok(!apiRoutes.includes("internal"), "internal API routes should be absent");
  const scan = (dir: string): string[] =>
    list(dir).flatMap((entry) => {
      const rel = `${dir}/${entry}`;
      try {
        return entry.includes(".") ? [rel] : scan(rel);
      } catch {
        return [];
      }
    });
  for (const file of scan("src").filter((f) => /\.(ts|tsx)$/.test(f))) {
    assert.doesNotMatch(read(file), /bootstrap-first-admin|bootstrapFirstAdmin/, file);
  }
});
