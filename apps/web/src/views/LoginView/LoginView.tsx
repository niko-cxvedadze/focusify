import { useState } from 'react'

import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { db } from '@/lib/instant'

interface LoginProps {
  onSuccess?: () => void
}

interface LoginPhotoProps {
  title: string
  description: string
}

function LoginPhoto({ title, description }: LoginPhotoProps) {
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2469&q=80"
        alt="Modern office workspace with laptops and coffee"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 flex items-end p-8">
        <div className="text-white space-y-2">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-white/90 text-lg max-w-md">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function LoginView({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      await db.auth.sendMagicCode({ email: email.trim() })
      setStep('code')
    } catch (err: any) {
      setError(err.message || 'Failed to send magic code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      await db.auth.signInWithMagicCode({ email, code: code.trim() })
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
    setError(null)
  }

  if (step === 'email') {
    return (
      <div className="flex min-h-screen relative">
        {/* Theme Switcher - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeSwitcher />
        </div>

        {/* Left side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      className="h-11"
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={!email.trim() || isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Magic Code'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We'll send you a magic link to sign in instantly
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <LoginPhoto
          title="Start your journey"
          description="Join thousands of users building amazing things with our platform"
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Theme Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      {/* Left side - Code Verification Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
            <p className="text-muted-foreground mt-2">
              We sent a code to <strong>{email}</strong>
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="code"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                    maxLength={6}
                    required
                    className="h-11"
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <Button type="submit" className="w-full h-11" disabled={!code.trim() || isLoading}>
                  {isLoading ? 'Verifying...' : 'Sign In'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  ← Back to email
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Didn't receive the code? Check your spam folder
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoginPhoto
        title="Almost there!"
        description="Check your email and enter the verification code to complete your sign-in"
      />
    </div>
  )
}
