import { Route, Routes } from 'react-router'

import { ClientLayout } from './layouts/ClientLayout'
import { InstructorLayout } from './layouts/InstructorLayout'
//views
import { ClientView } from './views/ClientView/ClientView'
import { InstructorView } from './views/InstructorView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<ClientView />} />
      </Route>
      <Route path="/instructor" element={<InstructorLayout />}>
        <Route index element={<InstructorView />} />
      </Route>
    </Routes>
  )
}
