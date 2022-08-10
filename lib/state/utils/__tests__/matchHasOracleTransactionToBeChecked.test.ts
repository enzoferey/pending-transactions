import { describe, expect, it } from "vitest";
import {
  MOCK_ORACLE_TRANSACTION,
  MOCK_TRANSACTION_RECEIPT,
} from "../../../test-utils";
import { OracleTransaction } from "../../../types";

import { matchHasOracleTransactionToBeChecked } from "../matchHasOracleTransactionToBeChecked";

describe("matchHasOracleTransactionToBeChecked", () => {
  it("should return true if the transaction has not been checked for the given block, the transaction is confirmed and the oracle transaction is pending", () => {
    const blockNumber = 10;

    const transaction: OracleTransaction = {
      ...MOCK_ORACLE_TRANSACTION,
      lastCheckedBlockNumber: blockNumber - 1,
      receipt: MOCK_TRANSACTION_RECEIPT,
      confirmedTime: blockNumber - 2,
      oracleReceipt: undefined,
      oracleConfirmedTime: undefined,
    };

    const result = matchHasOracleTransactionToBeChecked(
      transaction,
      blockNumber
    );

    expect(result).toBe(true);
  });
  it("should return false if the transaction has already been checked for the given block", () => {
    const blockNumber = 10;

    const transaction: OracleTransaction = {
      ...MOCK_ORACLE_TRANSACTION,
      lastCheckedBlockNumber: blockNumber,
      receipt: MOCK_TRANSACTION_RECEIPT,
      confirmedTime: blockNumber - 2,
      oracleReceipt: undefined,
      oracleConfirmedTime: undefined,
    };

    const result = matchHasOracleTransactionToBeChecked(
      transaction,
      blockNumber
    );

    expect(result).toBe(false);
  });
  it("should return false if the transaction was checked for a later block", () => {
    const blockNumber = 10;

    const transaction: OracleTransaction = {
      ...MOCK_ORACLE_TRANSACTION,
      lastCheckedBlockNumber: blockNumber + 1,
      receipt: MOCK_TRANSACTION_RECEIPT,
      confirmedTime: blockNumber - 2,
      oracleReceipt: undefined,
      oracleConfirmedTime: undefined,
    };

    const result = matchHasOracleTransactionToBeChecked(
      transaction,
      blockNumber
    );

    expect(result).toBe(false);
  });
  it("should return false if the transaction is not confirmed yet", () => {
    const blockNumber = 10;

    const transaction: OracleTransaction = {
      ...MOCK_ORACLE_TRANSACTION,
      lastCheckedBlockNumber: blockNumber - 1,
      receipt: undefined,
      confirmedTime: undefined,
      oracleReceipt: undefined,
      oracleConfirmedTime: undefined,
    };

    const result = matchHasOracleTransactionToBeChecked(
      transaction,
      blockNumber
    );

    expect(result).toBe(false);
  });
  it("should return false if the oracle transaction is already confirmed", () => {
    const blockNumber = 10;

    const transaction: OracleTransaction = {
      ...MOCK_ORACLE_TRANSACTION,
      lastCheckedBlockNumber: blockNumber - 1,
      receipt: MOCK_TRANSACTION_RECEIPT,
      confirmedTime: blockNumber - 2,
      oracleReceipt: MOCK_TRANSACTION_RECEIPT,
      oracleConfirmedTime: blockNumber - 1,
    };

    const result = matchHasOracleTransactionToBeChecked(
      transaction,
      blockNumber
    );

    expect(result).toBe(false);
  });
});
