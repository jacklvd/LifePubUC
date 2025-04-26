'use client'

import AuthForm from '@/app/(auth)/components/authform'
import { signUpSchema } from '@/lib/validations'
import { signUp } from '@/lib/actions/auth-actions'

const SignUp = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      email: '',
      password: '',
      fullName: '',
      universityId: '',
    }}
    onSubmit={signUp}
  />
)

export default SignUp
