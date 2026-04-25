-- Corrected Supabase Schema for GAMA Fee Management System

-- 1. Ensure the Gama Students table has all required columns
-- Using ALTER TABLE to fix existing tables if they were created with different schemas
CREATE TABLE IF NOT EXISTS public.gama_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Add missing columns safely
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS age INT;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS registration_fee_amount NUMERIC DEFAULT 1000;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT 'pending';
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS registration_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS registration_method TEXT;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS registration_ref_id TEXT;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS received_by TEXT;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS monthly_fee_base NUMERIC DEFAULT 600;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS scholarship_type TEXT DEFAULT 'none';
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS scholarship_value NUMERIC DEFAULT 0;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS enrolled_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.gama_students ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. Month-Wise Fee Records
CREATE TABLE IF NOT EXISTS public.gama_monthly_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.gama_students(id) ON DELETE CASCADE,
    month CHAR(7) NOT NULL,
    base_fee NUMERIC NOT NULL,
    scholarship_amount NUMERIC DEFAULT 0,
    final_fee NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    UNIQUE(student_id, month)
);

-- 3. Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    fee_type TEXT NOT NULL,
    division TEXT DEFAULT 'Gama',
    month CHAR(7),
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    reference_id TEXT,
    received_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Receipts
CREATE TABLE IF NOT EXISTS public.receipts (
    id TEXT PRIMARY KEY,
    transaction_id UUID REFERENCES public.transactions(id),
    student_id UUID NOT NULL,
    fee_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_gama_students_sid ON public.gama_students(student_id);
CREATE INDEX IF NOT EXISTS idx_gama_monthly_fees_student ON public.gama_monthly_fees(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_student ON public.transactions(student_id);

-- 5. Updated Student Overview View
-- Fixed the missing column issue by ensuring it uses the correct field name
CREATE OR REPLACE VIEW public.gama_student_overview AS
SELECT 
    gs.id,
    gs.student_id as display_id,
    COALESCE(gs.name, 'Unnamed Student') as name,
    gs.registration_status,
    gs.monthly_fee_base,
    gs.scholarship_type,
    gs.scholarship_value,
    CASE 
        WHEN gs.scholarship_type = 'fixed' THEN GREATEST(0, gs.monthly_fee_base - gs.scholarship_value)
        WHEN gs.scholarship_type = 'percentage' THEN GREATEST(0, gs.monthly_fee_base * (1 - gs.scholarship_value / 100.0))
        ELSE gs.monthly_fee_base
    END as final_fee_calculated,
    (SELECT COUNT(*) FROM public.gama_monthly_fees gmf WHERE gmf.student_id = gs.id AND gmf.status IN ('pending', 'overdue')) as pending_months_count
FROM public.gama_students gs;
