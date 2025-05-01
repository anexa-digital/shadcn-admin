# Clerk Authentication Documentation

## Overview

This documentation outlines the implementation of Clerk authentication in the admin dashboard application. Clerk provides a complete authentication and user management solution that has been integrated with the application's existing auth state management.

## Architecture

### Key Components

1. **ClerkAuthProvider**: The root provider component that initializes Clerk authentication
2. **useClerkAuth Hook**: Custom hook that synchronizes Clerk state with the application's auth store
3. **Protected Routes**: Component that ensures only authenticated users can access certain routes
4. **Authentication UI**: Sign-in, sign-up, and other auth-related screens

## Setup and Configuration

### Environment Variables

The application requires a Clerk publishable key to initialize:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### Provider Setup

The `ClerkAuthProvider` component is configured in `src/context/clerk-provider.tsx` and wraps the entire application:

```jsx
<ClerkProvider
  publishableKey={publishableKey}
  appearance={{
    baseTheme: theme === 'dark' ? dark : undefined,
    elements: {
      formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      card: 'bg-background',
      // Additional styling elements...
    }
  }}
>
  {children}
</ClerkProvider>
```

## Authentication Flow

### State Synchronization

The `useClerkAuth` hook in `src/hooks/use-clerk-auth.ts` synchronizes Clerk's authentication state with the application's custom auth store:

```jsx
useEffect(() => {
  if (!isLoaded || !userId || !user) return

  const syncAuthState = async () => {
    try {
      // Get JWT token with custom template
      const token = await getToken({ template: 'omnipulse' })
      
      if (token) {
        // Set token in auth store
        setAccessToken(token)
        
        // Map Clerk user to application user model
        const clerkUser = {
          accountNo: userId,
          email: user.primaryEmailAddress?.emailAddress || '',
          role: ['user'], // Default role
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
        }
        
        setUser(clerkUser)
      }
    } catch (error) {
      console.error('Error syncing Clerk auth state:', error)
    }
  }
  
  syncAuthState()
}, [isLoaded, userId, user, getToken, setUser, setAccessToken])
```

### Auth Store

The application uses a Zustand store (`authStore.ts`) to maintain authentication state:

- Stores user information
- Manages access tokens
- Handles token persistence with cookies
- Provides methods for resetting auth state

## Protected Routes

The `ProtectedRoute` component ensures that only authenticated users can access certain parts of the application:

```jsx
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const { isLoaded, isSignedIn } = useAuth()
  const { accessToken } = useAuthStore((state) => state.auth)
  
  // Use custom hook to sync Clerk with auth store
  useClerkAuth()
  
  useEffect(() => {
    // Redirect to login if not signed in
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/sign-in' })
    }
  }, [isLoaded, isSignedIn, navigate])
  
  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return <LoadingSpinner />
  }
  
  // Only render children when authenticated
  return isSignedIn && accessToken ? children : null
}
```

## Authentication UI

### Sign-In Flow

The application implements a full sign-in flow with:

1. Email/password authentication
2. OAuth providers (Google, GitHub, Facebook)
3. Password recovery
4. Multi-factor authentication support (OTP)

Example sign-in implementation:

```jsx
// Using Clerk's useSignIn hook
const { signIn, setActive } = useSignIn()

async function onSubmit(data) {
  try {
    const result = await signIn.create({
      identifier: data.email,
      password: data.password,
    })

    if (result.status === 'complete') {
      await setActive({ session: result.createdSessionId })
      navigate({ to: '/' })
    } else if (result.status === 'needs_second_factor') {
      navigate({ to: '/otp' })
    }
  } catch (error) {
    // Handle errors
  }
}
```

### OAuth Authentication

The application supports social login via:

```jsx
const handleOAuthSignIn = async (provider) => {
  await signIn.authenticateWithRedirect({
    strategy: provider, // 'oauth_github', 'oauth_google', etc.
    redirectUrl: `${window.location.origin}/sso-callback`,
    redirectUrlComplete: `${window.location.origin}/`,
  })
}
```

## Session Management

- Sessions are managed by Clerk
- JWT tokens are used for API authentication
- Custom token templates can be configured in the Clerk dashboard
- Token expiration is handled automatically

## Security Considerations

- Tokens are stored in HTTP-only cookies
- Automatic token refresh
- Role-based access control support
- Secure redirect handling for OAuth flows

## Custom JWT Template

The application uses a custom JWT template named 'omnipulse' that should be configured in the Clerk dashboard to include necessary claims for the backend API.

## Error Handling

The authentication flow includes comprehensive error handling:
- User-friendly error messages
- Graceful fallbacks for network issues
- Session expiration detection and handling

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand) 