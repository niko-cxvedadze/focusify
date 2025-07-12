import { RefObject, useEffect, useRef, useState } from 'react'

export function useSticky<T extends HTMLElement = HTMLDivElement>(): [RefObject<T>, boolean] {
  const [isSticky, setIsSticky] = useState(false)
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        setIsSticky(rect.top <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return [elementRef as RefObject<T>, isSticky]
}
