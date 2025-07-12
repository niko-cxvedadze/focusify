import { PropsWithChildren } from 'react'

import { HeroUIProvider } from '@heroui/react'
import { useHref, useNavigate } from 'react-router'

export function Providers({ children }: PropsWithChildren) {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </HeroUIProvider>
  )
}
