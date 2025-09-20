import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useTheme } from '@/providers/ThemeProvider'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
