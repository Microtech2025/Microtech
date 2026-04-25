"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  IndianRupee, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/dashboard/students", icon: Users },
    { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
    { label: "Gama Fees", href: "/dashboard/gama-fees", icon: IndianRupee },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl relative z-20">
        <div className="p-8 pb-12">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-emerald-500/20">
              M
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">MicroTech</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Admin Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3.5 py-3 px-4 rounded-xl transition-all duration-300 group
                    ${active 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-semibold" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }
                  `}
                >
                  <item.icon size={20} className={active ? "text-white" : "group-hover:scale-110 transition-transform"} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight size={14} className="opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800/50 space-y-4">
          <div className="flex items-center gap-4 py-2 px-1">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold">
              MT
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Administrator</p>
              <p className="text-[10px] text-slate-500 font-medium">Head Office</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 py-2.5 px-3 text-slate-500 hover:text-white transition-colors text-sm font-medium">
            <LogOut size={18} />
            <span>Back to Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#f1f5f9]">
        {children}
      </main>
    </div>
  );
}
