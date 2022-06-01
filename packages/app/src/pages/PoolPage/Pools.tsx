import cx from "classnames";
import { BiListUl, BiDollarCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import { PoolCurrentPosition } from "./PoolCurrentPosition";

import { Accordion } from "~/components/Accordion";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Spinner } from "~/components/Spinner";
import { TokenIcon } from "~/components/TokenIcon";
import { useCoinMetadata } from "~/hooks/useCoinMetadata";
import { usePoolInfo } from "~/hooks/usePoolInfo";
import { useUserPositions } from "~/hooks/useUserPositions";
import { Pages } from "~/types/pages";

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
        onPress={() => navigate(`../${Pages["pool.addLiquidity"]}`)}
        className={cx(style.button)}
      >
        Add Liquidity
      </Button>
    </div>
  );
};

function WithoutPositions() {
  return (
    <p className="flex items-center gap-2 text-gray-300">
      <BiListUl />
      You may have no open positions
    </p>
  );
}

function PositionItem() {
  const navigate = useNavigate();
  const { coinMetaData } = useCoinMetadata({ symbol: "ETH/DAI" });
  const coinFrom = coinMetaData?.pairOf?.[0];
  const coinTo = coinMetaData?.pairOf?.[1];

  return (
    <Accordion.Item value="item-1">
      <Accordion.Trigger>
        <div className="flex items-center">
          <TokenIcon coinFrom={coinFrom} coinTo={coinTo} />
          <div className="ml-2">ETH/DAI</div>
        </div>
      </Accordion.Trigger>
      <Accordion.Content>
        <PoolCurrentPosition />
        <div className="flex items-center justify-between gap-2 mt-3">
          <Button
            variant="base"
            isFull
            onPress={() => navigate(`../${Pages["pool.addLiquidity"]}`)}
          >
            Add liquidity
          </Button>
          <Button
            variant="base"
            isFull
            onPress={() => navigate(`../${Pages["pool.removeLiquidity"]}`)}
          >
            Remove liquidity
          </Button>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function Pools() {
  const { isLoading } = usePoolInfo();
  const { hasPositions } = useUserPositions();

  return (
    <Card>
      <Card.Title elementRight={<SubpagesNav />}>
        <BiDollarCircle className="text-primary-500" />
        Pool
      </Card.Title>
      <h3 className="pb-1 mb-3 mt-5 text-gray-100 border-b border-dashed border-gray-600">
        Your liquidity positions
      </h3>
      {isLoading && <Spinner />}
      {Boolean(!isLoading && !hasPositions) && <WithoutPositions />}
      {Boolean(!isLoading && hasPositions) && (
        <Accordion type="single" defaultValue="item-1" collapsible>
          <PositionItem />
        </Accordion>
      )}
    </Card>
  );
}
