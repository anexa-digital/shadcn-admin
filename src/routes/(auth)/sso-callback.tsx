import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

function SSOCallback() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoaded) {
        if (isSignedIn) {
          // Successfully signed in
          toast.success('Successfully signed in')
          navigate({ to: '/' })
        } else {
          // Not signed in yet, may still be processing
          console.log('Waiting for authentication to complete...')
        }
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isLoaded, isSignedIn, navigate]);

  // Set a fallback timeout for cases where the callback gets stuck
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      toast.error('Authentication timed out. Please try signing in again.')
      navigate({ to: '/sign-in' })
    }, 15000) // 15 seconds fallback timeout
    
    return () => clearTimeout(fallbackTimeout)
  }, [navigate])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="h-8 w-8 animate-spin" />
        <h1 className="text-lg font-medium">Processing authentication...</h1>
        <p className="text-muted-foreground text-sm">
          You'll be redirected automatically.
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/(auth)/sso-callback')({
  component: SSOCallback,
}) 