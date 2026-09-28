# LifeOS — High-Performance Personal Operating System

**LifeOS** is an elite, production-quality Android mobile application built with **React Native**, **Expo SDK**, **TypeScript**, **Supabase**, and **Google Gemini AI**. Designed for single-operator mastery, it enforces daily discipline, physical fitness, intellectual deep work, financial control, and stoic accountability.

---

## ⚡ Tech Stack & Architecture

- **Framework**: React Native with Expo (Managed Workflow, TypeScript)
- **Design Aesthetic**: Notion, Linear & Apple Health inspired — strict dark palette, micro-spacing, data-dense layouts
- **Theme Palette**:
  - Background: `#0F1117`
  - Card: `#1A1D26`
  - Primary: `#4F8CFF`
  - Success: `#00C896`
  - Warning: `#F7B731`
  - Danger: `#FF5C5C`
  - Text: `#FFFFFF` / `#A0A6B1`
- **UI & Theming**: Custom Design System + React Native Paper (MD3 Dark Theme) + Expo Vector Icons
- **Visual Charts**: Pure Native SVG charts (`react-native-svg`) with gradient fills, dashed benchmarks, and smooth bezier curves
- **Cloud Backend**: Supabase (PostgreSQL with Row Level Security, composite indexes, triggers, and foreign keys)
- **AI Intelligence**: Google Generative AI (Gemini 1.5 Flash) for structured Sunday executive performance reviews
- **Local Security**: `expo-secure-store` hardware-backed encryption for authentication tokens and offline fallback cache

---

## 📱 Features Overview

### 1. Dashboard Screen
- **Discipline Hero Gauge**: Real-time SVG circular gauge (0–100) with status classification (`EXCELLENT`, `DISCIPLINED`) and weekly delta.
- **Biometric Header**: Operator initials monogram, live system status, and compact stats strip (**Age**, **Height**, **Weight**, **BMI**).
- **Streak & Consistency Tracker**: Daily streak counter with lightning indicator, personal best record, and 7-day week progress pills (`M`, `T`, `W`, `T`, `F`, `S`, `S`).
- **6 Domain Progress Cards**:
  1. **Wake Up**: Circadian window compliance
  2. **Hydration**: Volume in ml vs 3,000 ml target
  3. **Workout**: Scheduled hypertrophy split & duration
  4. **Meals & Nutrition**: 3 clean meals + No Junk Food verified badge
  5. **Deep Work**: Study minutes against 90 min goal
  6. **Daily Expenses**: Financial tracking and budget status

### 2. Daily Entry Screen (Sections A – H)
- **A) Wake Up**: Time selector with instant 5:30 AM – 6:00 AM rule evaluation (+15 pts).
- **B) Water Tracker**: Quick-add buttons (`+100 ml`, `+200 ml`, `+500 ml`), smooth progress bar, and 3000 ml target.
- **C) Workout Routine**: Day-to-muscle split engine (Mon: Chest+Tri, Tue: Back+Bi, Wed: Shoulders+Arms, Thu: Chest+Tri, Fri: Back+Bi, Sat: Legs, Sun: Rest), session duration chips, and completion toggle (+20 pts).
- **D) Nutrition & Meals**: Checkboxes for Breakfast, Lunch, Dinner (+9 pts) and dedicated No Junk Food rule (+6 pts).
- **E) Workday Status**: Segmented options for **Office**, **Leave**, and **Weekend**.
- **F) Expenses**: Transaction logging with currency amount, description, itemized list, and daily total.
- **G) Deep Work & Study**: 90-minute goal tracker with fast chips (`+15m`, `+30m`, `+45m`, `+60m`, `+90m`) and multiline concept notes area.
- **H) Stoic Evening Reflection**: Best Moment of the Day and Regret / Friction Lesson.
- **Live Scoring Engine**: Real-time calculation updating the header counter (`Score: 88/100`) as you edit fields.

### 3. Analytics & Trend Charts Screen
- **Discipline Score Trend**: Line chart with area gradient fill.
- **Study & Deep Work Trend**: Column chart of minutes vs 90m target.
- **Financial Outflow Trend**: Dollar expenditure volume bars.
- **Workout Conditioning Trend**: Training minutes and session volume.
- **Cellular Hydration Intake Trend**: Fluid volume vs 3,000 ml goal line.
- **Timeframe Selector**: Toggle between **Weekly** (7 days), **Monthly** (4 weeks), and **Yearly** (2026 trajectory).

### 4. Gemini AI Weekly Report System
- **Executive Synthesis**: Runs every Sunday (or on-demand) via `gemini-1.5-flash`.
- **Domain Audits**: Detailed analysis of Discipline, Fitness, Deep Work, and Spending.
- **Wins**: Top execution victories.
- **Weaknesses**: Cognitive lapses and points of friction.
- **Actionable Protocols**: High-leverage, numbered improvement steps for the upcoming week.
- **Supabase Persistence**: Automatically saved to the `weekly_reports` PostgreSQL table.

### 5. Profile & System Settings Screen
- **Biometric Editor**: Update Name, Email, Age, Height (cm), Weight (kg) with live BMI classification.
- **Data Export**: Complete JSON archive generator with clipboard copy / backup capabilities.
- **Backup Data**: Encrypted cloud snapshot trigger to Supabase.
- **Reset Data**: Safe confirmation modal to reinitialize local cache.
- **Theme Toggle**: Linear Dark Default (`#0F1117`) / True Black OLED mode.
- **Cloud Diagnostics**: Real-time connection indicators for Supabase and Gemini.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your keys:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```
*(Note: If no keys are provided, the app runs gracefully in offline-first mode with high-fidelity deterministic generators and local cache).*

### 3. Deploy the Supabase Database Schema
1. Open your Supabase Project Dashboard → **SQL Editor**.
2. Paste the contents of `src/database/schema.sql`.
3. Click **Run**. All tables (`profiles`, `daily_entries`, `expenses`, `daily_scores`, `weekly_reports`), RLS policies, and indexes will be deployed.

### 4. Start the Application
```bash
npx expo start
```
- Press `a` to open in Android Emulator.
- Or scan the QR code with the Expo Go mobile app.

---

## 🛠️ Verification Commands

```bash
# Typecheck validation (Must return 0 errors)
npx tsc --noEmit
```
