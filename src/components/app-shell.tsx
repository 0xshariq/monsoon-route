"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudRain, Map, Route, CloudSun, Info, Settings, Moon, Cloud } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  ["Home", "/", CloudRain],
  ["Map", "/map", Map],
  ["Routes", "/routes", Route],
  ["Weather", "/weather", CloudSun],
  ["About", "/about", Info],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#06131c] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06131c]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-[#168cff] shadow-[0_0_24px_rgba(22,140,255,.35)]"><Cloud className="size-5 text-white" /></span>
            <span>Monsoon<span className="text-[#22a5ff]">Route</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {nav.map(([label, href, Icon]) => (
              <Link key={href} href={href} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${pathname === href ? "bg-[#0e4a86] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon className="size-3.5" />{label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/settings" aria-label="Settings" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><Settings className="size-4" /></Link>
            <button aria-label="Toggle theme" className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white"><Moon className="size-4" /></button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden" aria-label="Mobile navigation">
          {nav.map(([label, href]) => <Link key={href} href={href} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${pathname === href ? "bg-[#0e4a86] text-white" : "text-slate-400"}`}>{label}</Link>)}
        </nav>
      </header>
      {children}
    </div>
  );
}

export function PageFrame({ eyebrow, title, description, children, centered = false }: { eyebrow?: string; title: string; description?: string; children: ReactNode; centered?: boolean }) {
  return <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:py-10"><div className={`mb-7 ${centered ? "text-center" : ""}`}>{eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-[#27a7ff]">{eyebrow}</p>}<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px]">{title}</h1>{description && <p className={`mt-2 text-sm text-slate-400 ${centered ? "mx-auto max-w-3xl" : "max-w-2xl"}`}>{description}</p>}</div>{children}</main>;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`rounded-2xl border border-white/10 bg-[#0b202d] shadow-2xl shadow-black/10 ${className}`}>{children}</section>; }
export function Metric({ label, value, tone = "blue" }: { label: string; value: string; tone?: string }) { return <div className="rounded-xl border border-white/10 bg-[#091923] p-4"><p className="text-xs text-slate-500">{label}</p><p className={`mt-2 text-lg font-semibold ${tone === "green" ? "text-[#40d88b]" : tone === "amber" ? "text-[#ffc857]" : "text-white"}`}>{value}</p></div>; }
export function MapMock({ compact = false }: { compact?: boolean }) { return <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_30%_40%,#286b68_0,transparent_25%),radial-gradient(circle_at_70%_30%,#163b4a_0,transparent_34%),linear-gradient(135deg,#122d38,#1e554d_48%,#102c3c)] ${compact ? "min-h-[280px]" : "min-h-[440px]"}`}><div className="absolute inset-0 opacity-40 [background-image:linear-gradient(30deg,transparent_47%,#8bd6bf_48%,transparent_49%),linear-gradient(120deg,transparent_47%,#8bd6bf_48%,transparent_49%)] [background-size:90px_90px]" /><div className="absolute left-[18%] top-[62%] h-1 w-[62%] rotate-[-22deg] rounded-full bg-[#24a6ff] shadow-[0_0_16px_#24a6ff]" /><div className="absolute left-[25%] top-[53%] h-1 w-[49%] rotate-[18deg] rounded-full bg-[#fa6474] shadow-[0_0_16px_#fa6474]" /><div className="absolute left-[16%] top-[69%] grid size-8 place-items-center rounded-full bg-[#168cff] text-sm shadow-lg">●</div><div className="absolute right-[17%] top-[25%] grid size-8 place-items-center rounded-full bg-[#f05c68] text-sm shadow-lg">●</div><div className="absolute right-3 top-3 rounded-xl border border-white/10 bg-[#071923]/90 p-3 text-xs text-slate-300"><p className="mb-2 font-medium text-white">Map layers</p><p>◉ Rain radar</p><p>◉ Risk zones</p><p>○ Traffic</p></div><div className="absolute bottom-3 left-3 rounded-lg bg-[#071923]/90 px-3 py-2 text-[11px] text-slate-300">Google Maps · Mumbai region</div></div>; }
