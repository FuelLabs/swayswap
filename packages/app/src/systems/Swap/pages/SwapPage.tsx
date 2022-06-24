import { MdSwapCalls } from "react-icons/md";

import { PricePerToken, SwapPreview } from "../components";
import { SwapWidget } from "../components/SwapWidget";
import { useSwapButton } from "../hooks/useSwapButton";
import { useSwapPreview } from "../hooks/useSwapPreview";

import { MainLayout } from "~/systems/Core";
import { Button, Card } from "~/systems/UI";

export function SwapPage() {
  const button = useSwapButton();
  const preview = useSwapPreview();

  return (
    <MainLayout>
      <Card>
        <Card.Title>
          <MdSwapCalls className="text-primary-500" />
          Swap
        </Card.Title>
        <SwapWidget />
        {preview.hasPreview && <SwapPreview />}
        {preview.hasPreview && <PricePerToken />}
        <Button
          {...button.props}
          isFull
          size="lg"
          variant="primary"
          aria-label="Swap button"
        >
          {button.text}
        </Button>
      </Card>
    </MainLayout>
  );
}
