import { Link } from "~/systems/UI";

export function HomeHero() {
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
    </div>
  );
}
