import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { useSignUp } from '@clerk/clerk-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signUp, setActive } = useSignUp()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      if (!signUp) {
        toast.error('Authentication service is not available')
        setIsLoading(false)
        return
      }
      
      // Create the user with Clerk
      const result = await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
      })

      // Start email verification
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })
      
      if (result.status === 'complete') {
        // Sign-up successful and complete
        await setActive({ session: result.createdSessionId })
        toast.success('Account created successfully')
        navigate({ to: '/' })
      } else {
        // User needs to verify their email
        toast.info('Please verify your email address')
        navigate({ to: '/otp' })
      }
    } catch (error: any) {
      console.error('Error signing up:', error)
      toast.error(error.errors?.[0]?.message || 'An error occurred during sign-up')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'oauth_github' | 'oauth_facebook' | 'oauth_google') => {
    try {
      if (!signUp) {
        toast.error('Authentication service is not available')
        return
      }
      
      setIsLoading(true)
      // Start OAuth flow
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/`,
      })
    } catch (error: any) {
      console.error(`Error signing up with ${provider}:`, error)
      toast.error(error.errors?.[0]?.message || `An error occurred during ${provider} sign-up`)
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Create a password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button className='mt-2' disabled={isLoading}>
          Create Account
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-3'>
          <Button 
            variant='outline' 
            type='button' 
            disabled={isLoading}
            onClick={() => handleOAuthSignUp('oauth_google')}
          >
            <IconBrandGoogle className='h-4 w-4' /> Google
          </Button>
          <Button 
            variant='outline' 
            type='button' 
            disabled={isLoading}
            onClick={() => handleOAuthSignUp('oauth_github')}
          >
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button 
            variant='outline' 
            type='button' 
            disabled={isLoading}
            onClick={() => handleOAuthSignUp('oauth_facebook')}
          >
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
