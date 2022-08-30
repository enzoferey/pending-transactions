import { describe, expect, it } from "vitest";

import { MOCK_ORACLE_TRANSACTION, MOCK_TRANSACTION } from "../../../test-utils";

import type { TransactionsState } from "../../../types";

import type { StorageService } from "../../types";

import { getTransactionsStateFromStorageService } from "../getTransactionsStateFromStorageService";

describe("getTransactionsStateFromStorageService", () => {
  it("return the transactions state from the storage service", () => {
    const transactionsState: TransactionsState = {
      1: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
      2: {
        [MOCK_ORACLE_TRANSACTION.hash]: MOCK_ORACLE_TRANSACTION,
      },
    };

    const storageService = {
      getItem: () => {
        return JSON.stringify(transactionsState);
      },
    } as unknown as StorageService;

    const result = getTransactionsStateFromStorageService(
      "some-storage-key",
      storageService
    );

    expect(result).toEqual(transactionsState);
  });
  it("return an empty object when the item is not set", () => {
    const storageService = {
      getItem: () => {
        return null;
      },
    } as unknown as StorageService;

    const result = getTransactionsStateFromStorageService(
      "some-storage-key",
      storageService
    );

    expect(result).toEqual({});
  });
  it("return an empty object when the transaction state cannot be parsed", () => {
    const storageService = {
      getItem: () => {
        return undefined; // `undefined` makes JSON.parse throw
      },
    } as unknown as StorageService;

    const result = getTransactionsStateFromStorageService(
      "some-storage-key",
      storageService
    );

    expect(result).toEqual({});
  });
});
