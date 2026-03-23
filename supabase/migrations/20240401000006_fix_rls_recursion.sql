-- FIX RLS RECURSION
-- Users must be able to see their OWN profile to check their role
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

-- SuperAdmins can see ALL profiles
DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
CREATE POLICY "SuperAdmins can view all profiles" ON profiles 
FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'SUPER_ADMIN'
);

-- Note: The above still has a slight risk of recursion if not careful, 
-- but 'auth.uid() = id' is a standard non-recursive pattern.

-- ALTERNATIVE (SAFER) SUPER_ADMIN check using auth.jwt() metadata or a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION check_is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = auth.uid()) = 'SUPER_ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply policies using the security definer function to avoid recursion
DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
CREATE POLICY "SuperAdmins can view all profiles" ON profiles 
FOR SELECT USING (check_is_admin());
