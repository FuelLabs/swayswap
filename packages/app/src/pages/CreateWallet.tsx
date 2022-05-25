import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { useCreateWallet } from "~/hooks/useCreateWallet";

export default function CreateWallet() {
  const createWallet = useCreateWallet();

  return (
    <Card>
      <div className="flex flex-col justify-center text-gray-400 prose text-center">
        <h3 className="text-gray-300 mb-0">⚡️ Welcome SwaySwap</h3>
        <p>
          Seems like you don&apos;t have any wallet yet.
          <br /> Click below to generate one.
        </p>
        <div>
          <Button
            variant="primary"
            size="lg"
            onPress={() => createWallet.mutate()}
          >
            Create Wallet
          </Button>
        </div>
      </div>
    </Card>
  );
}
