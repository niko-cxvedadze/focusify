import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export function HomeView() {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 space-y-6 md:space-y-8 bg-background">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-divider">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome to Starter Kit</h1>
        <ThemeSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Clean React Starter
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            A modern starter template built with React 19, Vite, HeroUI, Tailwind CSS, and InstantDB.
          </p>
          <p className="text-base text-muted-foreground">
            Ready for your next amazing project. Start building something great!
          </p>
        </div>
      </div>
    </div>
  )
}
