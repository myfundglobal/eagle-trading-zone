# 🦅 Eagle Trading Zone FX Book — Complete Setup Guide (Hinglish)

Namaste! Agar aap bilkul **Non-Coder** hain aur coding nahi aati, toh chinta mat kijiye. Ye guide step-by-step, plain numbered tareeqe se likhi gayi hai taaki aap asani se apna complete Trading Journal aur Analytics platform live chala sakein.

---

## 📑 Index
1. [Free Supabase Project Kaise Banayein (Database & Auth)](#1-free-supabase-project-kaise-banayein)
2. [Database Schema & Seed Data Run Karna (One-Click SQL)](#2-database-schema--seed-data-run-karna)
3. [Environment Keys (.env.local) Set Karna](#3-environment-keys-envlocal-set-karna)
4. [Website Apne Computer Par Chalana (Local Test)](#4-website-apne-computer-par-chalana)
5. [First Admin Account Kaise Banayein (One-Time Setup)](#5-first-admin-account-kaise-banayein)
6. [Apne UPI / Bank / USDT Payment Details Daalna](#6-apne-upi--bank--usdt-payment-details-daalna)
7. [Vercel Par Free Me Deploy Karna (Live Internet Par)](#7-vercel-par-free-me-deploy-karna)
8. [Apna Custom Domain Connect Karna (e.g. eagletradingzone.com)](#8-apna-custom-domain-connect-karna)

---

## 1. Free Supabase Project Kaise Banayein

Supabase ek free modern database aur login system hai jo aapke traders ke accounts, trades aur payments ko store karega.

1. Browser me **[supabase.com](https://supabase.com)** open kijiye.
2. **"Start your project"** par click karke free account banayein (aap Google se 1-click signup kar sakte hain).
3. Dashboard me **"New Project"** par click karein.
4. Details bharein:
   - **Name:** `Eagle-Trading-Zone`
   - **Database Password:** koi strong password daalein aur copy karke rakh lein.
   - **Region:** Jo aapke sabse paas ho (jaise `South Asia (Mumbai)` ya `Singapore`).
   - **Pricing Plan:** Free plan select kijiye ($0/month).
5. **"Create new project"** par click karein. 2 minute me aapka database ready ho jayega.

---

## 2. Database Schema & Seed Data Run Karna

Maine project me pehle se ek file bana di hai: `supabase-schema.sql`. Isme saare tables (profiles, trades, plans, payments, community chat, feature flags) aur sample data tayyar hain.

1. Supabase dashboard me left side menu me **SQL Editor** (icon `>_`) par click karein.
2. Upar **"New query"** button dabayein.
3. Hamari project directory me se `supabase-schema.sql` file ko open kijiye, saara text copy kijiye (Ctrl+A, Ctrl+C).
4. Supabase SQL Editor me paste kar dijiye (Ctrl+V).
5. Green color ka **"Run"** button dabayein.
6. Aapko message dikhega: `Success. No rows returned`.
   - Mubarak ho! Saare 14 tables, security policies (RLS), aur default Free/Pro/Elite plans database me live create ho gaye hain.

---

## 3. Environment Keys (.env.local) Set Karna

Ab hum Supabase ko website se connect karenge:

1. Supabase dashboard me left bottom me **Settings (gear icon)** par click karein &rarr; **API**.
2. Wahan se 3 cheezein copy karni hain:
   - **Project URL** (e.g. `https://xyzabc.supabase.co`)
   - **anon public key** (ek lambi text key)
   - **service_role key** (secret key - ye sirf server ke liye hai)
3. Apne project folder `eagle-trading-zone` me ek file banayein jiska naam rakhein: `.env.local`
4. Isme ye paste kijiye aur apni keys daal dijiye:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Website Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Eagle Trading Zone FX Book"

# AI Provider (Optional: agar OpenAI key daalenge toh real AI chalegi, warna smart statistical AI automatically chalegi!)
AI_PROVIDER=openai
AI_API_KEY=
```

*(Note: Agar aap bina Supabase keys ke bhi website chalana chahein, tab bhi hamari app me **Instant Demo Mode** built-in hai jo 1-click me turant chalti hai!)*

---

## 4. Website Apne Computer Par Chalana

1. Terminal ya PowerShell open karein aur project folder me jayein:
   ```powershell
   cd C:\Users\Admin\.gemini\antigravity\scratch\eagle-trading-zone
   ```
2. Website start karne ke liye ye command chalayein:
   ```powershell
   npm run dev
   ```
3. Browser me open karein: **`http://localhost:3000`**
4. Aapko animated hero, glowing eagle logo, feature list, pricing, aur live journal preview dikhega!

---

## 5. First Admin Account Kaise Banayein (One-Time Setup)

Admin banne ke liye:

1. Apni website par jayein: `http://localhost:3000/signup`
2. Apna real email daalkar account banayein (e.g. `founder@eagletradingzone.com`).
3. Ab Supabase dashboard me jayein &rarr; **SQL Editor** &rarr; **New query**.
4. Ye command likhein (apna email daal kar):
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'founder@eagletradingzone.com';
   ```
5. **Run** par click karein.
6. Website par refresh karein! Ab aapko top bar me aur sidebar me **"Admin Portal 👑"** button dikhega.
7. Click karke aap seedha `/admin` dashboard me enter ho jayenge!

---

## 6. Apne UPI / Bank / USDT Payment Details Daalna

Hamare system me koi third-party gateway nahi lagana padta (100% free manual system):

1. Login kijiye Admin account se aur open kijiye: **`http://localhost:3000/admin/payment-methods`**
2. Wahan aapko 3 default methods milenge:
   - **UPI (GPay / PhonePe / Paytm)**
   - **USDT Crypto (TRC20 & ERC20)**
   - **Bank Wire Transfer**
3. **"Edit Method Details & QR"** button par click karke apna khud ka UPI ID, Bank Account Number, ya USDT Wallet Address daal dijiye.
4. **Save** par click karein.
5. Ab jab bhi koi trader Upgrade page par jayega, usse aapka QR code aur UPI ID dikhega.
6. Trader payment karke Transaction ID (UTR) aur screenshot upload karega.
7. Aapko **`/admin/payments`** me turant pending notification dikhegi, jahan aap screenshot verify karke **"Approve"** click karenge aur trader ka Pro/Elite plan activate ho jayega!

---

## 7. Vercel Par Free Me Deploy Karna

Vercel par aapki website 24/7 internet par free me live rahegi:

1. **[github.com](https://github.com)** par free account banayein aur ek nayi private/public repository banayein: `eagle-trading-zone`.
2. Apne computer se code push karein:
   ```powershell
   git init
   git add .
   git commit -m "Eagle Trading Zone FX Book initial launch"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/eagle-trading-zone.git
   git push -u origin main
   ```
3. Ab **[vercel.com](https://vercel.com)** par Google/GitHub se free account banayein.
4. **"Add New..."** &rarr; **"Project"** par click karein.
5. Apni GitHub repository `eagle-trading-zone` select karke **"Import"** dabayein.
6. **Environment Variables** section me wahi 3 keys daal dijiye:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-site.vercel.app`
7. **"Deploy"** button dabayein!
8. 2 minute me aapki website live ho jayegi aur aapko ek free URL mil jayega (e.g. `https://eagle-trading-zone.vercel.app`).

---

## 8. Apna Custom Domain Connect Karna

Agar aapke paas apna domain hai (e.g. GoDaddy, Namecheap, Hostinger se liya hua `eagletradingzone.com`):

1. Vercel dashboard me apne project par click karein &rarr; **Settings** &rarr; **Domains**.
2. Apna domain enter karein (e.g. `eagletradingzone.com`) aur **Add** karein.
3. Vercel aapko 2 DNS records dikhayega:
   - **A Record:** `@` points to `76.76.21.21`
   - **CNAME Record:** `www` points to `cname.vercel-dns.com`
4. Jahan se aapne domain khareeda hai (GoDaddy/Namecheap), wahan **DNS Management** me ye dono records add kar dijiye.
5. 15 se 30 minute me automatic free SSL certificate (green padlock 🔒) lag jayega aur aapki branded website worldwide live chalne lagegi!

---

Agar koi bhi sawaal ho, aap bina jhijhak pooch sakte hain. Happy Trading & Journaling with Eagle FX Book! 🦅🔥
