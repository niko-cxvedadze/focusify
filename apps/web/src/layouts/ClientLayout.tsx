import { Outlet } from 'react-router'

import { Header } from '../components/Header'

export function ClientLayout() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-screen-xl max-xl:max-w-screen-lg max-lg:max-w-screen-md px-6">
        <Outlet />
      </div>
    </>
  )
}
