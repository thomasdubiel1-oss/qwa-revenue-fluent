import { createFileRoute, Outlet } from "@tanstack/react-router";
import { internalHead } from "@/config/seo";
import { AppAuthBoundary } from "@/components/qwa/auth/app-auth-boundary";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => internalHead("Executive Command Center — QWA Digital Twin"),
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppAuthBoundary>
      <Outlet />
    </AppAuthBoundary>
  );
}
