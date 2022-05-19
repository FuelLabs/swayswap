import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { FUEL_FAUCET_URL, RECAPTCHA_SITE_KEY } from "~/config";
import { useWallet } from "~/context/AppContext";
import { sleep } from "~/lib/utils";
import { Pages } from "~/types/pages";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-gray-800 w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl mb-8`,
  confirmButton: `bg-primary-500 my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-primary-500 hover:border-primary-600 mt-8`,
};

export default function FaucetPage() {
  const wallet = useWallet()!;
  const navigate = useNavigate();
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
        navigate(Pages.wallet);
        toast.success("Faucet added successfully!");
      },
    }
  );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Faucet tokens</h1>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={setRecaptchaToken}
          />
        </div>
        <div
          onClick={() => !faucetMutation.isLoading && faucetMutation.mutate()}
          className={style.confirmButton}
        >
          {!faucetMutation.isLoading ? `Faucet tokens` : `Fauceting tokens...`}
        </div>
      </div>
    </div>
  );
}
