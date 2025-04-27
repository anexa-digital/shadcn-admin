import { ClerkProvider } from '@clerk/clerk-react'
import { ReactNode } from 'react'
import { dark } from '@clerk/themes'
import { useTheme } from '@/context/theme-context'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing Clerk publishable key')
}

interface ClerkProviderProps {
  children: ReactNode
}

export function ClerkAuthProvider({ children }: ClerkProviderProps) {
  const { theme } = useTheme()
  
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        elements: {
          formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'bg-background',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'border-border bg-background',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background border-input',
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
} 