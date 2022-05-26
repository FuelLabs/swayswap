import cx from "classnames";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { BiCoin } from "react-icons/bi";
import { FaFaucet } from "react-icons/fa";

import { Button } from "./Button";
import { Card } from "./Card";
import { Dialog, useDialog } from "./Dialog";
import { Input } from "./Input";
import { NumberInput } from "./NumberInput";

import { MINT_AMOUNT, RECAPTCHA_SITE_KEY, TOKEN_ID } from "~/config";
import { useFaucet } from "~/hooks/useFaucet";
import { useMint } from "~/hooks/useMint";

export function FaucetWidget() {
  const dialog = useDialog();
  const [mintTokenID, setMintTokenID] = useState(TOKEN_ID);
  const [mintAmount, setMintAmount] = useState<string>(`${MINT_AMOUNT}`);
  const [showing, setShowing] = useState("faucet");
  const [faucetCaptcha, setFaucetCaptcha] = useState<string | null>(null);

  const faucet = useFaucet({
    onSuccess: () => dialog.close(),
  });

  const mint = useMint({
    tokenId: mintTokenID,
    onSuccess: () => dialog.close(),
  });

  const faucetContent = (
    <>
      <div>Click the button below to mint 0.5 ETH to your wallet.</div>
      <div className="mt-4 mx-6 flex items-center justify-center">
        <ReCAPTCHA
          theme="dark"
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={setFaucetCaptcha}
        />
      </div>
      <Button
        size="md"
        variant="primary"
        isFull
        className="mt-5"
        isDisabled={!faucetCaptcha}
        isLoading={faucet.isLoading}
        onPress={() => faucet.handleFaucet(faucetCaptcha)}
      >
        Give me ETH
      </Button>
    </>
  );

  const mintContent = (
    <>
      <div>
        Mint new token types for testing purposes by adding the contract Id and
        amount below.
      </div>
      <div className="faucetWidget--formRow">
        <label className="faucetWidget--label">Contract Id</label>
        <Input
          isReadOnly
          value={mintTokenID}
          placeholder="Type contract id"
          onChange={setMintTokenID}
        />
      </div>
      <div className="faucetWidget--formRow">
        <label className="faucetWidget--label">Amount to mint</label>
        <NumberInput
          className="px-2"
          value={mintAmount}
          onChange={setMintAmount}
          isAllowed={(values) => (values.floatValue || 0) <= MINT_AMOUNT}
        />
      </div>
      <Button
        size="md"
        variant="primary"
        isFull
        className="mt-4"
        isLoading={mint.isLoading}
        onPress={() => mint.handleMint(mintAmount)}
      >
        Mint tokens
      </Button>
    </>
  );

  return (
    <div className="faucetWidget">
      <Button size="md" {...dialog.openButtonProps}>
        <FaFaucet />
        Faucet & Mint
      </Button>
      <Dialog {...dialog.dialogProps}>
        <Dialog.Content className="faucetWidget--dialog">
          <Card>
            <Card.Title>
              <Button
                size="lg"
                onPress={() => setShowing("faucet")}
                className={cx("faucetWidget--tabBtn", {
                  active: showing === "faucet",
                })}
              >
                <FaFaucet size={16} /> Faucet
              </Button>
              <Button
                size="lg"
                onPress={() => setShowing("mint")}
                className={cx("faucetWidget--tabBtn", {
                  active: showing === "mint",
                })}
              >
                <BiCoin size={16} /> Mint
              </Button>
            </Card.Title>
            {showing === "faucet" ? faucetContent : mintContent}
          </Card>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
