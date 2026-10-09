"use client";

import { useState } from "react";
import { Bookmark, Clock3, MapPin, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { AppShell, Panel, PageFrame } from "@/components/app-shell";

type RouteRecord = { id: string; route: string; time: string; risk: string; saved: boolean };

const initialRoutes: RouteRecord[] = [
  { id: "mumbai-thane", route: "Mumbai → Thane", time: "Today · 1 hr 20 min", risk: "Low risk", saved: true },
  { id: "thane-navi-mumbai", route: "Thane → Navi Mumbai", time: "Yesterday · 1 hr 05 min", risk: "Moderate risk", saved: false },
  { id: "mumbai-navi-mumbai", route: "Mumbai → Navi Mumbai", time: "Fri, 27 Sep · 1 hr 15 min", risk: "Moderate risk", saved: true },
];

export default function SavedPage() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [tab, setTab] = useState<"recent" | "saved">("recent");
  const visibleRoutes = tab === "saved" ? routes.filter((route) => route.saved) : routes;
  const removeRoute = (id: string) => setRoutes((current) => current.filter((route) => route.id !== id));

  return <AppShell><PageFrame eyebrow="Your routes" title="Saved and recent routes" description="Keep your everyday journeys close at hand."><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-xl border border-white/10 bg-[#0b202d] p-1" role="tablist" aria-label="Route history"><button role="tab" aria-selected={tab === "recent"} onClick={() => setTab("recent")} className={`rounded-lg px-4 py-2 text-xs font-medium ${tab === "recent" ? "bg-[#0e4a86] text-white" : "text-slate-400"}`}>Recent</button><button role="tab" aria-selected={tab === "saved"} onClick={() => setTab("saved")} className={`rounded-lg px-4 py-2 text-xs font-medium ${tab === "saved" ? "bg-[#0e4a86] text-white" : "text-slate-400"}`}>Saved</button></div><Link href="/routes" className="flex items-center gap-2 rounded-lg bg-[#168cff] px-4 py-2 text-xs font-semibold"><Plus className="size-4" />Plan a route</Link></div><Panel className="overflow-hidden"><div className="border-b border-white/10 px-5 py-4"><p className="text-sm font-semibold">{tab === "saved" ? "Saved routes" : "Recent journeys"}</p><p className="mt-1 text-xs text-slate-500">{tab === "saved" ? "Routes you bookmarked for quick access" : "Your latest route comparisons"}</p></div>{visibleRoutes.length ? visibleRoutes.map((route) => <div key={route.id} className="flex items-center gap-4 border-b border-white/10 px-5 py-4 last:border-0"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#09263a]"><MapPin className="size-4 text-[#269fff]" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{route.route}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="size-3" />{route.time}</p></div><span className="hidden rounded-full bg-[#123d2c] px-2.5 py-1 text-[11px] text-[#42db8b] sm:inline">{route.risk}</span><button aria-label={`Remove ${route.route}`} onClick={() => removeRoute(route.id)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5"><Trash2 className="size-4" /></button><button aria-label={`More options for ${route.route}`} onClick={() => setTab(route.saved ? "saved" : "recent")} className="rounded-lg p-2 text-slate-500 hover:bg-white/5"><MoreHorizontal className="size-4" /></button></div>) : <div className="px-5 py-12 text-center text-sm text-slate-400">No {tab} routes yet.</div>}</Panel><div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-white/15 p-4 text-xs text-slate-400"><Bookmark className="size-4 text-[#269fff]" />Saved routes will appear here when you bookmark a comparison.</div></PageFrame></AppShell>;
}
