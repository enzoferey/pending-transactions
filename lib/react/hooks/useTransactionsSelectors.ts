import React from "react";

import type {
  BaseTransactionInfo,
  ChainTransactionsState,
  Transaction,
  TransactionsState,
} from "../../types";

import * as selectors from "../../state/selectors";

interface Options<TransactionInfo extends BaseTransactionInfo> {
  state: TransactionsState<TransactionInfo>;
  chainId: number;
}

type GetAllChainTransactions<TransactionInfo extends BaseTransactionInfo> =
  () => ChainTransactionsState<TransactionInfo>;

type GetChainTransaction<TransactionInfo extends BaseTransactionInfo> = (
  transactionHash: string
) => Transaction<TransactionInfo> | undefined;

interface ReturnValue<TransactionInfo extends BaseTransactionInfo> {
  getAllChainTransactions: GetAllChainTransactions<TransactionInfo>;
  getChainTransaction: GetChainTransaction<TransactionInfo>;
}

export function useTransactionsSelectors<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options<TransactionInfo>): ReturnValue<TransactionInfo> {
  const { state, chainId } = options;

  const getAllChainTransactions = React.useCallback<
    GetAllChainTransactions<TransactionInfo>
  >(() => {
    return selectors.getAllChainTransactions(state, chainId);
  }, [state, chainId]);

  const getChainTransaction = React.useCallback<
    GetChainTransaction<TransactionInfo>
  >(
    (transactionHash) => {
      return selectors.getChainTransaction(state, chainId, transactionHash);
    },
    [state, chainId]
  );

  const value = React.useMemo<ReturnValue<TransactionInfo>>(() => {
    return {
      getAllChainTransactions,
      getChainTransaction,
    };
  }, [getAllChainTransactions, getChainTransaction]);

  return value;
}
