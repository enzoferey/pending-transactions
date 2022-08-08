import React from "react";

import { matchIsDocumentVisible } from "../utils/matchIsDocumentVisible";

export function useIsWindowActive(): boolean {
  const [isWindowActive, setIsWindowActive] = React.useState<boolean>(true);

  React.useEffect(() => {
    const updateIsWindowActive = () => {
      setIsWindowActive(matchIsDocumentVisible(document));
    };

    window.addEventListener("visibilitychange", updateIsWindowActive);
    window.addEventListener("focus", updateIsWindowActive);

    return () => {
      window.removeEventListener("visibilitychange", updateIsWindowActive);
      window.removeEventListener("focus", updateIsWindowActive);
    };
  }, []);

  return isWindowActive;
}
