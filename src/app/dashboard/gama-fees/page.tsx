"use client";

import React, { useState, useMemo } from "react";
import { 
  IndianRupee, 
  Users, 
  AlertCircle, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Receipt,
  Download,
  Share2
} from "lucide-react";

import RecordPaymentModal from "./RecordPaymentModal";

// Mock Data (To be replaced with Supabase)
const MOCK_STUDENTS = [
  { 
    id: "1001", 
    name: "Aditya Sharma", 
    monthlyFee: 600, 
    scholarship: { type: "fixed", value: 100 }, 
    enrolledAt: "2026-01-10",
    registrationPaid: true,
    lastPaymentDate: "2026-03-05",
    paidMonths: 3,
    pendingMonthsCount: 1, // April pending
  },
  { 
    id: "1002", 
    name: "Sneha Reddy", 
    monthlyFee: 600, 
    scholarship: { type: "percent", value: 10 }, 
    enrolledAt: "2026-02-15",
    registrationPaid: true,
    lastPaymentDate: "2026-03-02",
    paidMonths: 2,
    pendingMonthsCount: 1,
  },
  { 
    id: "1003", 
    name: "Rahul Mehra", 
    monthlyFee: 600, 
    scholarship: { type: "none", value: 0 }, 
    enrolledAt: "2025-12-05",
    registrationPaid: true,
    lastPaymentDate: "2026-01-20",
    paidMonths: 2,
    pendingMonthsCount: 3, // Overdue
  },
];

export default function GamaFeesPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM
  const isAfterDueDay = today.getDate() > 5;

  // Final Fee Calculation Engine
  const calculateFinalFee = (base: number, scholarship: any) => {
    if (scholarship.type === "fixed") return Math.max(0, base - scholarship.value);
    if (scholarship.type === "percent") return Math.max(0, base * (1 - scholarship.value / 100));
    return base;
  };

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery);
      const status = s.pendingMonthsCount > 0 ? (isAfterDueDay ? "overdue" : "pending") : "paid";
      const matchesFilter = filterStatus === "all" || status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus, isAfterDueDay]);

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200/50 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gama Fee Management</h1>
          <p className="text-slate-500 font-medium">Tracking and processing mental arithmetic training fees.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 px-6 py-2.5 rounded-xl text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} /> Record Payment
          </button>
        </div>
      </header>

      {/* Record Payment Modal */}
      <RecordPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => {
          console.log("Recording payment:", data);
          setIsModalOpen(false);
          // TODO: Add Supabase call here
        }}
      />

      {/* Division Analytics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600"><IndianRupee size={22} /></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Collected (Apr)</p>
           </div>
           <h3 className="text-2xl font-black text-slate-800 tracking-tight">₹14,500</h3>
           <p className="text-xs text-slate-400 mt-2 font-semibold">68% of expected revenue</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600"><Clock size={22} /></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending</p>
           </div>
           <h3 className="text-2xl font-black text-slate-800 tracking-tight">₹6,200</h3>
           <p className="text-xs text-slate-400 mt-2 font-semibold">12 students remaining</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-600"><AlertCircle size={22} /></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Overdue</p>
           </div>
           <h3 className="text-2xl font-black text-slate-800 tracking-tight">₹4,800</h3>
           <p className="text-xs text-red-500 mt-2 font-bold animate-pulse">Critical collection required</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600"><ArrowUpRight size={22} /></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">One-time Reg</p>
           </div>
           <h3 className="text-2xl font-black text-slate-800 tracking-tight">₹4,000</h3>
           <p className="text-xs text-slate-400 mt-2 font-semibold">4 new admissions this month</p>
        </div>
      </section>

      {/* Tabs & Controls */}
      <div className="bg-white rounded-[2.5rem] p-4 border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 border-b border-slate-100">
           <div className="flex bg-slate-100/80 p-1.5 rounded-2xl">
              {["summary", "monthly", "transactions"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-xl text-sm font-extrabold capitalize transition-all ${activeTab === tab ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by student name or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
           </div>
        </div>

        {/* Dynamic Content */}
        <div className="overflow-x-auto">
          {activeTab === "summary" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reg. Fee</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Monthly Fee</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paid Months</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pending</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => {
                  const finalMonthlyFee = calculateFinalFee(student.monthlyFee, student.scholarship);
                  const isOverdue = student.pendingMonthsCount > 0 && isAfterDueDay;
                  const isPending = student.pendingMonthsCount > 0 && !isAfterDueDay;
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 leading-none mb-1">{student.name}</p>
                            <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">#{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {student.registrationPaid ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 size={14} /> ₹1,000
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-xs italic">Pending</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <p className="font-extrabold text-slate-800 text-sm">₹{finalMonthlyFee}</p>
                           {student.scholarship.type !== "none" && (
                              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                                {student.scholarship.type === "fixed" ? `₹${student.scholarship.value} OFF` : `${student.scholarship.value}% OFF`}
                              </p>
                           )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-700">{student.paidMonths} Months</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Last: {student.lastPaymentDate}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-sm font-black ${student.pendingMonthsCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                          {student.pendingMonthsCount} Months
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`
                          inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${isOverdue ? "bg-red-50 text-red-600" : 
                            isPending ? "bg-amber-50 text-amber-600" : 
                            "bg-emerald-50 text-emerald-600"}
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isOverdue ? "bg-red-600" : isPending ? "bg-amber-600" : "bg-emerald-600"} ${isOverdue ? "animate-pulse" : ""}`} />
                          {isOverdue ? "Overdue" : isPending ? "Due" : "Paid"}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all" title="Record Payment">
                              <Plus size={18} />
                           </button>
                           <button className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-all" title="View History">
                              <Clock size={18} />
                           </button>
                           <button className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
                              <MoreHorizontal size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          {activeTab === "transactions" && (
             <div className="p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                   <Receipt size={40} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">No Transactions Found</h4>
                <p className="text-slate-500 font-medium">Recent payment records will appear here.</p>
             </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-400 tracking-wider">Showing {filteredStudents.length} of {MOCK_STUDENTS.length} Gama Students</p>
           <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 bg-slate-900 rounded-xl text-xs font-bold text-white shadow-lg shadow-slate-900/10">Next</button>
           </div>
        </div>
      </div>

      {/* Note Placeholder */}
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl flex items-start gap-4">
         <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600 mt-1"><AlertCircle size={20} /></div>
         <div>
            <h4 className="text-emerald-900 font-extrabold mb-1 tracking-tight uppercase text-[10px]">Collection Policy</h4>
            <p className="text-emerald-800 text-sm font-semibold opacity-80 leading-relaxed">
              All students are required to clear monthly fees by the 5th of every month. Automatic reminders will be triggered for overdue students on the 6th.
            </p>
         </div>
      </div>
    </div>
  );
}
