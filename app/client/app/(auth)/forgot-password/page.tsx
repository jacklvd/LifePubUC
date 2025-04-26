/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Icon } from '@/components/icons'
import { requestPasswordReset } from '@/lib/actions/auth-actions'

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)

    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            setIsSubmitting(true)
            const result = await requestPasswordReset(data.email)

            if (result.success) {
                setIsEmailSent(true)
                toast.success('Password Reset Email Sent', {
                    description: 'If an account exists with this email, a password reset link will be sent.',
                })
            } else {
                toast.error('Failed to Send Reset Email', {
                    description: result.error,
                })
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isEmailSent) {
        return (
            <Card className="flex flex-col bg-emerald-700 border-slate-700">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">
                        Check Your Email
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        If an account exists with the email you provided, we&apos;ve sent password reset instructions to your inbox.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-slate-300">
                        Please check your email and click on the password reset link. The link will expire in 1 hour.
                    </p>
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setIsEmailSent(false)}
                            className="text-slate-200 border-slate-600 hover:bg-slate-700"
                        >
                            Try Another Email
                        </Button>
                        <Link href="/sign-in">
                            <Button className="bg-primary hover:bg-primary/90 text-white">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col bg-emerald-700 border-slate-700">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-white">
                    Forgot Password?
                </CardTitle>
                <CardDescription className="text-slate-400">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-200">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                            className="bg-slate-700 border-slate-600 text-white focus:ring-primary focus:border-primary"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Reset Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center">
                    <Link
                        href="/sign-in"
                        className="text-primary hover:underline font-medium"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default ForgotPassword