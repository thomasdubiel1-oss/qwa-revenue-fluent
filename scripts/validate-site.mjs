import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const failures = [];

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function walk(path) {
  const absolute = join(root, path);
  return readdirSync(absolute).flatMap((name) => {
    const child = join(absolute, name);
    return statSync(child).isDirectory() ? walk(relative(root, child)) : [relative(root, child)];
  });
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function stringArray(source, exportName) {
  const match = source.match(
    new RegExp(`export const ${exportName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`),
  );
  check(match, `Could not read ${exportName} from src/config/site.ts`);
  return match ? [...match[1].matchAll(/"(\/[^"]*)"/g)].map((item) => item[1]) : [];
}

function publicRoutes(source) {
  const match = source.match(/export const PUBLIC_ROUTES[^=]*=\s*\[([\s\S]*?)\];/);
  check(match, "Could not read PUBLIC_ROUTES from src/config/seo.ts");
  return match ? [...match[1].matchAll(/path:\s*"(\/[^"]*)"/g)].map((item) => item[1]) : [];
}

function routeFromFile(file) {
  let route = file
    .replace(/^src[\\/]routes[\\/]/, "")
    .replace(/\.(tsx?|jsx?)$/, "")
    .split(sep)
    .join("/")
    .replace(/\/index$/, "")
    .replace(/^index$/, "")
    .replace(/\[\.\]/g, ".");
  return `/${route}`.replace(/\/$/, "") || "/";
}

const siteConfig = read("src/config/site.ts");
const seoConfig = read("src/config/seo.ts");
const liveRoutes = stringArray(siteConfig, "liveRoutes");
const indexedRoutes = publicRoutes(seoConfig);
const routeFiles = walk("src/routes").filter(
  (file) => extname(file) === ".tsx" && !file.endsWith("__root.tsx"),
);
const implementedPublicRoutes = routeFiles
  .map(routeFromFile)
  .filter(
    (route) =>
      !route.startsWith("/api/") &&
      route !== "/app" &&
      !route.startsWith("/app/") &&
      !route.startsWith("/internal/") &&
      route !== "/robots.txt" &&
      route !== "/sitemap.xml" &&
      route !== "/README",
  );

for (const route of liveRoutes) {
  check(implementedPublicRoutes.includes(route), `Live navigation route has no page: ${route}`);
}

for (const route of implementedPublicRoutes) {
  check(liveRoutes.includes(route), `Public page is missing from liveRoutes: ${route}`);
  check(indexedRoutes.includes(route), `Public page is missing from PUBLIC_ROUTES: ${route}`);
}

for (const route of indexedRoutes) {
  check(implementedPublicRoutes.includes(route), `Sitemap route has no page: ${route}`);
}

check(new Set(liveRoutes).size === liveRoutes.length, "liveRoutes contains duplicate entries");
check(
  new Set(indexedRoutes).size === indexedRoutes.length,
  "PUBLIC_ROUTES contains duplicate entries",
);

const envExample = read(".env.example");
for (const line of envExample.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...value] = trimmed.split("=");
  check(value.join("=").trim() === "", `.env.example must not contain a value for ${key}`);
}

const browserFiles = walk("src").filter(
  (file) =>
    /\.(ts|tsx|js|jsx)$/.test(file) &&
    !file.endsWith(".server.ts") &&
    !file.endsWith(".server.tsx") &&
    !file.includes(`${sep}routes${sep}api${sep}`),
);
const serverOnlyNames = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "INTERNAL_OPS_TOKEN",
  "LOVABLE_CRON_SECRET",
  "LEAD_WEBHOOK_TOKEN",
];

for (const file of browserFiles) {
  const source = read(file);
  for (const secretName of serverOnlyNames) {
    check(
      !source.includes(`process.env[\"${secretName}\"]`) &&
        !source.includes(`process.env['${secretName}']`),
      `Browser-reachable file references server secret ${secretName}: ${file}`,
    );
  }
}

for (const required of [
  "src/routes/robots[.]txt.ts",
  "src/routes/sitemap[.]xml.ts",
  "src/routes/privacy.tsx",
  "src/routes/terms.tsx",
  "supabase/config.toml",
]) {
  check(existsSync(join(root, required)), `Required launch file is missing: ${required}`);
}

if (failures.length) {
  console.error(`QWA site validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `QWA site validation passed: ${implementedPublicRoutes.length} public pages, ${liveRoutes.length} live routes, ${indexedRoutes.length} sitemap entries.`,
);
