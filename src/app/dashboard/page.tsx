"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  IndianRupee, 
  ArrowUpRight, 
  Clock, 
  FileText 
} from "lucide-react";

export default function AnalysisOverview() {
  return (
    <div className="p-10 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col gap-1.5 border-b border-slate-200/50 pb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-500 font-medium">Real-time performance metrics and recent center activities.</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Students", value: "1,240", change: "+12.5%", icon: Users, color: "blue" },
          { label: "Active Courses", value: "72", change: "Stable", icon: BookOpen, color: "emerald" },
          { label: "Monthly Revenue", value: "₹4,20,000", change: "+5.2%", icon: IndianRupee, color: "teal" },
          { label: "Pending Fees", value: "₹45,500", change: "-2.1%", icon: ArrowUpRight, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200/50 group hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-${stat.color}-500/10 rounded-2xl text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                <stat.icon size={26} strokeWidth={2} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes("+") ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-600"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-sm border border-slate-200/50">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-3">
               <Clock className="text-emerald-500" />
               <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activities</h3>
             </div>
             <button className="text-sm font-bold text-emerald-500 hover:underline">View All</button>
          </div>
          <div className="space-y-6">
             {[
               { text: 'New student enrollment in CAPT Python Course', time: '2 mins ago', icon: Users },
               { text: 'Fee receipt generated for Student #MT2025', time: '15 mins ago', icon: FileText },
               { text: 'Course "Fashion Illustration" updated by Admin', time: '1 hr ago', icon: BookOpen },
               { text: 'Scholarship applied to 5 new Gama students', time: '4 hrs ago', icon: IndianRupee },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-6 pb-6 border-b border-slate-100 last:border-0 group cursor-default">
                 <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-emerald-500 transition-colors">
                   <item.icon size={18} />
                 </div>
                 <p className="flex-1 text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">{item.text}</p>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-emerald-600 p-10 rounded-3xl shadow-2xl shadow-emerald-600/20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <TrendingUp size={160} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-black mb-4 relative z-10">Center Growth</h3>
          <p className="text-emerald-100 text-sm font-medium mb-10 relative z-10 leading-relaxed">
            Your center has seen a 12% increase in new enrollments this quarter. Most growth coming from Gama Abacus.
          </p>
          <button className="bg-white text-emerald-600 py-3 px-8 rounded-2xl font-black text-sm relative z-10 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-emerald-900/10">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
