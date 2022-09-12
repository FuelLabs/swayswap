import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { MdSwapCalls } from "react-icons/md";

import { PricePerToken, SwapPreview } from "../components";
import { SwapWidget } from "../components/SwapWidget";
import { useSwap } from "../hooks/useSwap";
import { useSwapButton } from "../hooks/useSwapButton";
import { useSwapCoinInput } from "../hooks/useSwapCoinInput";
import { useSwapPreview } from "../hooks/useSwapPreview";
import { FROM_TO, TO_FROM } from "../machines/swapMachine";

import { MainLayout } from "~/systems/Core";
import { Button, Card } from "~/systems/UI";

export function SwapPage() {
  const button = useSwapButton();
  const preview = useSwapPreview();
  const { state } = useSwap();
  const { value: fromValue } = useSwapCoinInput(FROM_TO);
  const { value: toValue } = useSwapCoinInput(TO_FROM);

  const shouldShowPreview = useMemo(() => {
    return (state.isLoading || preview.hasPreview) && (fromValue || toValue);
  }, [fromValue, toValue, state.isLoading, preview.hasPreview]);

  return (
    <MainLayout>
      <Card>
        <Card.Title>
          <MdSwapCalls className="text-primary-500" />
          Swap
        </Card.Title>
        <SwapWidget />
        <AnimatePresence>
          {shouldShowPreview && (
            <motion.div
              transition={{ duration: 0.4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SwapPreview />
              <PricePerToken />
            </motion.div>
          )}
        </AnimatePresence>
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
