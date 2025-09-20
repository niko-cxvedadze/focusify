import { PropsWithChildren } from 'react'

import { ThemeProvider } from './ThemeProvider'

export function Providers({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>
}
