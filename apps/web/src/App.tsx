import { Route, Routes } from 'react-router'

import { ClientLayout } from './layouts/ClientLayout'
import { db } from './lib/instant'
import { HomeView } from './views/HomeView'
import { LoginView } from './views/LoginView'

export default function App() {
  return (
    <>
      <db.SignedOut>
        <LoginView />
      </db.SignedOut>
      <db.SignedIn>
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<HomeView />} />
          </Route>
        </Routes>
      </db.SignedIn>
    </>
  )
}
