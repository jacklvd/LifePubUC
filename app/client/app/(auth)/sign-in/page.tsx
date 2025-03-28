'use client'

import React from 'react'
import AuthForm from '@/app/(auth)/components/authform'
import { signInSchema } from '@/lib/validations'
import { signInWithCredentials } from '@/lib/actions/auth-actions'

const Page = () => (
  <AuthForm
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
      email: '',
      password: '',
    }}
    onSubmit={signInWithCredentials}
  />
)

export default Page
