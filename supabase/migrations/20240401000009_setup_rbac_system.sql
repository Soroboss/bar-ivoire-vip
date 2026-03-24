-- MIGRATION: Setup Scalable RBAC System --
-- 1. Permissions Table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Role Permissions (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Update Profiles to use Role ID
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id);

-- 5. Seed Initial Data
-- Seed Permissions
INSERT INTO public.permissions (name, description) VALUES
('read:dashboard', 'Permission to view the main dashboard'),
('read:inventory', 'Permission to view inventory'),
('write:inventory', 'Permission to add/edit products'),
('read:revenue', 'Permission to view financial reports'),
('read:staff', 'Permission to view staff and clients'),
('manage:users', 'Permission to manage users and roles'),
('manage:settings', 'Permission to modify establishment settings')
ON CONFLICT (name) DO NOTHING;

-- Seed Roles
INSERT INTO public.roles (name, description) VALUES
('super_admin', 'Full access to all systems and establishments'),
('admin', 'Owner/Manager of an establishment'),
('manager', 'Daily operations manager'),
('editor', 'Staff with inventory and sales access'),
('viewer', 'Read-only access to operations')
ON CONFLICT (name) DO NOTHING;

-- Link Roles to Permissions
DO $$
DECLARE
    super_admin_id UUID := (SELECT id FROM public.roles WHERE name = 'super_admin');
    admin_id UUID := (SELECT id FROM public.roles WHERE name = 'admin');
    manager_id UUID := (SELECT id FROM public.roles WHERE name = 'manager');
BEGIN
    -- Super Admin gets everything
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT super_admin_id, id FROM public.permissions
    ON CONFLICT DO NOTHING;

    -- Admin gets most things
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT admin_id, id FROM public.permissions WHERE name NOT LIKE 'manage:users'
    ON CONFLICT DO NOTHING;

    -- Manager gets operational things
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT manager_id, id FROM public.permissions WHERE name IN ('read:dashboard', 'read:inventory', 'write:inventory', 'read:staff')
    ON CONFLICT DO NOTHING;
END $$;

-- 6. Initial Data Migration (Migrate from role enum to role_id)
UPDATE public.profiles p
SET role_id = r.id
FROM public.roles r
WHERE (p.role::text = 'SUPER_ADMIN' AND r.name = 'super_admin')
   OR (p.role::text = 'ADMIN' AND r.name = 'admin')
   OR (p.role::text IN ('CASHIER', 'WAITER', 'BARMAN') AND r.name = 'editor');

-- Note: We keep the old 'role' enum for now to avoid breaking existing queries, 
-- but we will remove it in a future cleanup migration after code update.
