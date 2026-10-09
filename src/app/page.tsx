import { AppShell, MapMock, PageFrame } from "@/components/app-shell";
import { RouteAnalyzer } from "@/components/route-analyzer";

export default function HomePage() {
  return (
    <AppShell>
      <PageFrame
        eyebrow="Rain-aware routing"
        title="Travel safer during monsoon"
        description="Compare live route candidates using forecast rain, waterlogging evidence, and practical travel time."
        centered
      >
        <div className="mx-auto grid max-w-[1056px] overflow-hidden rounded-xl border-2 border-[#168cff] bg-[#102c63] shadow-[0_0_28px_rgba(22,140,255,.16)] lg:grid-cols-[1fr_1fr]">
          <div className="p-5 sm:p-7"><RouteAnalyzer /></div>
          <div className="min-h-[330px] lg:min-h-[350px]"><MapMock /></div>
        </div>
      </PageFrame>
    </AppShell>
  );
}
