import cx from "classnames";
import { BiDollarCircle, BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from "react-router-dom";

import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { Card } from "~/components/Card";

const style = {
  button: `relative text-sm font-semibold border-transparent px-0`,
  active: `text-gray-200 after:content-[''] after:w-full after:h-0.5 after:bg-primary-500
  after:top-0 after:left-0 after:absolute after:translate-y-[-12px] after:rounded-full`,
};

const SubpagesNav = () => {
  const location = useLocation();
  const path = useResolvedPath(location);
  const navigate = useNavigate();
  const isAddActive = path.pathname.includes("pool/add");
  const isRemoveActive = path.pathname.includes("pool/remove");

  return (
    <div className="flex items-center gap-4">
      <ButtonGroup>
        <Button
          size="sm"
          onPress={() => navigate("add-liquidity")}
          className={cx(style.button, { [style.active]: isAddActive })}
        >
          <BiPlusCircle
            className={cx({
              "text-gray-500": !isAddActive,
              "text-primary-500": isAddActive,
            })}
          />
          Add Liquidity
        </Button>
        <Button
          size="sm"
          onPress={() => navigate("remove-liquidity")}
          className={cx(style.button, { [style.active]: isRemoveActive })}
        >
          <BiMinusCircle
            className={cx({
              "text-gray-500": !isRemoveActive,
              "text-primary-500": isRemoveActive,
            })}
          />
          Remove Liquidity
        </Button>
      </ButtonGroup>
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
