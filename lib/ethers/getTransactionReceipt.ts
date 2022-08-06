import type { providers } from "ethers";

import type { Transaction, TransactionReceipt } from "../types";

export function getTransactionReceipt(
  provider: providers.Provider
): (transaction: Transaction) => Promise<TransactionReceipt | undefined> {
  return (transaction) => {
    return provider.getTransactionReceipt(transaction.hash).then((receipt) => {
      if (receipt === null) {
        return undefined;
      }

      return {
        from: receipt.from,
        to: receipt.to,
        contractAddress: receipt.contractAddress,
        transactionIndex: receipt.transactionIndex,
        transactionHash: receipt.transactionHash,
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        hadSuccess: receipt.status === 1,
      };
    });
  };
}
