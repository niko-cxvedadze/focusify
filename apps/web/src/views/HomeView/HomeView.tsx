import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { db } from '@/lib/instant'

export function HomeView() {
  const { user } = db.useAuth()

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="space-y-8 w-full max-w-4xl">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">Welcome!</CardTitle>
                  <CardDescription className="mt-1">{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You're successfully signed in to your account.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">What's next?</p>
                  <ul className="text-sm text-muted-foreground text-left space-y-1">
                    <li>• Build your amazing features</li>
                    <li>• Add your components</li>
                    <li>• Connect to InstantDB</li>
                    <li>• Deploy your app</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to build?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                This starter kit includes everything you need to build a modern React application:
              </CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Frontend Stack</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• React 19 with TypeScript</li>
                    <li>• Vite for fast development</li>
                    <li>• shadcn/ui component library</li>
                    <li>• Tailwind CSS for styling</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Backend & Auth</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• InstantDB real-time database</li>
                    <li>• Magic code authentication</li>
                    <li>• Type-safe database operations</li>
                    <li>• Auto-sync across clients</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
