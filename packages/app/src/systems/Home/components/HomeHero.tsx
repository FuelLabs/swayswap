import { useNavigate } from "react-router-dom";

import { Button, Link } from "~/systems/UI";
import { Pages } from "~/types";

export function HomeHero() {
  const navigate = useNavigate();
  return (
    <div className="homePage--hero">
      <h1>
        SwaySwap is a blazingly fast DEX built on the fastest modular execution
        layer: Fuel.
      </h1>
      <p>
        Built with an entirely new language{" "}
        <Link isExternal href="https://github.com/FuelLabs/sway">
          [Sway]
        </Link>
        , virtual machine{" "}
        <Link isExternal href="https://github.com/FuelLabs/fuel-vm">
          [FuelVM]
        </Link>
        , and UTXO-based smart contract blockchain{" "}
        <Link isExternal href="https://github.com/FuelLabs/fuel-core">
          [Fuel]
        </Link>
        , you can now experience a demonstration of the next generation of
        scaling beyond layer-2s and monolithic blockchain design.
        #BeyondMonolithic
      </p>
      <p className="text-sm font-light italic">
        This is running on the Fuel test network. No real funds are used.
        Demonstration purposes only.
      </p>
      <Button size="lg" variant="primary" onPress={() => navigate(Pages.swap)}>
        Launch app
      </Button>
    </div>
  );
}
