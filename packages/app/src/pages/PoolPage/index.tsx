import { FocusScope, useFocusManager } from "@react-aria/focus";
import cx from "classnames";
import { BiDollarCircle, BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from "react-router-dom";

import { Button } from "~/components/Button";
import { PageContent } from "~/components/PageContent";

const style = {
  button: `relative text-sm font-semibold border-transparent px-0`,
  active: `text-gray-200 after:content-[''] after:w-full after:h-0.5 after:bg-primary-500
  after:top-0 after:left-0 after:absolute after:translate-y-[-12px] after:rounded-full`,
};

const SubpagesNav = () => {
  const focusManager = useFocusManager();
  const onKeyDown = (e: any) => {
    // eslint-disable-next-line default-case
    switch (e.key) {
      case "ArrowRight":
        focusManager.focusNext({ wrap: true });
        break;
      case "ArrowLeft":
        focusManager.focusPrevious({ wrap: true });
        break;
    }
  };

  const location = useLocation();
  const path = useResolvedPath(location);
  const navigate = useNavigate();
  const isAddActive = path.pathname.includes("pool/add");
  const isRemoveActive = path.pathname.includes("pool/remove");

  return (
    <div className="flex items-center gap-4">
      <Button
        onKeyDown={onKeyDown}
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
        onKeyDown={onKeyDown}
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
    </div>
  );
};

export default function PoolPage() {
  const elementRight = (
    <FocusScope>
      <SubpagesNav />
    </FocusScope>
  );
  return (
    <PageContent>
      <PageContent.Title elementRight={elementRight}>
        <BiDollarCircle className="text-primary-500" />
        Pool
      </PageContent.Title>
      <Outlet />
    </PageContent>
  );
}
