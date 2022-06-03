import type { SpinnerCircularProps } from "spinners-react/lib/cjs/SpinnerCircular";
import { SpinnerCircular } from "spinners-react/lib/cjs/SpinnerCircular";

const VARIANTS = {
  base: {
    color: "rgba(255,255,255,0.7)",
    secondaryColor: "rgba(255,255,255,0.2)",
  },
  primary: {
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
  variant: "primary",
};
