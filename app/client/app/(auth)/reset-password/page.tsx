/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(auth)/reset-password/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { resetPassword, validateResetToken } from '@/lib/actions/auth-actions'

const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [isValidToken, setIsValidToken] = useState(false)

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValidating(false)
                return
            }

            const result = await validateResetToken(token)
            setIsValidToken(result.success)
            setIsValidating(false)

            if (!result.success) {
                toast.error('Invalid or Expired Token', {
                    description: 'Please request a new password reset link.',
                })
            }
        }

        validateToken()
    }, [token])

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) return

        try {
            setIsSubmitting(true)
            const result = await resetPassword(token, data.password)

            if (result.success) {
                toast.success('Password Reset Successful', {
                    description: 'You can now sign in with your new password.',
                })
                router.push('/sign-in')
            } else {
                toast.error('Failed to Reset Password', {
                    description: result.error,
                })
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isValidating) {
        return (
            <Card className="flex flex-col bg-emerald-700 border-slate-700">
                <CardContent className="flex items-center justify-center p-6">
                    <Icon name="Loader2" className="h-8 w-8 animate-spin text-white" />
                </CardContent>
            </Card>
        )
    }

    if (!token || !isValidToken) {
        return (
            <Card className="flex flex-col bg-emerald-700 border-slate-700">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">
                        Invalid Reset Link
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        This password reset link is invalid or has expired.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-slate-300">
                        Please request a new password reset link. Reset links are valid for 1 hour.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/forgot-password">
                            <Button className="bg-primary hover:bg-primary/90 text-white">
                                Request New Reset Link
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
                    Reset Your Password
                </CardTitle>
                <CardDescription className="text-slate-400">
                    Enter your new password below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-200">New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your new password"
                                            {...field}
                                            className="bg-slate-700 border-slate-600 text-white focus:ring-primary focus:border-primary"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-200">Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm your new password"
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
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ResetPassword