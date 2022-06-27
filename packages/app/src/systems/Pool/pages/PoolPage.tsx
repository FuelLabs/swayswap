import { Outlet } from "react-router-dom";

import { MainLayout, PrivateRoute } from "~/systems/Core";

export function PoolPage() {
  return (
    <PrivateRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </PrivateRoute>
  );
}
