/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
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
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FIELD_NAMES, FIELD_TYPES } from '@/constants'
import { Icon } from '@/components/icons'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSignIn = type === 'SIGN_IN'

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
    mode: 'onChange',
  })

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      setIsSubmitting(true)
      const result = await onSubmit(data)

      if (result.success) {
        toast.success(`Successfully ${isSignIn ? 'signed in' : 'signed up'}!`)
        router.push('/')
      } else {
        toast.warning(`Failed to ${isSignIn ? 'sign in' : 'sign up'}.`, {
          description: result.error,
        })
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred. Please try again.')
      console.error('Unexpected error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="flex flex-col bg-emerald-700 border-slate-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">
          {isSignIn ? 'Welcome back to LifePub' : 'Create your account'}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {isSignIn
            ? 'Access the vast collection of resources, and stay updated'
            : 'Please complete all fields and insert a valid university ID to gain access to the website'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              {Object.keys(defaultValues).map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field as Path<T>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">
                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          required
                          type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                          placeholder={`Enter your ${FIELD_NAMES[field.name as keyof typeof FIELD_NAMES].toLowerCase()}`}
                          {...field}
                          className="bg-slate-700 border-slate-600 text-white focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* {!isSignIn && (
              <div className="text-sm text-slate-400">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
            )} */}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  {isSignIn ? 'Signing In...' : 'Signing Up...'}
                </>
              ) : (
                isSignIn ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">
                {isSignIn ? 'New to LifePub?' : 'Already have an account?'}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={isSignIn ? '/sign-up' : '/sign-in'}
              className="text-primary hover:underline font-medium"
            >
              {isSignIn ? 'Create an account' : 'Sign in to your account'}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AuthForm