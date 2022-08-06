import React from "react";

import type { TransactionsState } from "../../types";

import * as matchers from "../../state/matchers";

interface Options {
  state: TransactionsState;
  chainId: number;
}

export type MatchIsTransactionPending = (transactionHash: string) => boolean;

export type MatchIsTransactionConfirmed = (transactionHash: string) => boolean;

interface ReturnValue {
  matchIsTransactionPending: MatchIsTransactionPending;
  matchIsTransactionConfirmed: MatchIsTransactionConfirmed;
}

export function useTransactionsMatchers(options: Options): ReturnValue {
  const { state, chainId } = options;

  const matchIsTransactionPending =
    React.useCallback<MatchIsTransactionPending>(
      (transactionHash) => {
        return matchers.matchIsTransactionPending(
          state,
          chainId,
          transactionHash
        );
      },
      [state, chainId]
    );

  const matchIsTransactionConfirmed =
    React.useCallback<MatchIsTransactionConfirmed>(
      (transactionHash) => {
        return matchers.matchIsTransactionConfirmed(
          state,
          chainId,
          transactionHash
        );
      },
      [state, chainId]
    );

  const value = React.useMemo<ReturnValue>(() => {
    return {
      matchIsTransactionPending,
      matchIsTransactionConfirmed,
    };
  }, [matchIsTransactionPending, matchIsTransactionConfirmed]);

  return value;
}
