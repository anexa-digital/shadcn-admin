import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { useSignIn } from '@clerk/clerk-react'
import { toast } from 'sonner'
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

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, setActive } = useSignIn()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      if (!signIn) {
        toast.error('Authentication service is not available')
        setIsLoading(false)
        return
      }
      
      // Start the sign-in process using Clerk
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (result.status === 'complete') {
        // Sign-in successful
        await setActive({ session: result.createdSessionId })
        toast.success('Signed in successfully')
        navigate({ to: '/' })
      } else {
        // User needs to complete additional steps
        console.log(result)
        
        // Handle specific cases - like OTP verification if needed
        if (result.status === 'needs_second_factor') {
          navigate({ to: '/otp' })
        }
      }
    } catch (error: any) {
      console.error('Error signing in:', error)
      toast.error(error.errors?.[0]?.message || 'An error occurred during sign-in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'oauth_github' | 'oauth_facebook' | 'oauth_google') => {
    try {
      if (!signIn) {
        toast.error('Authentication service is not available')
        return
      }
      
      setIsLoading(true)
      // Start OAuth flow
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/`,
      })
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error)
      toast.error(error.errors?.[0]?.message || `An error occurred during ${provider} sign-in`)
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
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Login
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
            onClick={() => handleOAuthSignIn('oauth_google')}
          >
            <IconBrandGoogle className='h-4 w-4' /> Google
          </Button>
          <Button 
            variant='outline' 
            type='button' 
            disabled={isLoading}
            onClick={() => handleOAuthSignIn('oauth_github')}
          >
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button 
            variant='outline' 
            type='button' 
            disabled={isLoading}
            onClick={() => handleOAuthSignIn('oauth_facebook')}
          >
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
