import { Alert } from "@fuel-ui/react";
import { useState } from "react";

import { LocalStorageKey } from "../utils";

const LOCALSTORAGE_MIGRATION_WARNING = `${LocalStorageKey}fuel--migration-warning`;

const useMigrationWarning = () => {
  const [hide, setToHide] = useState(
    localStorage.getItem(LOCALSTORAGE_MIGRATION_WARNING)
  );

  const handleHide = () => {
    localStorage.setItem(LOCALSTORAGE_MIGRATION_WARNING, "dismiss");
    setToHide("dismiss");
  };

  return {
    onPress: handleHide,
    hide: !!hide,
  };
};

export const MigrationWarning = () => {
  const { hide, onPress } = useMigrationWarning();

  if (hide) return null;

  return (
    <Alert status="warning" direction="row">
      <Alert.Description>
        SwaySwap is now on Fuel testnet beta-3! This network does not contain
        previous transactions or balances.
      </Alert.Description>
      <Alert.Actions>
        <Alert.Button onPress={onPress}>Dismiss</Alert.Button>
      </Alert.Actions>
    </Alert>
  );
};
