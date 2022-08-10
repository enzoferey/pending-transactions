import type {
  OracleTransaction,
  Transaction,
  TransactionReceipt,
} from "../types";

export const MOCK_CHAIN_ID_1 = 1;
export const MOCK_CHAIN_ID_2 = 2;

export const MOCK_ADDRESS_1 = "0x0000000000000000000000000000000000000001";
export const MOCK_ADDRESS_2 = "0x0000000000000000000000000000000000000002";

export const MOCK_TRANSACTION_HASH_1 =
  "0x1000000000000000000000000000000000000001";

export const MOCK_TRANSACTION_TYPE = "test-type";

export const MOCK_TRANSACTION_RECEIPT: TransactionReceipt = {
  from: "0x0000000000000000000000000000000000000010",
  to: "0x0000000000000000000000000000000000000011",
  contractAddress: "0x0000000000000000000000000000000000000011",
  transactionIndex: 1,
  transactionHash: "0x1000000000000000000000000000000000000010",
  blockHash: "0x2000000000000000000000000000000000000010",
  blockNumber: 1,
  hadSuccess: false,
};

export const MOCK_SUCCESSFUL_TRANSACTION_RECEIPT: TransactionReceipt = {
  ...MOCK_TRANSACTION_RECEIPT,
  hadSuccess: true,
};

export const MOCK_NON_SUCCESSFUL_TRANSACTION_RECEIPT: TransactionReceipt = {
  ...MOCK_TRANSACTION_RECEIPT,
  hadSuccess: false,
};

export const MOCK_TRANSACTION: Transaction = {
  from: "0x0000000000000000000000000000000000000012",
  hash: "0x1000000000000000000000000000000000000011",
  info: {
    type: MOCK_TRANSACTION_TYPE,
  },
  addedTime: 0,
};

export const MOCK_CONFIRMED_TRANSACTION: Transaction = {
  from: "0x0000000000000000000000000000000000000013",
  hash: "0x1000000000000000000000000000000000000012",
  info: {
    type: MOCK_TRANSACTION_TYPE,
  },
  addedTime: 0,
  confirmedTime: 1,
  receipt: MOCK_TRANSACTION_RECEIPT,
};

export const MOCK_ORACLE_TRANSACTION: OracleTransaction = {
  from: "0x0000000000000000000000000000000000000014",
  hash: "0x1000000000000000000000000000000000000013",
  info: {
    type: MOCK_TRANSACTION_TYPE,
  },
  addedTime: 0,
  isOracleTransaction: true,
};

export const MOCK_ORACLE_TRANSACTION_WITH_CONFIRMED_TRANSACTION: OracleTransaction =
  {
    from: "0x0000000000000000000000000000000000000015",
    hash: "0x1000000000000000000000000000000000000014",
    info: {
      type: MOCK_TRANSACTION_TYPE,
    },
    addedTime: 0,
    confirmedTime: 1,
    receipt: MOCK_TRANSACTION_RECEIPT,
    isOracleTransaction: true,
  };

export const MOCK_CONFIRMED_ORACLE_TRANSACTION: OracleTransaction = {
  from: "0x0000000000000000000000000000000000000016",
  hash: "0x1000000000000000000000000000000000000015",
  info: {
    type: MOCK_TRANSACTION_TYPE,
  },
  addedTime: 0,
  confirmedTime: 1,
  receipt: MOCK_TRANSACTION_RECEIPT,
  oracleReceipt: MOCK_TRANSACTION_RECEIPT,
  isOracleTransaction: true,
};

export const MOCK_BLOCK_HASH_1 = "0x2000000000000000000000000000000000000001";
