import { Route, Routes } from 'react-router'

import { ClientLayout } from './layouts/ClientLayout'
import { db } from './lib/instant'
import { DashboardView } from './views/DashboardView'
import { ProjectsView } from './views/ProjectsView'
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
            <Route index element={<DashboardView />} />
            <Route path="projects" element={<ProjectsView />} />
          </Route>
        </Routes>
      </db.SignedIn>
    </>
  )
}
