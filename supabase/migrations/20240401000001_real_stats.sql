-- Real-Time Analytics Tables

-- 1. SaaS Transactions (Subscription Payments)
CREATE TABLE saas_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID REFERENCES establishments(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    plan TEXT NOT NULL,
    status TEXT DEFAULT 'success', -- success, failed, pending
    payment_method TEXT DEFAULT 'mobile_money',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Establishment Expenses (Bar Costs)
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- Stock, Loyer, Salaires, Electricité, Autres
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saas_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admin can view all SaaS transactions
CREATE POLICY "Super admins can view all transactions" ON saas_transactions
    FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'SUPER_ADMIN'));

-- Users can view their own establishment's expenses
CREATE POLICY "Users can view their establishment expenses" ON expenses
    FOR SELECT USING (establishment_id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their establishment expenses" ON expenses
    FOR INSERT WITH CHECK (establishment_id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid()));

-- Add expense categories to the dashboard logic
