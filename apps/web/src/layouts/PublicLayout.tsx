import { Outlet } from "react-router";
import { Header } from "../components/Header";

export function PublicLayout() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-screen-xl px-6">
        <Outlet />
      </div>
    </>
  );
}
