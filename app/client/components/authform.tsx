/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import { ZodType } from 'zod'

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
import Link from 'next/link'
import { toast } from 'sonner'
import { FIELD_NAMES, FIELD_TYPES } from '@/constants'
import { useRouter } from 'next/navigation'
// import { useSearchParams } from 'next/navigation';

interface Props<T extends FieldValues> {
  schema: ZodType<T>
  defaultValues: T
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>
  type: 'SIGN_IN' | 'SIGN_UP'
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter()
  // const searchParams = useSearchParams();
  const isSignIn = type === 'SIGN_IN'

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  })

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      const result = await onSubmit(data)

      if (result.success) {
        toast.success(`Successfully ${isSignIn ? 'signed in' : 'signed up'}!`)

        // await new Promise(resolve => setTimeout(resolve, 100));

        // const callbackUrl = searchParams.get("callbackUrl");
        // router.replace(callbackUrl || "/");
        // router.refresh(); // Refresh server components
        router.push('/')
      } else {
        toast.warning(`Failed to ${isSignIn ? 'sign in' : 'sign up'}.`, {
          description: result.error,
        })
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred. Please try again.')
      console.error('Unexpected error:', error)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? 'Welcome back to LifePub' : 'Create your account'}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? 'Access the vast collection of resources, and stay updated'
          : 'Please complete all fields and insert a valid university ID to gain access to the website'}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                      {...field}
                      className="form-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? 'New to LifePub? ' : 'Already have an account? '}

        <Link
          href={isSignIn ? '/sign-up' : '/sign-in'}
          className="font-bold text-primary"
        >
          {isSignIn ? 'Create an account' : 'Sign in'}
        </Link>
      </p>
    </div>
  )
}
export default AuthForm
