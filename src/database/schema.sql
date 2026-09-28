-- ==============================================================================
-- LIFEOS — PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Description: Complete schema for personal discipline, metrics, fitness & AI reports
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    name TEXT NOT NULL DEFAULT 'Operator',
    email TEXT,
    age INTEGER DEFAULT 25,
    height_cm NUMERIC(5,2) DEFAULT 178.00,
    weight_kg NUMERIC(5,2) DEFAULT 72.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. DAILY ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.daily_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    entry_date DATE NOT NULL,
    
    -- A) Wake Up
    wake_up_time TEXT NOT NULL DEFAULT '05:45',
    wake_up_am_pm TEXT NOT NULL DEFAULT 'AM',
    wake_up_completed BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- B) Water Tracker (ml)
    water_ml INTEGER NOT NULL DEFAULT 0,
    
    -- C) Workout
    selected_day_index INTEGER NOT NULL DEFAULT 0,
    workout_completed BOOLEAN NOT NULL DEFAULT FALSE,
    workout_minutes INTEGER NOT NULL DEFAULT 0,
    
    -- D) Meals
    breakfast BOOLEAN NOT NULL DEFAULT FALSE,
    lunch BOOLEAN NOT NULL DEFAULT FALSE,
    dinner BOOLEAN NOT NULL DEFAULT FALSE,
    no_junk_food BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- E) Office Status
    office_status TEXT NOT NULL DEFAULT 'Office' CHECK (office_status IN ('Office', 'Leave', 'Weekend')),
    
    -- G) Study
    study_minutes INTEGER NOT NULL DEFAULT 0,
    study_notes TEXT DEFAULT '',
    
    -- H) Reflection
    best_moment TEXT DEFAULT '',
    regret_of_day TEXT DEFAULT '',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    
    CONSTRAINT unique_user_entry_date UNIQUE (user_id, entry_date)
);

-- 4. EXPENSES TABLE (Section F)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_entry_id UUID REFERENCES public.daily_entries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    description TEXT NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. DAILY SCORES TABLE (Scoring Engine History)
CREATE TABLE IF NOT EXISTS public.daily_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    entry_date DATE NOT NULL,
    
    wake_up_score INTEGER NOT NULL DEFAULT 0,
    water_score INTEGER NOT NULL DEFAULT 0,
    workout_score INTEGER NOT NULL DEFAULT 0,
    food_score INTEGER NOT NULL DEFAULT 0,
    study_score INTEGER NOT NULL DEFAULT 0,
    financial_score INTEGER NOT NULL DEFAULT 0,
    
    overall_score INTEGER NOT NULL DEFAULT 0,
    streak_count INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    
    CONSTRAINT unique_user_score_date UNIQUE (user_id, entry_date)
);

-- 6. WEEKLY REPORTS TABLE (Gemini AI Synthesis)
CREATE TABLE IF NOT EXISTS public.weekly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    summary TEXT NOT NULL,
    wins JSONB NOT NULL DEFAULT '[]'::jsonb,
    weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
    suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
    avg_discipline_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    
    CONSTRAINT unique_user_week_report UNIQUE (user_id, week_start_date)
);

-- ==============================================================================
-- 7. INDEXES FOR HIGH-THROUGHPUT RETRIEVAL & ANALYTICS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON public.daily_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date ON public.daily_scores(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_user_date ON public.weekly_reports(user_id, week_start_date DESC);

-- ==============================================================================
-- 8. PERMISSIONS & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Disable RLS for personal single-operator mode to allow direct anon synchronization
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports DISABLE ROW LEVEL SECURITY;

-- Grant permissions to public anon and authenticated roles
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.daily_entries TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.expenses TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.daily_scores TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.weekly_reports TO anon, authenticated, service_role;

-- Optional: Permissive policies if RLS is ever re-enabled
DROP POLICY IF EXISTS "Anon daily_entries access" ON public.daily_entries;
CREATE POLICY "Anon daily_entries access" ON public.daily_entries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon profiles access" ON public.profiles;
CREATE POLICY "Anon profiles access" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon expenses access" ON public.expenses;
CREATE POLICY "Anon expenses access" ON public.expenses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon daily_scores access" ON public.daily_scores;
CREATE POLICY "Anon daily_scores access" ON public.daily_scores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon weekly_reports access" ON public.weekly_reports;
CREATE POLICY "Anon weekly_reports access" ON public.weekly_reports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 9. AUTOMATIC TRIGGER FOR UPDATED_AT
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_daily_entries_updated_at ON public.daily_entries;
CREATE TRIGGER set_daily_entries_updated_at
    BEFORE UPDATE ON public.daily_entries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_daily_scores_updated_at ON public.daily_scores;
CREATE TRIGGER set_daily_scores_updated_at
    BEFORE UPDATE ON public.daily_scores
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
