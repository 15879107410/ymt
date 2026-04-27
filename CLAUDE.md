# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YMT (羊马台) is a Chinese-language local lifestyle MVP — a bilateral marketplace connecting local merchants with consumers. It is built as a single-repo full-stack Next.js 16 application using the App Router.

Tech stack: Next.js 16 + TypeScript 5 + Tailwind CSS v4 + SQLite + Prisma 6 + Zod + bcryptjs + Lucide React.

## Common Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build (uses --webpack to avoid Turbopack CSS issues in restricted envs)
npm run build

# Lint
npm run lint

# Database: reinitialize from scratch
npm run db:init      # runs scripts/init-db.mjs
npm run db:generate  # prisma generate
npm run db:seed      # prisma db seed

# End-to-end smoke test (requires dev server running on :3000)
npm run smoke
```

## Architecture

### Three-Layer Structure

1. **Presentation** (`src/app/`): Next.js App Router pages
   - Consumer pages: `/`, `/auth`, `/products/[id]`, `/checkout/[id]`, `/orders`, `/merchants/[id]`
   - Merchant pages: `/merchant`, `/merchant/profile`, `/merchant/products`, `/merchant/orders`
2. **API** (`src/app/api/`): Route handlers for auth, products, orders, merchant profile
3. **Data** (`prisma/schema.prisma`): SQLite with five models — User, MerchantProfile, Product, Order, OrderItem

### Authentication

Simple cookie-based JSON session stored in `ymt_session` cookie (not JWT). See `src/lib/auth.ts`:
- `getSessionUser()` — reads cookie, returns `{ id, username, role }`
- `requireUser()` / `requireMerchant()` / `requireConsumer()` — server-side guards that redirect on failure
- Passwords hashed with bcrypt

### Authorization Pattern

Pages and API routes use `requireMerchant()` or `requireConsumer()` from `src/lib/auth.ts`. No middleware — guards are called inline in page components and route handlers.

### Database Access

Prisma Client is a singleton with global caching for dev HMR (`src/lib/prisma.ts`). Generated client outputs to `src/generated/prisma` (not `node_modules`).

Order creation uses Prisma `$transaction` to atomically decrement stock and create order records.

### Validation

All form/API validation uses Zod schemas centralized in `src/lib/validations.ts`: `authSchema`, `merchantProfileSchema`, `productSchema`, `orderSchema`.

### Order State Machine

Allowed transitions are strict (`src/lib/utils.ts`):
- `PENDING` → `ACCEPTED` or `CANCELLED`
- `ACCEPTED` → `COMPLETED` or `CANCELLED`
- `COMPLETED` and `CANCELLED` are terminal

### Styling

Tailwind CSS v4 with inline theme config in `globals.css`. Custom warm palette (reds/corals). Key CSS classes defined globally: `.surface-card`, `.field-input`, `.pill`, `.page-shell`, `.section-title`, `.gradient-brand`. Mobile-first consumer pages are constrained to max-width 390px; merchant pages use `max-width: 1180px`.

## Important Constraints (from AGENTS.md)

**This project operates under strict MVP boundaries. Future Claude instances must respect these rules:**

1. **Do not expand scope.** Only implement features already confirmed as part of the MVP. Do not add real payment, delivery tracking, rider dispatch, recommendations, WeChat login, or SMS verification.
2. **UI reference is `stitch/` prototypes.** Match visuals to the prototypes, but prototype features beyond MVP can remain static/placeholder.
3. **Code comments must be in Chinese.** The user is non-technical. Every component, interface, method, and key logic block needs clear Chinese comments explaining purpose and reasoning.
4. **Autonomous decisions allowed within scope:** implementation details, code structure, minor copy adjustments, small layout tweaks. **Must stop and ask for confirmation on:** product direction changes, new non-MVP features, major prototype alterations, deleting existing designs.
5. **Verify after implementing.** Run the dev server, run `npm run smoke`, check lint. Report what was verified and what could not be.

## Demo Accounts

- Consumer: `consumer-demo` / `123456`
- Merchant: `merchant-demo` / `123456`

## Project Files

Key docs in the repo root (all in Chinese):
- `README.md` — quick start
- `MVP需求文档.md` — product requirements
- `技术方案文档.md` — technical architecture
- `表结构设计.md` — database design
- `AGENTS.md` — agent execution rules (source of constraints above)
- `协作开发规范.md` — collaboration conventions
