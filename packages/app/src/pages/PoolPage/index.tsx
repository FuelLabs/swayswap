import { BiDollarCircle } from "react-icons/bi";
import { Outlet } from "react-router-dom";

import { Card } from "~/components/Card";

export default function PoolPage() {
  return (
    <Card>
      <Card.Title>
        <BiDollarCircle className="text-primary-500" />
        Pool
      </Card.Title>
      <Outlet />
    </Card>
  );
}
