-- SUPERADMIN ACCESS FIX --
-- 1. Establishments
DROP POLICY IF EXISTS "SuperAdmins can view all establishments" ON establishments;
CREATE POLICY "SuperAdmins can view all establishments" ON establishments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

-- 2. Profiles
DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
CREATE POLICY "SuperAdmins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

-- 3. SaaS Transactions
DROP POLICY IF EXISTS "SuperAdmins can view all transactions" ON saas_transactions;
CREATE POLICY "SuperAdmins can view all transactions" ON saas_transactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

-- 4. Sync Selection (For other tables if needed)
DROP POLICY IF EXISTS "SuperAdmin global view" ON tables;
CREATE POLICY "SuperAdmin global view" ON tables FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "SuperAdmin global view" ON orders;
CREATE POLICY "SuperAdmin global view" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'));

DROP POLICY IF EXISTS "SuperAdmin global view" ON order_items;
CREATE POLICY "SuperAdmin global view" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'));
