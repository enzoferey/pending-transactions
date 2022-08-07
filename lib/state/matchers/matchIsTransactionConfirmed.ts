import type { TransactionsState } from "../../types";

import * as selectors from "../selectors";
import * as utils from "../utils";

export function matchIsTransactionConfirmed(
  transactionsState: TransactionsState,
  chainId: number,
  transactionHash: string
): boolean {
  const transaction = selectors.getChainTransaction(
    transactionsState,
    chainId,
    transactionHash
  );

  if (transaction === undefined) {
    return false;
  }

  return utils.matchIsTransactionConfirmed(transaction);
}
