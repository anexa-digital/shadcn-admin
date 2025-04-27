# Shadcn Admin Dashboard

Admin Dashboard UI crafted with Shadcn and Vite. Built with responsiveness and accessibility in mind.

![alt text](public/images/shadcn-admin.png)

I've been creating dashboard UIs at work and for my personal projects. I always wanted to make a reusable collection of dashboard UI for future projects; and here it is now. While I've created a few custom components, some of the code is directly adapted from ShadcnUI examples.

> This is not a starter project (template) though. I'll probably make one in the future.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global Search Command
- 10+ pages
- Extra custom components

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [Eslint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [Tabler Icons](https://tabler.io/icons)

## Run Locally

Clone the project

```bash
  git clone https://github.com/satnaing/shadcn-admin.git
```

Go to the project directory

```bash
  cd shadcn-admin
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Author

Crafted with 🤍 by [@satnaing](https://github.com/satnaing)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)

## Authentication with Clerk

This project uses [Clerk](https://clerk.com) for authentication. Clerk provides a complete user management platform with features like:

- Email/password authentication
- Social login (GitHub, Facebook, etc.)
- Multi-factor authentication
- Email verification
- Account management

### Setup Clerk

1. Create a Clerk account at [https://clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Configure your authentication methods (email/password, social logins, etc.)
4. Get your API keys from the Clerk dashboard
5. Create a `.env` file in the root directory with the following variables:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Authentication Flow

The application integrates Clerk with the existing auth flow:

1. Users can sign in/sign up using the existing UI
2. Clerk handles the authentication process
3. Upon successful authentication, Clerk generates a JWT token
4. The token is stored in the existing auth store for use with your API
5. Protected routes check both Clerk's authentication state and the auth store

### Components

Several components have been added/modified to support Clerk:

- `ClerkAuthProvider`: Wraps the application with Clerk's context
- `ProtectedRoute`: A component that ensures routes are only accessible to authenticated users
- `UserButton`: A customized version of Clerk's UserButton for user account management

### Custom Hook

The `useClerkAuth` hook synchronizes Clerk's authentication state with the existing auth store, ensuring both systems work together seamlessly.
