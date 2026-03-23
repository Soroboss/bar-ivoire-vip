-- MIGRATION DE RÉALIGNEMENT DU SCHÉMA IVOIRE BAR VIP --
-- Ce script corrige les divergences entre le code et la base de données Supabase.

-- 1. Correction de la table establishments
DO $$ 
BEGIN
    -- Renommer owner_id en user_id si nécessaire
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'owner_id') THEN
        ALTER TABLE public.establishments RENAME COLUMN owner_id TO user_id;
    END IF;

    -- Ajouter les colonnes manquantes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'user_id') THEN
        ALTER TABLE public.establishments ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'status') THEN
        ALTER TABLE public.establishments ADD COLUMN status TEXT DEFAULT 'Pending';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'plan') THEN
        ALTER TABLE public.establishments ADD COLUMN plan TEXT DEFAULT 'Trial';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'currency') THEN
        ALTER TABLE public.establishments ADD COLUMN currency TEXT DEFAULT 'XOF';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'tax_rate') THEN
        ALTER TABLE public.establishments ADD COLUMN tax_rate NUMERIC DEFAULT 18;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'invoice_note') THEN
        ALTER TABLE public.establishments ADD COLUMN invoice_note TEXT DEFAULT 'Merci de votre visite !';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'establishments' AND column_name = 'trial_ends_at') THEN
        ALTER TABLE public.establishments ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days');
    END IF;
END $$;

-- 2. Correction de la table products (Alignement avec le code)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category') THEN
        ALTER TABLE public.products ADD COLUMN category TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'unit') THEN
        ALTER TABLE public.products ADD COLUMN unit TEXT DEFAULT 'Bouteille';
    END IF;
END $$;

-- 3. Table des Dépenses (Vérification)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des Transactions SaaS (Vérification)
CREATE TABLE IF NOT EXISTS public.saas_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID REFERENCES public.establishments(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    plan TEXT NOT NULL,
    status TEXT DEFAULT 'success',
    payment_method TEXT DEFAULT 'mobile_money',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mise à jour des politiques RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_transactions ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Users can view their establishment expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their establishment expenses" ON expenses;

-- Nouvelles politiques
CREATE POLICY "Users can view their establishment expenses" ON expenses
    FOR SELECT USING (establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their establishment expenses" ON expenses
    FOR INSERT WITH CHECK (establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid()));
