# NCERT SmartTest

NCERT SmartTest is an online platform for chapter-wise MCQ practice/tests for Classes 1–12, where students can take auto-generated NCERT-based tests by subject and chapter, sign up to track their progress, or try as guests.

## 🚀 Features
- Chapter-wise MCQ tests for Classes 1–12 (Hindi, Urdu, Sanskrit, English, Science, SST)
- OpenAI-powered automatic MCQ generation for each chapter
- Sign up, sign in, or try as guest
- Results & progress tracking (dashboard)
- Minimal, modern UI (Tailwind CSS, shadcn/ui)
- Ready for Vercel deployment

## 🖥️ Technology
- Framework: Next.js 16 (App Router, TypeScript)
- Styling: Tailwind CSS v4, shadcn/ui
- Backend: Next.js API routes, Google Gemini API

## 🔧 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure Gemini API:**
   - Create a `.env.local` file in the root directory
   - Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Add your `GEMINI_API_KEY` to `.env.local`:
     ```env
     GEMINI_API_KEY=your-api-key-here
     ```
3. **Run the dev server:**
```bash
npm run dev
```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Deploy:**
   - Deploy on [Vercel](https://vercel.com/) and add your `GEMINI_API_KEY` in Environment Variables.

## 📚 Pages
- `/` Homepage: Sign in/up, guest access, quick start panel
- `/auth/signin` – Sign In
- `/auth/signup` – Sign Up
- `/select-class` – Select class, subject, and chapter
- `/test` – Take MCQ test, get instant results
- `/dashboard` – Your attempted tests + scores
- `/resources` – Documentation, guides, FAQ
- `/company` – About us, mission, team
- `/legal` – Policies

## 🪄 Styling & UI
Built with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)

---

© 2025 NCERT SmartTest
