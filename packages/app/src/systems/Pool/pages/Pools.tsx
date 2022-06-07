import cx from "classnames";
import { BiListUl, BiDollarCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import { PoolCurrentPosition } from "../components";
import { usePoolInfo, useUserPositions } from "../hooks";

import { TokenIcon, useCoinMetadata } from "~/systems/Core";
import { Accordion, Button, Card, Spinner } from "~/systems/UI";
import { Pages } from "~/types";

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
        aria-label="header-add-liquidity-btn"
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
      You do not have any open positions
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

export function Pools() {
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
