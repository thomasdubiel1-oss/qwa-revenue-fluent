import { createFileRoute } from "@tanstack/react-router";
import { internalHead } from "@/config/seo";
import { ExecutiveCommandCenter } from "@/routes/internal/executive";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => internalHead("Executive Command Center — QWA Digital Twin"),
  component: ExecutiveCommandCenter,
});
