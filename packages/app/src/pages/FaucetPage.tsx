import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { FaFaucet } from "react-icons/fa";
import { useMutation } from "react-query";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { FUEL_FAUCET_URL, RECAPTCHA_SITE_KEY } from "~/config";
import { useWallet } from "~/context/AppContext";
import { sleep } from "~/lib/utils";

export default function FaucetPage() {
  const wallet = useWallet()!;
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const faucetMutation = useMutation(
    async () => {
      const response = await fetch(FUEL_FAUCET_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: wallet!.address,
          captcha: recaptchaToken ?? "",
        }),
      }).then((r) => r.json());
      if (response.status !== "Success") {
        throw new Error(`Invalid faucet response: ${JSON.stringify(response)}`);
      }
      await sleep(1000);
    },
    {
      onSuccess: () => {
        // Navigate to assets page to show new cons
        // https://github.com/FuelLabs/swayswap-demo/issues/40
        toast.success("Faucet added successfully!");
      },
    }
  );

  return (
    <Card>
      <Card.Title>
        <FaFaucet className="text-primary-500" />
        Faucet
      </Card.Title>
      <div className="my-6 flex items-center justify-center">
        <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} />
      </div>
      <Button
        isFull
        size="lg"
        variant="primary"
        isLoading={faucetMutation.isLoading}
        onPress={() => !faucetMutation.isLoading && faucetMutation.mutate()}
      >
        Faucet tokens
      </Button>
    </Card>
  );
}
