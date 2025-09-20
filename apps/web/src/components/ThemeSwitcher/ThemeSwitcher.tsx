import { Button } from '@heroui/button'
import { useTheme } from '@heroui/use-theme'
import { MdLightMode, MdDarkMode } from 'react-icons/md'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      isIconOnly
      variant="ghost"
      onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
    </Button>
  )
}