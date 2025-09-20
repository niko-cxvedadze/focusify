import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { db } from '@/lib/instant'

interface LoginProps {
  onSuccess?: () => void
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
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Enter your email to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
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
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent a code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">Verification Code</label>
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
                maxLength={6}
                required
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Sign In'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
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
  )
}
