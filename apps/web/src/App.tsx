import { Route, Routes } from 'react-router'

import { ClientLayout } from './layouts/ClientLayout'
import { InstructorLayout } from './layouts/InstructorLayout'
//views
import { HomeView } from './views/HomeView'
import { InstructorView } from './views/InstructorView'
import { InstructorsList } from './views/InstructorsList'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomeView />} />
        <Route path="instructors" element={<InstructorsList />} />
      </Route>
      <Route path="/instructor" element={<InstructorLayout />}>
        <Route index element={<InstructorView />} />
      </Route>
    </Routes>
  )
}
