import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function useClerkAuth() {
  const { isLoaded, userId, getToken } = useAuth()
  const { user } = useUser()
  const { setUser, setAccessToken } = useAuthStore((state) => state.auth)

  useEffect(() => {
    if (!isLoaded || !userId || !user) return

    // Get a JWT token from Clerk for use with your backend
    const syncAuthState = async () => {
      try {
        // Get JWT token
        const token = await getToken()
        
        if (token) {
          // Log the JWT token to console
          console.log('JWT Token:', token)
          
          // Set token in your existing auth store
          setAccessToken(token)
          
          // Create a user object that matches your current structure
          const clerkUser = {
            accountNo: userId,
            email: user.primaryEmailAddress?.emailAddress || '',
            role: ['user'], // Default role, adjust as needed
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
          }
          
          // Set user in your existing auth store
          setUser(clerkUser)
        }
      } catch (error) {
        console.error('Error syncing Clerk auth state:', error)
      }
    }
    
    syncAuthState()
  }, [isLoaded, userId, user, getToken, setUser, setAccessToken])

  return { isLoaded, userId, user }
} 