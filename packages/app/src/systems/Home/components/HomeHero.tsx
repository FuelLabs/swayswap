import { useNavigate } from "react-router-dom";

import { Button, Link } from "~/systems/UI";
import { Pages } from "~/types";

export function HomeHero() {
  const navigate = useNavigate();
  return (
    <div className="homePage--hero">
      <h1>
        SwaySwap is the first ever DEX built on a modular execution layer: Fuel.
      </h1>
      <p>
        Built with an entirely new language{" "}
        <Link isExternal href="https://fuellabs.github.io/sway/latest/">
          Sway
        </Link>
        , virtual machine{" "}
        <Link isExternal href="https://github.com/FuelLabs/fuel-vm">
          FuelVM
        </Link>
        , and UTXO-based blockchain{" "}
        <Link isExternal href="https://github.com/FuelLabs/fuel-core">
          Fuel
        </Link>
        , you can now experience a demonstration of the next generation of
        scaling beyond layer-2s and monolithic design.
      </p>
      <Button size="lg" variant="primary" onPress={() => navigate(Pages.swap)}>
        Launch app
      </Button>
    </div>
  );
}
