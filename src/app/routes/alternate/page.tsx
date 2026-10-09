import Link from "next/link";
import { ArrowLeft, CloudRain, Clock3, Gauge, ShieldCheck } from "lucide-react";
import { AppShell, PageFrame, Panel } from "@/components/app-shell";
import { LiveMap } from "@/components/live-map";

const alternatives = [
  { name: "Western Express Highway", time: "1 hr 12 min", distance: "32 km", risk: "Lower exposure", tone: "green" },
  { name: "Eastern Express Highway", time: "1 hr 18 min", distance: "35 km", risk: "Moderate rain", tone: "blue" },
  { name: "Sion–Panvel Highway", time: "1 hr 26 min", distance: "39 km", risk: "Higher exposure", tone: "coral" },
];

export default function AlternateRoutesPage() {
  return <AppShell><PageFrame eyebrow="Alternate routes" title="Compare route options" description="Use the live map and current conditions to choose a practical alternative."><Link href="/routes" className="mb-5 inline-flex items-center gap-2 text-xs text-[#2ba8ff]"><ArrowLeft className="size-3" />Back to routes</Link><div className="grid gap-5 xl:grid-cols-[1.35fr_.8fr]"><LiveMap /><div className="flex flex-col gap-3">{alternatives.map((route, index) => <Panel key={route.name} className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs text-slate-500">{index === 0 ? "Recommended alternative" : `Alternative ${index + 1}`}</p><h2 className="mt-1 text-base font-semibold">{route.name}</h2></div>{index === 0 ? <ShieldCheck className="size-5 text-[#42db8b]" /> : null}</div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><span className="flex items-center gap-2 text-slate-300"><Clock3 className="size-4 text-[#269fff]" />{route.time}</span><span className="flex items-center gap-2 text-slate-300"><Gauge className="size-4 text-[#269fff]" />{route.distance}</span></div><p className={`mt-4 flex items-center gap-2 text-xs ${route.tone === "green" ? "text-[#42db8b]" : route.tone === "coral" ? "text-[#ff6a78]" : "text-[#8db8d8]"}`}><CloudRain className="size-4" />{route.risk}</p></Panel>)}</div></div></PageFrame></AppShell>;
}
