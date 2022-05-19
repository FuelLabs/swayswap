import type { SpinnerCircularProps } from "spinners-react/lib/esm/SpinnerCircular";
import { SpinnerCircular } from "spinners-react/lib/esm/SpinnerCircular";

export function Spinner(props: SpinnerCircularProps) {
  return <SpinnerCircular {...props} />;
}

Spinner.defaultProps = {
  size: 22,
  color: "#2aac98",
  secondaryColor: "#134034",
  thickness: 250,
  speed: 150,
};
