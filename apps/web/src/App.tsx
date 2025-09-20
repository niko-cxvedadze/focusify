import { Route, Routes } from 'react-router'

import { ClientLayout } from './layouts/ClientLayout'
import { HomeView } from './views/HomeView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomeView />} />
      </Route>
    </Routes>
  )
}
