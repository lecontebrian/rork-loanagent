# Loan Agent — AI-Powered Loan Management

A premium, iOS-first fintech app built with React Native + Expo Router + TypeScript. Designed with an Apple Wallet + ChatGPT + premium banking aesthetic — glassmorphism, emerald green branding, soft gradients, blur, haptics, and smooth animations.

## Features

- **Onboarding** — 3-screen swipeable intro with animated AI orb visuals
- **Home Dashboard** — Loan Health Score ring, AI insight card, loan list, upcoming payment, quick actions, pull-to-refresh
- **Loans Screen** — Filterable loan cards with balance, APR, monthly payment, progress bars, and status badges
- **Loan Detail** — Full loan info, payment history, AI recommendation, action buttons (Make Payment, Extra Payment, Refinance)
- **Ask AI** — Full chat experience with animated green AI orb, suggested prompts, mock intelligent responses, typing indicator
- **Documents** — Upload card, searchable document list with file types, dates, and verification statuses
- **Profile** — User card, credit score, Face ID toggle, dark mode toggle, notification preferences, connected accounts, sign out

## Design System

| Token | Value |
|---|---|
| Primary Green | `#16C784` |
| Deep Green | `#003D2B` |
| Mint Glow | `#C8FFE1` |
| Background Light | `#F5F7F8` |
| Background Dark | `#050807` |
| Card Radius | `28px` |
| Button Radius | `999px` (pill) |

## Tech Stack

- **React Native** + **Expo** (SDK 54)
- **Expo Router** for file-based navigation
- **TypeScript** strict mode
- **expo-blur** for glassmorphism
- **expo-linear-gradient** for gradients
- **expo-haptics** for tactile feedback
- **react-native-svg** for progress rings
- **lucide-react-native** for icons
- **AsyncKeyboardAvoidingView** for chat input

## Project Structure

```
expo/
├── app/
│   ├── _layout.tsx          # Root layout (ThemeProvider + onboarding gate)
│   ├── index.tsx            # Redirect to tabs
│   ├── onboarding.tsx       # 3-screen onboarding flow
│   ├── loan-detail.tsx      # Loan detail screen
│   ├── +not-found.tsx       # 404 screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab layout with custom BottomTabBar
│       ├── home.tsx         # Home dashboard
│       ├── loans.tsx        # Loans list
│       ├── ask-ai.tsx       # AI chat screen
│       ├── documents.tsx    # Documents screen
│       └── profile.tsx      # Profile & settings
├── components/
│   ├── GlassCard.tsx        # Blur-based glass card with press animation
│   ├── GradientButton.tsx   # Primary/secondary/ghost button with haptics
│   ├── ProgressRing.tsx     # Animated SVG progress ring
│   ├── AIOrb.tsx            # Pulsing/rotating green AI orb
│   ├── HealthScoreCard.tsx  # Hero gradient card with score ring + insight
│   ├── LoanCard.tsx         # Premium loan card with progress bar
│   ├── AIInsightCard.tsx    # AI insight with type-based icons
│   └── BottomTabBar.tsx     # Custom tab bar with elevated center button
├── constants/
│   └── theme.ts             # Full theme system (light/dark, spacing, typography)
├── contexts/
│   └── ThemeContext.tsx     # Theme provider with AsyncStorage persistence
├── mocks/
│   └── loanData.ts          # Mock loans, user, documents, AI responses
├── types/
│   └── index.ts             # All TypeScript interfaces
├── utils/
│   └── formatters.ts        # Currency, percent, date, loan type formatters
└── lib/
    └── constants.ts         # Shared constants
```

## Setup

```bash
cd expo
bun install
bun run start
```

Then scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android.

## Reusable Components

### GlassCard
Blur-based translucent card with optional press animation and glow shadow.

### GradientButton
Pill-shaped button with three variants (primary gradient, secondary surface, ghost outline), haptic feedback, and scale animation.

### ProgressRing / AnimatedProgressRing
SVG-based circular progress with gradient stroke and smooth fill animation.

### AIOrb
Layered glowing orb with pulse and rotation animations — used in onboarding, chat, and headers.

### HealthScoreCard
Hero gradient card with animated progress ring, AI insight text, and CTA button.

### LoanCard
Full loan summary card with icon, status badge, balance/APR/monthly stats, and animated progress bar.

### BottomTabBar
Custom glass tab bar with an elevated, glowing center button for the Ask AI tab.

## Dark Mode

The app supports automatic dark mode (follows system setting) with manual override in Profile settings. Theme preference is persisted via AsyncStorage.

## Mock Data

All data is local mock data — no backend required. The AI chat uses keyword-based response matching to simulate intelligent loan advice.
