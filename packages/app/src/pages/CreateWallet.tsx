import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { useAppContext } from "~/context/AppContext";
import { Pages } from "~/types/pages";

export default function CreateWallet() {
  const { createWallet } = useAppContext();
  const navigate = useNavigate();

  const createWalletMutation = useMutation(async () => createWallet(), {
    onSuccess: () => {
      toast.success("Wallet created successfully!");
      navigate(Pages.swap);
    },
  });

  function handleCreateWallet() {
    createWalletMutation.mutate();
  }

  return (
    <Card>
      <div className="flex flex-col justify-center text-gray-400 prose text-center">
        <h3 className="text-gray-300 mb-0">⚡️ Welcome SwaySwap</h3>
        <p>
          <p>
            Seems like you don&apos;t have any wallet yet.
            <br /> Click below to generate one.
          </p>
        </p>
        <div>
          <Button variant="primary" size="lg" onPress={handleCreateWallet}>
            Create Wallet
          </Button>
        </div>
      </div>
    </Card>
  );
}
