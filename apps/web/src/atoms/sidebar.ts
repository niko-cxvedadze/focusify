import { atomWithStorage } from 'jotai/utils'

// Sidebar state atom that persists to localStorage
export const sidebarOpenAtom = atomWithStorage('sidebar-open', true)