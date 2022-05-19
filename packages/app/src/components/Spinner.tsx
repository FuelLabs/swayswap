import type { SpinnerCircularProps } from "spinners-react/lib/esm/SpinnerCircular";
import { SpinnerCircular } from "spinners-react/lib/esm/SpinnerCircular";

const VARIANTS = {
  base: {
    color: "rgba(255,255,255,0.7)",
    secondaryColor: "rgba(255,255,255,0.2)",
  },
  primar: {
    color: "#2aac98",
    secondaryColor: "#134034",
  },
};

export type SpinnerProps = SpinnerCircularProps & {
  variant?: "primary" | "base";
};

export function Spinner({ variant = "primary", ...props }: SpinnerProps) {
  return <SpinnerCircular {...props} {...VARIANTS[variant]} />;
}

Spinner.defaultProps = {
  size: 22,
  thickness: 250,
  speed: 150,
};
