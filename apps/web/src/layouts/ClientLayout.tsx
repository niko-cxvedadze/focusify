import { Outlet } from 'react-router'

export function ClientLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
