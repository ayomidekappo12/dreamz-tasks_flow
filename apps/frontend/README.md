TaskFlow

TaskFlow is a lightweight project and task management application built with Next.js (App Router). It supports multi-project management, per-user data isolation, and task status tracking, using localStorage as a temporary persistence layer.

This project is designed to be simple, fast, and extensible, with a clear path to a real backend (Django + DRF).

 Features

 Client-side authentication (mock auth)

 Create and delete projects

 Per-user project isolation

 Create tasks within projects

 Update task status (To Do / In Progress / Done)

 Cascading delete (delete project → delete its tasks)

 Stable routing (/features/project/[id])

 LocalStorage persistence

 Instant UI updates (no reloads)

 vist site: https://dreamz-tasks-flow.vercel.app/

 Setup Instructions
1 Clone the repository
git clone https://github.com/ayomidekappo12/dreamz-tasks_flow.git
cd taskflow

2 Install dependencies
pnpm install


This project uses pnpm (recommended for performance and consistency)

3 Run the development server
pnpm dev

4 Open the app
http://localhost:3000

 Architecture Overview
 Folder Structure (simplified)
src/
├── app/
    └── auth/
│   └── features/
│       ├── dashboard/
│       └── project/[id]/
├── lib/
│   ├── auth/
│   │   └── auth.tsx
│   └── mock-storage.ts
├── components/
    └── custom/
        ├── AuthGuard.tsx/
│   └── ui/

Key Layers
UI Layer

Built with React + Tailwind CSS

Components are presentational and stateless where possible

Uses shadcn/ui for consistent UI primitives

State & Logic

Local React state (useState, useEffect)

No global state manager yet (by design)

Storage Layer

Centralized in lib/mock-storage.ts

Acts as a repository layer

All reads/writes go through helper functions

Enables easy migration to a real backend

Routing

Uses Next.js App Router

Dynamic project routes:

/features/project/[id]

 Key Decisions & Tradeoffs
  1. LocalStorage instead of a backend

Why:

Faster iteration

No backend setup required

Ideal for prototyping and UI validation

Tradeoff:

No real authentication security

Data is device-local only

Not suitable for production

2. Explicit storage helper layer

Why:

Keeps components clean

Avoids scattered localStorage calls

Makes backend migration trivial

Tradeoff:

Slight upfront complexity

More boilerplate early on

3. Per-user isolation handled client-side

Why:

Matches how real backend filtering works

Prepares codebase for JWT-based APIs

Tradeoff:

Relies on mock auth integrity

No server-side enforcement yet

4. No global state library

Why:

App is still small

React state is sufficient

Avoids premature abstraction

Tradeoff:

Would become limiting at scale

Cross-page sync requires care

What I Would Improve With More Time
Backend Integration

Replace localStorage with Django + DRF

JWT-based authentication

PostgreSQL persistence

Role-based access control

Better State Management

Introduce React Query / TanStack Query

Cache projects and tasks

Background syncing and optimistic updates

 Drag & Drop Tasks

Kanban-style board per project

Use @dnd-kit or react-beautiful-dnd

Persist task order per status

 Testing

Unit tests for storage helpers

Integration tests for routing

Playwright / Cypress for E2E flows

 Real Authentication

Password hashing

Token refresh

Protected routes (middleware)

 UX Enhancements

Inline task editing

Project renaming

Empty state animations

Keyboard shortcuts

 Long-Term Vision

TaskFlow is intentionally built as a foundation:

The storage layer mirrors backend APIs

Data models align with SQL schemas

UI is backend-agnostic

This makes it ideal for:

Technical assessments

Portfolio projects

Gradual production hardening

📄 License

ISC