"use client";

import React from "react";
import Link from "next/link";

export default function DashboardShell() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h2 className="text-xl font-bold mb-8">MicroTech Admin</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block py-2 px-4 bg-slate-700 rounded">Analysis</Link>
          <Link href="/dashboard/students" className="block py-2 px-4 hover:bg-slate-700 rounded">Students</Link>
          <Link href="/dashboard/courses" className="block py-2 px-4 hover:bg-slate-700 rounded">Course Management</Link>
          <Link href="/dashboard/fees" className="block py-2 px-4 hover:bg-slate-700 rounded">Fee Management</Link>
          <Link href="/" className="block py-2 px-4 hover:bg-slate-700 border-t border-slate-600 mt-8">Back to Website</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-semibold text-slate-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, Administrator</span>
            <div className="w-10 h-10 rounded-full bg-slate-300"></div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: "Total Students", value: "1,240", change: "+12.5%", color: "blue" },
            { label: "Active Courses", value: "72", change: "Stable", color: "green" },
            { label: "Monthly Revenue", value: "₹4,20,000", change: "+5.2%", color: "teal" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className={`text-xs mt-2 ${stat.change.includes("+") ? "text-green-500" : "text-slate-400"}`}>
                {stat.change} vs last month
              </p>
            </div>
          ))}
        </section>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activities</h3>
          <div className="space-y-4 text-sm text-slate-600">
             <p className="pb-4 border-b border-slate-50">New student enrollment in CAPT Python Course ... <span className="float-right text-xs">2 mins ago</span></p>
             <p className="pb-4 border-b border-slate-50">Fee receipt generated for Student #MT2025 ... <span className="float-right text-xs">15 mins ago</span></p>
             <p className="pb-4 border-b border-slate-50">Course "Fashion Illustration" updated by Admin ... <span className="float-right text-xs">1 hr ago</span></p>
          </div>
        </div>
      </main>
    </div>
  );
}
