import { AppShell, PageFrame } from "@/components/app-shell";
import { RouteAnalyzer } from "@/components/route-analyzer";

export default function RoutesPage() {
  return (
    <AppShell>
      <PageFrame
        eyebrow="Route comparison"
        title="Analyze a safer route"
        description="Choose your origin and destination to compare route risk with live provider data."
      >
        <RouteAnalyzer />
      </PageFrame>
    </AppShell>
  );
}
