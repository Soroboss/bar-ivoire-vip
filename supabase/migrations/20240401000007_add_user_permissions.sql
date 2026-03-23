-- Add permissions column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{
  "dashboard": true,
  "inventory": true,
  "revenue": true,
  "staff": true,
  "settings": true,
  "establishments": true
}'::jsonb;

-- Update RLS for profiles to allow admins to view all profiles in their establishment
-- (Existing policy might be too restrictive)
DROP POLICY IF EXISTS "Admins can view profiles in their establishment" ON profiles;
CREATE POLICY "Admins can view profiles in their establishment" ON profiles
    FOR SELECT USING (
        (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('SUPER_ADMIN', 'ADMIN')))
        OR 
        (id = auth.uid())
    );

-- Allow admins to update permissions for other users (but not their own role/permissions to elevate themselves, unless they are super_admin)
CREATE POLICY "Admins can update user profiles" ON profiles
    FOR UPDATE USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'SUPER_ADMIN'
        OR 
        (
            (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
            AND 
            establishment_id = (SELECT establishment_id FROM profiles WHERE id = auth.uid())
        )
    );
