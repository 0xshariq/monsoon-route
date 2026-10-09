import { ArrowRight, CloudRain, MapPinned, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AppShell, PageFrame, Panel } from "@/components/app-shell";
import { RouteAnalyzer } from "@/components/route-analyzer";

export default function RoutesPage() {
  return <AppShell><PageFrame eyebrow="Route comparison" title="Compare safer routes" description="Use live weather, route geometry, and waterlogging evidence to choose with confidence."><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><RouteAnalyzer /><Panel className="p-5"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#27a7ff]">How it works</p><div className="mt-5 flex flex-col gap-5">{[[MapPinned,"Live geometry","We compare the routes returned by Google Maps."],[CloudRain,"Weather-aware","Forecast rain is checked along the route corridor."],[ShieldCheck,"Practical decision","Risk and travel time are balanced together."]].map(([Icon,title,copy])=><div key={title as string} className="flex gap-3"><Icon className="mt-0.5 size-5 shrink-0 text-[#42db8b]"/><div><h2 className="text-sm font-semibold">{title as string}</h2><p className="mt-1 text-xs leading-relaxed text-slate-400">{copy as string}</p></div></div>)}</div><Link href="/routes/saved" className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-[#56b4ff]">View saved routes <ArrowRight className="size-4"/></Link></Panel></div></PageFrame></AppShell>;
}
