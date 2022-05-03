import Header from "src/components/Header";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#282c34] text-white select-none flex flex-col justify-between`,
};

export function MainLayout() {
  return (
    <div className={style.wrapper}>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
}
