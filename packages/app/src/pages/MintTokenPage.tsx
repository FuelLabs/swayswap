import { parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiCoin } from "react-icons/bi";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { NumberInput } from "~/components/NumberInput";
import { PageContent } from "~/components/PageContent";
import { DECIMAL_UNITS, TOKEN_ID } from "~/config";
import { useTokenMethods } from "~/hooks/useTokensMethods";
import { sleep } from "~/lib/utils";
import { Pages } from "~/types/pages";

export default function MintTokenPage() {
  const [asset, setAsset] = useState(TOKEN_ID);
  const methods = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("2000");

  const mintMutation = useMutation(
    async () => {
      const mintAmount = parseUnits(amount, DECIMAL_UNITS).toBigInt();
      await methods.mint(mintAmount);
      await methods.transferTo(mintAmount, { variableOutputs: 1 });
      await sleep(1000);
    },
    {
      onSuccess: () => {
        // Navigate to assets page to show new cons
        // https://github.com/FuelLabs/swayswap-demo/issues/40
        toast.success(`Token minted successfully!`);
        navigate(Pages.wallet);
      },
    }
  );

  return (
    <PageContent>
      <PageContent.Title>
        <BiCoin className="text-primary-500" />
        Mint
      </PageContent.Title>
      <div className="mb-4">
        <div className="flex gap-4 items-center">
          {/* TODO: Add validation of contract id, querying from the the core */}
          {/* TODO: Add validation to match a valid address */}
          {/* https://github.com/FuelLabs/swayswap-demo/issues/41 */}
          <div>
            <label className="mx-1 mb-2 flex text-gray-300">
              Paste token contractId
            </label>
            <Input
              value={asset}
              placeholder="Type contract id"
              onChange={setAsset}
            />
          </div>
          <div>
            <label className="mx-1 mb-2 flex text-gray-300">
              Amount to mint
            </label>
            <NumberInput className="px-2" value={amount} onChange={setAmount} />
          </div>
        </div>
      </div>
      <Button
        isFull
        size="lg"
        variant="primary"
        isDisabled={!amount || parseInt(amount, 2) <= 0}
        isLoading={mintMutation.isLoading}
        onPress={() => !mintMutation.isLoading && mintMutation.mutate()}
      >
        Mint
      </Button>
    </PageContent>
  );
}