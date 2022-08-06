import { Transaction, TransactionReceipt } from "../types";

export const MOCK_CHAIN_ID_1 = 1;
export const MOCK_CHAIN_ID_2 = 2;

export const MOCK_ADDRESS_1 = "0x0000000000000000000000000000000000000001";
const MOCK_ADDRESS_2 = "0x0000000000000000000000000000000000000002";

export const MOCK_TRANSACTION_HASH_1 =
  "0x1000000000000000000000000000000000000001";

const MOCK_BLOCK_HASH_1 = "0x2000000000000000000000000000000000000001";

export const MOCK_TRANSACTION_TYPE = "test-type";

export const MOCK_TRANSACTION_RECEIPT: TransactionReceipt = {
  from: MOCK_ADDRESS_1,
  to: MOCK_ADDRESS_2,
  contractAddress: MOCK_ADDRESS_2,
  transactionIndex: 1,
  transactionHash: MOCK_TRANSACTION_HASH_1,
  blockHash: MOCK_BLOCK_HASH_1,
  blockNumber: 1,
};

export const MOCK_TRANSACTION: Transaction = {
  from: MOCK_ADDRESS_1,
  hash: MOCK_TRANSACTION_HASH_1,
  info: {
    type: MOCK_TRANSACTION_TYPE,
  },
  addedTime: 0,
};

export const MOCK_CONFIRMED_TRANSACTION: Transaction = {
  from: MOCK_ADDRESS_1,
  hash: MOCK_TRANSACTION_HASH_1,
  info: {
    type: MOCK_TRANSACTION_TYPE,
  },
  addedTime: 0,
  confirmedTime: 1,
  receipt: MOCK_TRANSACTION_RECEIPT,
};
