import React from "react";

import type { ChainId, TransactionsState } from "../../types";

import * as matchers from "../../state/matchers";

interface Options {
  state: TransactionsState;
  chainId: ChainId;
}

export type MatchIsTransactionPending = (transactionHash: string) => boolean;

export type MatchIsTransactionConfirmed = (transactionHash: string) => boolean;

export type MatchIsOracleTransactionPending = (
  transactionHash: string
) => boolean;

export type MatchIsOracleTransactionConfirmed = (
  transactionHash: string
) => boolean;

interface ReturnValue {
  matchIsTransactionPending: MatchIsTransactionPending;
  matchIsTransactionConfirmed: MatchIsTransactionConfirmed;
  matchIsOracleTransactionPending: MatchIsOracleTransactionPending;
  matchIsOracleTransactionConfirmed: MatchIsOracleTransactionConfirmed;
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

  const matchIsOracleTransactionPending =
    React.useCallback<MatchIsOracleTransactionConfirmed>(
      (transactionHash) => {
        return matchers.matchIsOracleTransactionPending(
          state,
          chainId,
          transactionHash
        );
      },
      [state, chainId]
    );

  const matchIsOracleTransactionConfirmed =
    React.useCallback<MatchIsOracleTransactionConfirmed>(
      (transactionHash) => {
        return matchers.matchIsOracleTransactionConfirmed(
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
      matchIsOracleTransactionPending,
      matchIsOracleTransactionConfirmed,
    };
  }, [
    matchIsTransactionPending,
    matchIsTransactionConfirmed,
    matchIsOracleTransactionPending,
    matchIsOracleTransactionConfirmed,
  ]);

  return value;
}
