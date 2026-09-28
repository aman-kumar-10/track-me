-- ==============================================================================
-- LIFEOS — SUPABASE DATABASE FIX FOR SINGLE-OPERATOR / ANONYMOUS ACCESS
-- Run this script in the Supabase Dashboard -> SQL Editor -> Click 'Run'
-- ==============================================================================

-- 1. DROP RESTRICTIVE FOREIGN KEY CONSTRAINTS TO auth.users
-- This allows the app to store entries using the anon API key without requiring email/password login
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE IF EXISTS public.daily_entries DROP CONSTRAINT IF EXISTS daily_entries_user_id_fkey;
ALTER TABLE IF EXISTS public.expenses DROP CONSTRAINT IF EXISTS expenses_user_id_fkey;
ALTER TABLE IF EXISTS public.daily_scores DROP CONSTRAINT IF EXISTS daily_scores_user_id_fkey;
ALTER TABLE IF EXISTS public.weekly_reports DROP CONSTRAINT IF EXISTS weekly_reports_user_id_fkey;

-- 2. ENSURE DEFAULT SINGLE-OPERATOR USER ID EXISTS IN PROFILES
INSERT INTO public.profiles (id, name, email, age, height_cm, weight_kg)
VALUES ('00000000-0000-0000-0000-000000000001', 'Operator', 'operator@lifeos.internal', 25, 178, 72)
ON CONFLICT (id) DO NOTHING;

-- 3. DISABLE RLS (ROW LEVEL SECURITY) FOR SINGLE-OPERATOR LIFEOS APP
-- Disabling RLS allows the anon API key to insert, select, and update rows freely.
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.daily_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.daily_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.weekly_reports DISABLE ROW LEVEL SECURITY;

-- 4. GRANT TABLE PERMISSIONS TO anon, authenticated & service_role
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.daily_entries TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.expenses TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.daily_scores TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.weekly_reports TO anon, authenticated, service_role;

-- 5. POLICIES (If RLS is ever re-enabled later)
DROP POLICY IF EXISTS "Anon profiles access" ON public.profiles;
CREATE POLICY "Anon profiles access" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon daily_entries access" ON public.daily_entries;
CREATE POLICY "Anon daily_entries access" ON public.daily_entries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon expenses access" ON public.expenses;
CREATE POLICY "Anon expenses access" ON public.expenses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon daily_scores access" ON public.daily_scores;
CREATE POLICY "Anon daily_scores access" ON public.daily_scores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon weekly_reports access" ON public.weekly_reports;
CREATE POLICY "Anon weekly_reports access" ON public.weekly_reports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
