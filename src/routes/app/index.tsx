import { createFileRoute } from "@tanstack/react-router";
import { ExecutiveCommandCenter } from "@/routes/internal/executive";

export const Route = createFileRoute("/app/")({
  component: ExecutiveCommandCenter,
});
