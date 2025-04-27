import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useSignIn, useSignUp } from '@clerk/clerk-react'
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

type OtpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  otp: z.string().min(1, { message: 'Please enter your otp code.' }),
})

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)
  const { signIn, setActive: setSignInActive } = useSignIn()
  const { signUp, setActive: setSignUpActive } = useSignUp()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      // Check which flow we're in (sign-in or sign-up)
      if (isSignIn && signIn) {
        // Handle sign-in verification (for 2FA)
        const result = await signIn.attemptSecondFactor({
          strategy: 'phone_code',
          code: data.otp,
        })
        
        if (result.status === 'complete') {
          // Sign-in with 2FA successful
          await setSignInActive({ session: result.createdSessionId })
          toast.success('Sign-in successful!')
          navigate({ to: '/' })
        }
      } else if (signUp) {
        // Handle sign-up email verification
        const result = await signUp.attemptEmailAddressVerification({
          code: data.otp,
        })
        
        if (result.status === 'complete') {
          // Sign-up verification successful
          await setSignUpActive({ session: result.createdSessionId })
          toast.success('Email verified successfully!')
          navigate({ to: '/' })
        } else {
          toast.error('Verification failed')
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error)
      toast.error(error.errors?.[0]?.message || 'Verification code is invalid')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resending the verification code
  const handleResendCode = async () => {
    try {
      setIsLoading(true)
      
      if (isSignIn && signIn) {
        // Resend 2FA code for sign-in
        await signIn.prepareSecondFactor({
          strategy: 'phone_code',
        })
        toast.success('A new code has been sent')
      } else if (signUp) {
        // Resend verification email for sign-up
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        })
        toast.success('A new code has been sent to your email')
      }
    } catch (error: any) {
      console.error('Error resending code:', error)
      toast.error(error.errors?.[0]?.message || 'Failed to send a new code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading || !otp || otp.length < 6}>
          Verify Account
        </Button>
        <Button variant="link" type="button" onClick={handleResendCode} disabled={isLoading}>
          Didn't receive a code? Send again
        </Button>
      </form>
    </Form>
  )
}
