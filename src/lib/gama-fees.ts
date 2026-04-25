import { supabase } from "./supabase";

export interface Scholarship {
  type: 'none' | 'fixed' | 'percentage';
  value: number;
}

export interface Student {
  id: string;
  name: string;
  monthly_fee_base: number;
  scholarship_type: 'none' | 'fixed' | 'percentage';
  scholarship_value: number;
  [key: string]: any;
}

// 1. Calculate the final fee based on scholarship
export const calculateFinalFee = (base: number, type: string, value: number) => {
  if (type === "fixed") return Math.max(0, base - value);
  if (type === "percentage") return Math.max(0, base * (1 - value / 100));
  return base;
};

// 2. Fetch Gama Students
export const getGamaStudents = async () => {
  const { data, error } = await supabase
    .from('gama_students')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

// 3. Fetch Monthly Fees for a student
export const getMonthlyFeesForStudent = async (studentId: string) => {
  const { data, error } = await supabase
    .from('gama_monthly_fees')
    .select('*')
    .eq('student_id', studentId)
    .order('month', { ascending: false });

  if (error) throw error;
  return data;
};

// 4. Record a Payment (Transaction + Fee Update + Receipt)
export const recordPayment = async (data: {
  studentId: string;
  feeType: 'registration' | 'monthly';
  amount: number;
  paymentMethod: string;
  refId?: string;
  month?: string; // YYYY-MM
  receivedBy?: string;
}) => {
  const timestamp = new Date().toISOString();

  // A. Create Transaction Entry
  const { data: txn, error: txnErr } = await supabase
    .from('transactions')
    .insert({
      student_id: data.studentId,
      fee_type: data.feeType,
      division: 'Gama',
      month: data.month,
      amount: data.amount,
      payment_method: data.paymentMethod,
      reference_id: data.refId,
      received_by: data.receivedBy,
      created_at: timestamp
    })
    .select()
    .single();

  if (txnErr) throw txnErr;

  // B. If Monthly, Update Fee Status
  if (data.feeType === 'monthly' && data.month) {
    const { error: feeErr } = await supabase
      .from('gama_monthly_fees')
      .update({
        status: 'paid',
        paid_date: timestamp
      })
      .match({ student_id: data.studentId, month: data.month });

    if (feeErr) throw feeErr;
  }

  // C. If Registration, Update Student Profile
  if (data.feeType === 'registration') {
     const { error: profErr } = await supabase
       .from('gama_students')
       .update({
         registration_status: 'paid',
         registration_date: timestamp,
         registration_method: data.paymentMethod,
         registration_ref_id: data.refId
       })
       .eq('id', data.studentId);
     
     if (profErr) throw profErr;
  }

  // D. Generate Receipt Data
  const receiptId = `RCT-${Math.floor(1000 + Math.random() * 9000)}-${data.studentId.slice(0,4)}`;
  const { error: rctErr } = await supabase
    .from('receipts')
    .insert({
      id: receiptId,
      transaction_id: txn.id,
      student_id: data.studentId,
      fee_type: data.feeType,
      details: { ...data, timestamp }
    });

  if (rctErr) throw rctErr;

  return { txn, receiptId };
};

// 5. Bulk Operation: Generate Monthly Records for all active students
export const generateBatchMonthlyRecords = async (month: string) => {
  // Fetch active students
  const { data: students, error: sErr } = await supabase
    .from('gama_students')
    .select('*')
    .eq('is_active', true);

  if (sErr) throw sErr;

  const records = students.map((s: Student) => {
    const finalFee = calculateFinalFee(s.monthly_fee_base, s.scholarship_type, s.scholarship_value);
    const dueDate = new Date(`${month}-05`); // 5th of that month

    return {
      student_id: s.id,
      month: month,
      base_fee: s.monthly_fee_base,
      scholarship_amount: s.monthly_fee_base - finalFee,
      final_fee: finalFee,
      status: 'pending',
      due_date: dueDate.toISOString().slice(0, 10),
    };
  });

  const { data, error } = await supabase
    .from('gama_monthly_fees')
    .insert(records);

  if (error) throw error;
  return data;
};

// 6. Generic Search for One Student (by custom ID or Name)
export const findStudentByIdOrName = async (query: string) => {
  if (!query || query.length < 2) return null;

  const { data, error } = await supabase
    .from('gama_students')
    .select(`
      *,
      gama_monthly_fees (
        month,
        status,
        final_fee
      )
    `)
    .or(`student_id.eq.${query},name.ilike.%${query}%`)
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }

  return data;
};
