import { Outlet } from "react-router-dom";

import { MainLayout } from "~/systems/Core";

export function PoolPage() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
