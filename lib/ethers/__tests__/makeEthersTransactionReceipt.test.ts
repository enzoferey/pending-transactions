import { describe, expect, it } from "vitest";

import type { providers } from "ethers";

import {
  MOCK_ADDRESS_1,
  MOCK_ADDRESS_2,
  MOCK_BLOCK_HASH_1,
  MOCK_TRANSACTION,
  MOCK_TRANSACTION_HASH_1,
} from "../../test-utils";

import { makeEthersTransactionReceipt } from "../makeEthersTransactionReceipt";

describe("makeEthersTransactionReceipt", () => {
  it("should return a function that enables querying the transaction receipt for a successful given transaction", async () => {
    const receipt = {
      from: MOCK_ADDRESS_1,
      to: MOCK_ADDRESS_2,
      contractAddress: MOCK_ADDRESS_2,
      transactionIndex: 1,
      transactionHash: MOCK_TRANSACTION_HASH_1,
      blockHash: MOCK_BLOCK_HASH_1,
      blockNumber: 0,
      status: 1,
    };

    const provider = {
      makeEthersTransactionReceipt: () => {
        return new Promise((resolve) => {
          resolve(receipt);
        });
      },
    } as unknown as providers.Provider;

    const result = await makeEthersTransactionReceipt(provider)(
      MOCK_TRANSACTION
    );

    expect(result).toEqual({
      from: receipt.from,
      to: receipt.to,
      contractAddress: receipt.contractAddress,
      transactionIndex: receipt.transactionIndex,
      transactionHash: receipt.transactionHash,
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
      hadSuccess: true,
    });
  });
  it("should return a function that enables querying the transaction receipt for a failed given transaction", async () => {
    const receipt = {
      from: MOCK_ADDRESS_1,
      to: MOCK_ADDRESS_2,
      contractAddress: MOCK_ADDRESS_2,
      transactionIndex: 1,
      transactionHash: MOCK_TRANSACTION_HASH_1,
      blockHash: MOCK_BLOCK_HASH_1,
      blockNumber: 0,
      status: 0,
    };

    const provider = {
      makeEthersTransactionReceipt: () => {
        return new Promise((resolve) => {
          resolve(receipt);
        });
      },
    } as unknown as providers.Provider;

    const result = await makeEthersTransactionReceipt(provider)(
      MOCK_TRANSACTION
    );

    expect(result).toEqual({
      from: receipt.from,
      to: receipt.to,
      contractAddress: receipt.contractAddress,
      transactionIndex: receipt.transactionIndex,
      transactionHash: receipt.transactionHash,
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
      hadSuccess: false,
    });
  });
  it("should return undefined if the transaction has not been executed yet", async () => {
    const provider = {
      makeEthersTransactionReceipt: () => {
        return new Promise((resolve) => {
          resolve(null);
        });
      },
    } as unknown as providers.Provider;

    const result = await makeEthersTransactionReceipt(provider)(
      MOCK_TRANSACTION
    );

    expect(result).toBe(undefined);
  });
});
