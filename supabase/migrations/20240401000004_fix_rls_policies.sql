-- FIX RLS & SCHEMA FOR IVOIRE BAR VIP --
-- 1. Schema Fixes
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='order_items' AND COLUMN_NAME='name') THEN
        ALTER TABLE order_items ADD COLUMN name TEXT;
    END IF;
END $$;

-- 2. RLS Policies
DROP POLICY IF EXISTS "Users can view their establishment's tables" ON tables;
CREATE POLICY "Users can view their establishment's tables" ON tables
    FOR SELECT USING (
        establishment_id IN (
            SELECT id FROM establishments WHERE user_id = auth.uid() 
            OR id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid())
        )
    );

-- 2. Orders & Items
DROP POLICY IF EXISTS "Users can view their establishment's orders" ON orders;
CREATE POLICY "Users can view their establishment's orders" ON orders
    FOR SELECT USING (
        establishment_id IN (
            SELECT id FROM establishments WHERE user_id = auth.uid() 
            OR id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can view their establishment's order items" ON order_items;
CREATE POLICY "Users can view their establishment's order items" ON order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM orders WHERE establishment_id IN (
                SELECT id FROM establishments WHERE user_id = auth.uid() 
                OR id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid())
            )
        )
    );

-- 3. Products & Categories
DROP POLICY IF EXISTS "Users can view their establishment's products" ON products;
CREATE POLICY "Users can view their establishment's products" ON products
    FOR SELECT USING (
        establishment_id IN (
            SELECT id FROM establishments WHERE user_id = auth.uid() 
            OR id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can view their establishment's categories" ON categories;
CREATE POLICY "Users can view their establishment's categories" ON categories
    FOR SELECT USING (
        establishment_id IN (
            SELECT id FROM establishments WHERE user_id = auth.uid() 
            OR id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid())
        )
    );

-- 4. Clients & Stock Movements
DROP POLICY IF EXISTS "Users can view their establishment's clients" ON clients_vip;
CREATE POLICY "Users can view their establishment's clients" ON clients_vip
    FOR SELECT USING (
        establishment_id IN (
            SELECT id FROM establishments WHERE user_id = auth.uid() 
            OR id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can view their establishment's stock movements" ON stock_movements;
CREATE POLICY "Users can view their establishment's stock movements" ON stock_movements
    FOR SELECT USING (
        product_id IN (
            SELECT id FROM products WHERE establishment_id IN (
                SELECT id FROM establishments WHERE user_id = auth.uid() 
                OR id IN (SELECT establishment_id FROM profiles WHERE id = auth.uid())
            )
        )
    );

-- Allow insertions for owners too
CREATE POLICY "Owners can insert in their establishment's tables" ON tables FOR INSERT WITH CHECK (establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid()));
CREATE POLICY "Owners can insert in their establishment's orders" ON orders FOR INSERT WITH CHECK (establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid()));
CREATE POLICY "Owners can insert in their establishment's order items" ON order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM orders WHERE establishment_id IN (SELECT id FROM establishments WHERE user_id = auth.uid())));
