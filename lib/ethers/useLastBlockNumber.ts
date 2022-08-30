import React from "react";
import type { providers } from "ethers";

import { useIsWindowActive } from "../hooks/useIsWindowActive";
import { useIsOnline } from "../hooks/useIsOnline";

export function useLastBlockNumber(
  provider: providers.Provider | undefined
): number {
  const [lastBlockNumber, setLastBlockNumber] = React.useState<number>(0);

  const isWindowActive = useIsWindowActive();
  const isOnline = useIsOnline();

  React.useEffect(() => {
    if (
      provider === undefined ||
      isWindowActive === false ||
      isOnline === false
    ) {
      return;
    }

    provider.on("block", setLastBlockNumber);

    return () => {
      provider.off("block", setLastBlockNumber);
    };
  }, [provider, isWindowActive, isOnline]);

  return lastBlockNumber;
}
