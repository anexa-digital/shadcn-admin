import { UserButton as ClerkUserButton } from '@clerk/clerk-react'
import { useClerkAuth } from '@/hooks/use-clerk-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'

interface UserButtonProps {
  // Add any custom props here
}

export function UserButton(props: UserButtonProps) {
  // Ensure Clerk state is synced with our auth store
  useClerkAuth()
  
  const { user } = useAuthStore((state) => state.auth)
  
  // Get initials for the avatar fallback
  const getInitials = () => {
    if (!user?.email) return 'U'
    
    // Extract first letter of email or use first character
    const email = user.email
    return email.charAt(0).toUpperCase()
  }

  return (
    <ClerkUserButton
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          userButtonAvatarBox: "h-9 w-9",
          userButtonPopoverCard: "shadow-md rounded-md border border-border",
          userButtonPopoverActionButton: "hover:bg-accent hover:text-accent-foreground",
          userButtonPopoverActionButtonText: "text-sm font-medium",
          userButtonPopoverFooter: "hidden", // Hide the Clerk branding
        }
      }}
      userProfileUrl="/profile" // This will redirect to your custom profile page if you have one
      userProfileMode="navigation"
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={""} alt={user?.email || 'User'} />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
    </ClerkUserButton>
  )
} 