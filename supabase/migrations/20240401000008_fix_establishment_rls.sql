-- MIGRATION: Fix Establishment Registration RLS --
-- This migration allows new users to create their own establishment record.

-- 1. Ensure establishments have a unique user_id to prevent multiple registrations per account
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'establishments_user_id_key'
    ) THEN
        ALTER TABLE public.establishments ADD CONSTRAINT establishments_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 2. Add INSERT policy for authenticated users
DROP POLICY IF EXISTS "Users can insert their own establishment" ON establishments;
CREATE POLICY "Users can insert their own establishment" ON establishments
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 3. Update existing policies for broader access if needed during registration
DROP POLICY IF EXISTS "Users can view their own establishment" ON establishments;
CREATE POLICY "Users can view their own establishment" ON establishments
    FOR SELECT USING (user_id = auth.uid());
