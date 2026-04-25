"use client";

import React, { useState } from "react";
import { 
  X, 
  IndianRupee, 
  CreditCard, 
  Calendar, 
  User, 
  FileText,
  AlertCircle,
  Tag,
  Search,
  Loader2
} from "lucide-react";
import { findStudentByIdOrName, calculateFinalFee } from "@/lib/gama-fees";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function RecordPaymentModal({ isOpen, onClose, onSubmit }: RecordPaymentModalProps) {
  const [feeType, setFeeType] = useState("monthly");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [refId, setRefId] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Search Logic
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setSearching(true);
        try {
          const student = await findStudentByIdOrName(searchQuery);
          if (student) {
            setSelectedStudent(student);
            // Auto-populate based on latest pending month or defaults
            const finalFee = calculateFinalFee(student.monthly_fee_base, student.scholarship_type, student.scholarship_value);
            setAmount(finalFee.toString());
            
            // Suggest first pending month if available
            const pending = student.gama_monthly_fees?.find((f: any) => f.status !== 'paid');
            if (pending) setMonth(pending.month);
            else setMonth(new Date().toISOString().slice(0, 7));
          } else {
            setSelectedStudent(null);
          }
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setSearching(false);
        }
      } else {
        setSelectedStudent(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Record Payment</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Transaction Proof System</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-200 rounded-2xl transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form className="p-10" onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Search Placeholder */}
            <div className="col-span-1 border-b border-slate-100 pb-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Student Identification</label>
              <div className="relative">
                {searching ? (
                  <Loader2 className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin" size={18} />
                ) : (
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                )}
                <input 
                  type="text" 
                  placeholder="Student ID or Name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 py-2 font-extrabold text-slate-800 placeholder:text-slate-200 focus:outline-none focus:ring-0 text-sm"
                  required
                />
              </div>
              {selectedStudent && (
                <p className="text-[10px] text-emerald-500 font-bold mt-1 animate-in fade-in">
                  Found: {selectedStudent.name} ({selectedStudent.student_id || 'No ID'})
                </p>
              )}
            </div>

            {/* Fee Type Selection */}
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Fee Type</label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                 {["registration", "monthly"].map(type => (
                   <button 
                     key={type}
                     type="button"
                     onClick={() => setFeeType(type)}
                     className={`flex-1 py-2 rounded-xl text-xs font-black capitalize transition-all ${feeType === type ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
                   >
                     {type}
                   </button>
                 ))}
              </div>
            </div>

            {/* Amount Field */}
            <div className="col-span-1 group">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-emerald-500 transition-colors">Amount Paid</label>
               <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600"><IndianRupee size={18} /></div>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent w-full text-xl font-black text-slate-800 placeholder:text-slate-300 focus:outline-none"
                    required
                  />
               </div>
            </div>

            {/* Date/Month for fee */}
            <div className="col-span-1 group">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-emerald-500 transition-colors">
                 {feeType === "monthly" ? "Month Selection" : "Payment Date"}
               </label>
               <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500"><Calendar size={18} /></div>
                  <input 
                    type={feeType === "monthly" ? "month" : "date"}
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-transparent w-full text-sm font-bold text-slate-700 focus:outline-none"
                    required
                  />
               </div>
            </div>

            {/* Payment Method */}
            <div className="col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Payment Method</label>
               <div className="grid grid-cols-3 gap-4">
                  {["UPI", "Cash", "Bank"].map(method => (
                    <button 
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`
                        flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all
                        ${paymentMethod === method 
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 shadow-xl shadow-emerald-500/5 font-black" 
                          : "border-slate-100 bg-slate-50 text-slate-400 font-bold hover:bg-slate-100/80"}
                      `}
                    >
                      <CreditCard size={20} className={paymentMethod === method ? "text-emerald-500" : "text-slate-300"} />
                      <span className="text-xs uppercase tracking-widest">{method}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Transaction Ref */}
            <div className="col-span-2 group">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-emerald-500 transition-colors">Transaction Reference ID / Notes</label>
               <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400"><Tag size={18} /></div>
                  <input 
                    type="text" 
                    placeholder="Ref: TXN12345 or Notes..." 
                    className="bg-transparent w-full text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none"
                  />
               </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
             <button 
               type="button"
               onClick={onClose}
               className="flex-1 py-4 bg-slate-50 text-slate-400 font-black text-sm rounded-2xl hover:bg-slate-100 transition-all"
             >
               Discard
             </button>
             <button 
               type="submit"
               className="flex-[2] py-4 bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all active:scale-95 translate-0"
             >
               Complete & Generate Receipt
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
