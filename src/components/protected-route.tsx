import { ReactNode, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { useAuthStore } from '@/stores/authStore'
import { useClerkAuth } from '@/hooks/use-clerk-auth'
import { LoaderCircle } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const { isLoaded, isSignedIn } = useAuth()
  const { accessToken } = useAuthStore((state) => state.auth)
  
  // Use our custom hook to sync Clerk with our auth store
  useClerkAuth()
  
  useEffect(() => {
    // If Clerk has loaded and the user is not signed in, redirect to login
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/sign-in' })
    }
  }, [isLoaded, isSignedIn, navigate])
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  
  // If not authenticated, don't render children
  if (!isSignedIn || !accessToken) {
    return null
  }
  
  // User is authenticated, render the children
  return <>{children}</>
} 