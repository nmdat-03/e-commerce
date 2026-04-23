Restaurant Website

A modern full-stack e-commerce web application built with Next.js, featuring product browsing, cart management, and a complete checkout flow.

This project focuses on building a scalable frontend architecture, clean UI/UX, and real-world e-commerce functionalities.

✨ Features

🛍️ User Features

- Browse product list with responsive UI

- View product details

- Add/remove items to cart

- Update quantity in cart

- Checkout flow

- Authentication (Sign in / Sign up with Clerk)

⚙️ System Features

- Persistent cart using Zustand

- Form validation with React Hook Form + Zod

- Smooth UI animations (Framer Motion)

- Reusable UI components with shadcn/ui

- Server-side data fetching with Next.js

🛠️ Tech Stack

- Frontend: Next.js 15, React 19, TypeScript

- Styling: TailwindCSS, shadcn/ui

- State Management: Zustand

- Forms & Validation: React Hook Form, Zod

- Authentication: Clerk

- Database: Prisma ORM + PostgreSQL

- UI & Animation: Framer Motion, Radix UI, Lucide Icons

⚙️ Installation

git clone https://github.com/nmdat-03/restaurant.git

cd restaurant

npm install

npm run dev

🔑 Environment Variables

Create a .env file:

DATABASE_URL=""

NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

CLERK_WEBHOOK_SECRET=
