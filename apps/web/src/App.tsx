import { Navigate, Route, Routes } from 'react-router'

import { ClientLayout } from './layouts/ClientLayout'
import { db } from './lib/instant'
import { LoginView } from './views/LoginView'
import { ProjectsView } from './views/ProjectsView'
import { ReportsView } from './views/ReportsView'
import { TrackingView } from './views/TrackingView'

export default function App() {
  return (
    <>
      <db.SignedOut>
        <LoginView />
      </db.SignedOut>
      <db.SignedIn>
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Navigate to="/projects" replace />} />
            <Route path="projects" element={<ProjectsView />} />
            <Route path="tracking" element={<TrackingView />} />
            <Route path="tracking/:projectId" element={<TrackingView />} />
            <Route path="reports" element={<ReportsView />} />
          </Route>
        </Routes>
      </db.SignedIn>
    </>
  )
}
