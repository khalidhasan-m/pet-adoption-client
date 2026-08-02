# 🐾 PawfectMatch — Pet Adoption Platform (Client)

A modern, responsive full-stack Pet Adoption Platform built with **Next.js 15 (App Router)**, **BetterAuth**, **Framer Motion**, and **Tailwind CSS**. PawfectMatch connects loving families with shelter animals and pet owners looking for forever homes.

---

## 🔗 Live Site & Repositories

- **Live Frontend**: Deployed on Vercel / Render
- **Client Repo**: [GitHub - pet-adoption-client](https://github.com/)
- **Server Repo**: [GitHub - pet-adoption-server](https://github.com/)

---

## 🎯 Purpose

PawfectMatch simplifies pet adoption by offering a clean, user-friendly interface where potential pet owners can explore pets, search/filter by species and name, view detailed pet profiles, and submit adoption requests. Meanwhile, pet owners and shelters can post listings and manage incoming applications.

---

## ✨ Features

- 🔍 **Advanced Search & Filtering**: Search pets by name ($regex) and filter multi-select species ($in) with real-time sorting.
- 🔐 **Authentication with BetterAuth**: Email/Password and Google OAuth login with HTTPOnly cookie session persistence across page reloads.
- 🐶 **Comprehensive Pet Listings & Profiles**: Explore detailed pet profiles with health info, vaccination status, fees, and location.
- 📋 **Dashboard Management**: Dedicated user dashboard to manage personal listings, stats (total, available, adopted), and pending adoption applications.
- 🤝 **Adoption Control Logic**: Automated adoption flow — owners cannot self-adopt; approving one request automatically marks pet as adopted and rejects all competing requests.
- 🌓 **Dark & Light Mode**: Smooth theme toggling with custom CSS tokens and persistent user preferences.
- 📱 **Fully Responsive**: Crafted with modern glassmorphism, Framer Motion animations, and fluid mobile/tablet/desktop layouts.

---

## 📦 NPM Packages Used

- `next` — React Framework for Production
- `react` & `react-dom` — Core UI library
- `better-auth` — Authentication client
- `axios` — HTTP client with credentials
- `framer-motion` — Fluid animations & modal transitions
- `react-hot-toast` — Sleek UI notifications (No default alerts)
- `react-icons` — Feather & FontAwesome icon sets
- `@tailwindcss/postcss` & `tailwindcss` — Styling

---

## 🚀 Local Setup

```bash
# Clone repository
git clone https://github.com/your-username/pet-adoption-client.git
cd pet-adoption-client

# Install dependencies
npm install

# Set up environment variables (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Start development server
npm run dev
```
