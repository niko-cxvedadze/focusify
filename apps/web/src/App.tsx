import { Routes, Route } from "react-router";
import { PublicLayout } from "./layouts/PublicLayout";

//views
import { HomeView } from "./views/HomeView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomeView />} />
      </Route>
    </Routes>
  );
}
