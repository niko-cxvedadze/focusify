import { Outlet } from 'react-router'
import { useAtom } from 'jotai'

import { AppSidebar } from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { sidebarOpenAtom } from '@/atoms/sidebar'

export function ClientLayout() {
  const [open, setOpen] = useAtom(sidebarOpenAtom)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
