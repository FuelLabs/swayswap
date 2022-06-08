import { routes } from "./routes";

import { Providers } from "~/systems/Core";

type AppProps = {
  justContent?: boolean;
};
export function App({ justContent = false }: AppProps) {
  return <Providers justContent={justContent}>{routes}</Providers>;
}
