-- FIX RECURSIVE RLS --

-- 1. Create a function to check role (Security Definer to avoid recursion)
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Policies
DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
CREATE POLICY "SuperAdmins look profiles" ON profiles
    FOR SELECT USING (is_super_admin());

DROP POLICY IF EXISTS "SuperAdmins can view all establishments" ON establishments;
CREATE POLICY "SuperAdmins look establishments" ON establishments
    FOR SELECT USING (is_super_admin());

DROP POLICY IF EXISTS "SuperAdmins can view all transactions" ON saas_transactions;
CREATE POLICY "SuperAdmins look transactions" ON saas_transactions
    FOR SELECT USING (is_super_admin());

-- Also allow normal users to view their own profile (this was already there but let's ensure it's not broken)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
