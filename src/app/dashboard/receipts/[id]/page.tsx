"use client";

import React from "react";
import { 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface ReceiptProps {
  receiptId: string;
  studentName: string;
  studentId: string;
  type: "monthly" | "registration";
  amount: number;
  date: string;
  paymentMethod: string;
  month?: string;
  division?: string;
}

export default function ReceiptView({ params }: { params: { id: string } }) {
  // Mock Data for Receipt (Replace with Supabase)
  const receiptData: ReceiptProps = {
    receiptId: params.id || "RCT-2026-0042",
    studentName: "Aditya Sharma",
    studentId: "MTG-1001",
    type: "monthly",
    amount: 500,
    date: "2026-04-07",
    paymentMethod: "UPI",
    month: "April 2026",
    division: "Gama Abacus"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 animate-in fade-in duration-500 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Controls - Hide on Print */}
        <div className="flex justify-between items-center print:hidden bg-white p-6 rounded-3xl border border-slate-200">
           <Link href="/dashboard/gama-fees" className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
              <ArrowLeft size={18} /> Back to Management
           </Link>
           <div className="flex items-center gap-4">
              <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs hover:shadow-xl hover:shadow-slate-900/20 transition-all">
                 <Printer size={16} /> Print Receipt
              </button>
              <button className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-black text-xs hover:shadow-xl hover:shadow-emerald-500/20 transition-all">
                 <Download size={16} /> Save PDF
              </button>
           </div>
        </div>

        {/* Physical Receipt Mockup */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden print:border-0 print:shadow-none print:rounded-none">
           {/* Receipt Header */}
           <div className="bg-emerald-900 text-white p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 scale-[2]">
                 <CheckCircle2 size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                 <div>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-lg">
                       <span className="text-emerald-900 font-black text-3xl">M</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4 uppercase">Fee Receipt</h1>
                    <p className="text-emerald-100 font-bold text-sm uppercase tracking-[0.4em] opacity-80">Official Proof of Payment</p>
                 </div>
                 <div className="text-right flex flex-col items-start md:items-end gap-2">
                    <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">Receipt ID</p>
                    <h2 className="text-3xl font-extrabold tracking-tighter">#{receiptData.receiptId}</h2>
                    <p className="text-sm font-bold opacity-60 mt-1">{receiptData.date}</p>
                 </div>
              </div>
           </div>

           {/* Receipt Body */}
           <div className="p-20 grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-12">
                 <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Institute Details</h3>
                    <div className="space-y-4">
                       <p className="font-extrabold text-slate-900 text-lg">Micro Tech Computer Center</p>
                       <div className="flex items-start gap-4 text-slate-500 text-sm font-medium">
                          <MapPin size={18} className="text-emerald-500 shrink-0" />
                          <span>Mylakkadu, Kottiyam - Kundara Rd,<br/>Kollam, Kerala 691571</span>
                       </div>
                       <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                          <Phone size={18} className="text-emerald-500 shrink-0" />
                          <span>+91 9747 433 133</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Student Information</h3>
                    <div className="space-y-2">
                       <p className="text-2xl font-black text-slate-900 leading-none mb-2">{receiptData.studentName}</p>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">ID: {receiptData.studentId}</p>
                       <p className="inline-block mt-4 px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                          {receiptData.division}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 flex flex-col items-center justify-center text-center relative">
                 <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 mb-6 text-emerald-500">
                    <CheckCircle2 size={40} />
                 </div>
                 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Payment Status</h4>
                 <h2 className="text-4xl font-black text-emerald-600 mb-8 lowercase tracking-tighter">SUCCESSFUL</h2>
                 
                 <div className="w-full border-t border-dashed border-slate-200 pt-8 mt-4 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-slate-400">Payment Method</span>
                       <span className="text-slate-800">{receiptData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-slate-400">Fee Category</span>
                       <span className="text-slate-800 capitalize">{receiptData.type} Fee</span>
                    </div>
                    {receiptData.month && (
                       <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-400">For Month</span>
                          <span className="text-slate-800">{receiptData.month}</span>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Total Amount Banner */}
           <div className="bg-slate-900 p-12 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col gap-1">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Amount Collected</p>
                 <h2 className="text-5xl font-black text-white tracking-tighter">₹{receiptData.amount}.00</h2>
              </div>
              <div className="text-right opacity-50">
                 <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Authorized Seal</p>
                 <div className="w-40 h-20 border-2 border-white/20 rounded-2xl flex items-center justify-center italic text-white/20 font-black text-xl">
                    MICROTECH
                 </div>
              </div>
           </div>

           {/* Receipt Footer */}
           <div className="p-10 text-center bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Thank you for choosing MicroTech Center. Please keep this receipt for future inquiries.
           </div>
        </div>

        {/* Share Section - Hide on Print */}
        <div className="flex flex-col items-center gap-6 print:hidden">
           <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Share this proof</p>
           <div className="flex gap-4">
              <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl shadow-slate-200/50 hover:shadow-emerald-500/10 transition-all">
                 <Share2 size={24} />
              </button>
              <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-slate-200/50 hover:shadow-blue-500/10 transition-all">
                 <Mail size={24} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
