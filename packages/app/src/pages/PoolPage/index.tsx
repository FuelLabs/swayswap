import cx from "classnames";
import { BiDollarCircle } from "react-icons/bi";
import { Outlet, useNavigate } from "react-router-dom";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";

const style = {
  button: `relative font-semibold text-xs`,
};

const SubpagesNav = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button
        size="sm"
        variant="primary"
        onPress={() => navigate("add-liquidity")}
        className={cx(style.button)}
      >
        Add Liquidity
      </Button>
    </div>
  );
};

export default function PoolPage() {
  return (
    <Card>
      <Card.Title elementRight={<SubpagesNav />}>
        <BiDollarCircle className="text-primary-500" />
        Pool
      </Card.Title>
      <Outlet />
    </Card>
  );
}
