import { createFileRoute } from '@tanstack/react-router'
import { useAuth, useUser, useSignIn, useSignUp, useClerk } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function TestAuth() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { signIn } = useSignIn()
  const [authState, setAuthState] = useState<Record<string, any>>({})
  
  useEffect(() => {
    if (isLoaded) {
      setAuthState({
        isLoaded,
        isSignedIn,
        userId,
        email: user?.primaryEmailAddress?.emailAddress,
        firstName: user?.firstName,
        lastName: user?.lastName
      })
    }
  }, [isLoaded, isSignedIn, userId, user])
  
  const handleGoogleSignIn = async () => {
    try {
      if (signIn) {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectUrlComplete: `${window.location.origin}/test-auth`,
        })
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }
  
  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/sign-in'
    } catch (error) {
      console.error('Sign-out error:', error)
    }
  }
  
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Clerk Authentication Test</CardTitle>
          <CardDescription>
            {isLoaded 
              ? (isSignedIn 
                  ? 'You are signed in!' 
                  : 'You are not signed in.') 
              : 'Loading authentication...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-md overflow-auto max-h-60">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isSignedIn ? (
            <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
          ) : (
            <Button onClick={handleGoogleSignIn}>Sign In with Google</Button>
          )}
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/(auth)/test-auth')({
  component: TestAuth,
}) 