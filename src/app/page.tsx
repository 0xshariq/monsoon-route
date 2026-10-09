import { AppShell, PageFrame } from "@/components/app-shell";
import { RouteAnalyzer } from "@/components/route-analyzer";

export default function HomePage() {
  return (
    <AppShell>
      <PageFrame
        eyebrow="Rain-aware routing"
        title="Travel safer during monsoon"
        description="Compare live route candidates using forecast rain, waterlogging evidence, and practical travel time."
      >
        <RouteAnalyzer />
      </PageFrame>
    </AppShell>
  );
}
