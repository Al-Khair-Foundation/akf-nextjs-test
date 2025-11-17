# AKF Next.js Todo Application

A modern, full-stack todo list application built with Next.js 15, demonstrating best practices in server-side rendering, server actions, and modern React patterns.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Important Concepts](#important-concepts)
  - [Server Actions](#server-actions)
  - [State Management](#state-management)
  - [Server vs Client Components](#server-vs-client-components)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)

## Features

- ✅ **Create Todos** - Add new tasks with a simple form interface
- ✅ **View Todos** - Display all todos with their current status
- ✅ **Toggle Status** - Mark todos as completed or revert to pending
- ✅ **Delete Todos** - Remove todos from the list
- ✅ **Search & Filter** - URL-based query and status filtering (with debouncing)
- ✅ **Empty State** - Friendly UI when no todos exist
- ✅ **Toast Notifications** - Real-time feedback for all operations
- ✅ **Optimistic UI** - Loading states for better UX
- ✅ **Error Handling** - Graceful error states with helpful messages
- ✅ **Responsive Design** - Works seamlessly across all devices

## Tech Stack

### Core Framework
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - Latest React with Server Components
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework with latest v4 syntax
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, consistent icon set
- **shadcn/ui** - High-quality, customizable component patterns
- **Sonner** - Beautiful toast notifications
- **Geist Font** - Modern font family from Vercel

### State & Data Management
- **Next.js Server Actions** - Server-side mutations
- **React Hooks** - Client-side state (useState, useEffect)
- **URL Search Params** - Shareable filter state via useRouter

## Project Architecture

This project follows a **server-first architecture** that leverages Next.js App Router capabilities:

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                   │
│  ┌─────────────────────────────────────────────┐   │
│  │   Client Components (todo-list.tsx)         │   │
│  │   - UI State (loading, form inputs)         │   │
│  │   - User Interactions                       │   │
│  └──────────────┬──────────────────────────────┘   │
└─────────────────┼───────────────────────────────────┘
                  │
                  │ Server Actions
                  ▼
┌─────────────────────────────────────────────────────┐
│              Next.js Server (Node.js)                │
│  ┌─────────────────────────────────────────────┐   │
│  │   Server Components (page.tsx)              │   │
│  │   - Data Fetching                           │   │
│  │   - Initial Render                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │   Server Actions (todo-actions.ts)          │   │
│  │   - createTodo()                            │   │
│  │   - updateTodoStatus()                      │   │
│  │   - removeTodo()                            │   │
│  └──────────────┬──────────────────────────────┘   │
└─────────────────┼───────────────────────────────────┘
                  │
                  │ REST API Calls
                  ▼
┌─────────────────────────────────────────────────────┐
│            External API (localhost:8000)             │
│  - GET    /items?query=&status=                     │
│  - POST   /items                                    │
│  - PUT    /items/:id                                │
│  - DELETE /items/:id                                │
└─────────────────────────────────────────────────────┘
```

## Important Concepts

### Server Actions

Server Actions are a powerful feature in Next.js that allow you to run server-side code directly from your client components without creating API routes.

#### What are Server Actions?

Server Actions are asynchronous functions that execute on the server. They're defined with the `"use server"` directive and can be called directly from Client Components.

#### Implementation in This Project

Located in `actions/todo-actions.ts`, all server actions follow this pattern:

```typescript
"use server";

import { revalidatePath } from "next/cache";

export async function createTodo(todo: Partial<Todo>) {
  try {
    // 1. Make API request to backend
    const response = await fetch(`${process.env.BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });

    // 2. Handle response
    if (!response.ok) {
      return { success: false, error: "Failed to create todo" };
    }

    // 3. Revalidate cache to refresh UI
    revalidatePath("/");

    // 4. Return success
    return { success: true };
  } catch (error) {
    return { success: false, error: "An error occurred" };
  }
}
```

#### Key Benefits

1. **No API Routes Needed** - Direct server-side execution from client
2. **Type Safety** - Full TypeScript support across client-server boundary
3. **Automatic Serialization** - Complex data types handled automatically
4. **Cache Revalidation** - Built-in `revalidatePath()` for updating data
5. **Progressive Enhancement** - Works even if JavaScript fails to load

#### Server Actions in This App

| Action | Purpose | Revalidation |
|--------|---------|--------------|
| `createTodo()` | Creates a new todo | ✅ Revalidates `/` |
| `updateTodoStatus()` | Toggles todo status | ✅ Revalidates `/` |
| `removeTodo()` | Deletes a todo | ✅ Revalidates `/` |

### State Management

This project uses a **hybrid state management approach** that minimizes client-side state while maximizing server-side benefits.

#### Server-Side State (Primary Data Source)

**Location:** `app/page.tsx` (Server Component)

```typescript
export default async function Home({ searchParams }: Props) {
  const { query, status } = await searchParams;

  // Data fetched on the server during SSR
  const response = await fetch(
    `${process.env.BASE_URL}/items?query=${query ?? ""}&status=${status ?? ""}`
  );

  const result = await response.json();
  const todos: Todo[] = result.data;

  return <TodoList todos={todos} />;
}
```

**Benefits:**
- ✅ **SEO-Friendly** - Content rendered on server
- ✅ **Fast First Paint** - No loading spinners on initial render
- ✅ **Reduced Client Bundle** - No state management library needed
- ✅ **Single Source of Truth** - Server always has latest data

#### Client-Side State (UI-Only)

**Location:** `app/_components/todo-list.tsx` (Client Component)

```typescript
export default function TodoList({ todos }: { todos: Todo[] }) {
  // Local UI state only
  const [todo, setTodo] = useState<Partial<Todo>>({
    task: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  // ... rest of component
}
```

**What's Stored in Client State:**
- ✅ Form input values (temporary, not persisted)
- ✅ Loading states (for UX feedback)
- ✅ Search/filter inputs (synced to URL params)

**What's NOT in Client State:**
- ❌ Todo list data (comes from server via props)
- ❌ User authentication (would be in server session)
- ❌ Persisted application state

#### State Flow Diagram

```
User Action (e.g., "Add Todo")
        ↓
Client Component calls Server Action
        ↓
Server Action makes API call
        ↓
API updates database
        ↓
Server Action calls revalidatePath("/")
        ↓
Next.js refetches data in Server Component
        ↓
Server Component re-renders with fresh data
        ↓
Updated todos passed as props to Client Component
        ↓
UI updates automatically
```

#### URL-Based State (Search & Filters)

The app uses URL search parameters for shareable filter state:

```typescript
useEffect(() => {
  const debounce = setTimeout(() => {
    const params = new URLSearchParams();
    if (query.length > 0) params.set("query", query);
    if (status.length > 0) params.set("status", status);

    router.replace(`/?${params.toString()}`);
  }, 500);

  return () => clearTimeout(debounce);
}, [query, status]);
```

**Benefits:**
- ✅ Shareable URLs with filters applied
- ✅ Browser back/forward works correctly
- ✅ Bookmarkable filtered views
- ✅ Server-side filtering (better performance)

### Server vs Client Components

This project strategically uses both Server and Client Components:

#### Server Components

**`app/page.tsx`** - Main page component
- Fetches data from API
- Handles search params
- Renders error states
- No JavaScript sent to client for this component

**Benefits:**
- Zero client-side JavaScript for data fetching
- Can access backend resources directly
- Better performance and SEO

#### Client Components

**`app/_components/todo-list.tsx`** - Interactive UI
- Marked with `"use client"` directive
- Handles user interactions
- Manages form state
- Calls Server Actions

**When to Use Client Components:**
- Need React hooks (useState, useEffect, etc.)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, navigator, etc.)
- Third-party libraries that use hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd akf-nextjs-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   BASE_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
akf-nextjs-test/
├── actions/
│   └── todo-actions.ts          # Server Actions for CRUD operations
│
├── app/
│   ├── _components/             # Route-specific components
│   │   └── todo-list.tsx        # Main todo list (Client Component)
│   ├── layout.tsx               # Root layout with fonts & toaster
│   ├── page.tsx                 # Home page (Server Component)
│   └── globals.css              # Global styles & Tailwind directives
│
├── components/
│   └── ui/                      # Reusable UI components (shadcn/ui)
│       ├── button.tsx           # Button component with variants
│       ├── empty.tsx            # Empty state component
│       ├── input.tsx            # Styled input field
│       ├── select.tsx           # Dropdown select
│       └── sonner.tsx           # Toast notifications wrapper
│
├── lib/
│   └── utils.ts                 # Utility functions (cn helper)
│
├── types/
│   └── todo.ts                  # TypeScript type definitions
│
├── .env                         # Environment variables (not in git)
├── components.json              # shadcn/ui configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `actions/todo-actions.ts` | Server-side functions for data mutations |
| `app/page.tsx` | Server Component that fetches and displays todos |
| `app/_components/todo-list.tsx` | Client Component with interactive UI |
| `app/layout.tsx` | Root layout with fonts and global providers |
| `types/todo.ts` | TypeScript interfaces for type safety |
| `lib/utils.ts` | Helper functions like `cn()` for class merging |

## Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
BASE_URL=http://localhost:8000
```

**Note:** The backend API is separate from this frontend application. Ensure your backend server is running before starting this app.

## API Integration

This frontend connects to a REST API with the following endpoints:

### Endpoints

#### Get Todos
```
GET /items?query={searchQuery}&status={filterStatus}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "task": "Complete project",
      "status": "pending",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Todo
```
POST /items
Content-Type: application/json

{
  "task": "New task",
  "status": "pending"
}
```

#### Update Todo
```
PUT /items/:id
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Todo
```
DELETE /items/:id
```

## Development

### Code Style

This project uses:
- **ESLint** with Next.js recommended config
- **TypeScript** for type safety
- **Prettier** (optional) for code formatting

### Component Patterns

1. **Server Components** - Default for pages and layouts
2. **Client Components** - Marked with `"use client"` for interactivity
3. **Server Actions** - Marked with `"use server"` for mutations
4. **shadcn/ui Components** - Reusable, accessible UI primitives

### Adding New Features

1. **Add Server Action** (if needed)
   ```typescript
   // actions/todo-actions.ts
   export async function myNewAction(data: MyType) {
     "use server";
     // Implementation
     revalidatePath("/");
   }
   ```

2. **Update Client Component**
   ```typescript
   // app/_components/todo-list.tsx
   import { myNewAction } from "@/actions/todo-actions";

   // Call in event handler
   onClick={() => myNewAction(data)}
   ```

3. **Add TypeScript Types**
   ```typescript
   // types/my-type.ts
   export type MyType = {
     // ...
   };
   ```

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [Next.js App Router](https://nextjs.org/docs/app) - App Router guide
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Official guide

### Component Library

- [shadcn/ui](https://ui.shadcn.com/) - Component documentation
- [Radix UI](https://www.radix-ui.com/) - Primitive components
- [Lucide Icons](https://lucide.dev/) - Icon library

## Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js app:

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This app can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Docker

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Built with ❤️ using Next.js, React, and TypeScript**
