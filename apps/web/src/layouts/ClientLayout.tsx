import { Outlet } from 'react-router'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
