import { Outlet } from 'react-router'

export function ClientLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
