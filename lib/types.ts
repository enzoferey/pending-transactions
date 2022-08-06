export interface TransactionReceipt {
  from: string;
  to: string;
  contractAddress: string;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  status?: number;
}

export interface BaseTransactionInfo {
  type: string;
}

export interface Transaction {
  from: string;
  hash: string;
  addedTime: number;
  info: BaseTransactionInfo;
  lastCheckedBlockNumber?: number;
  confirmedTime?: number;
  receipt?: TransactionReceipt;
}

export interface ChainTransactionsState {
  [transactionHash: string]: Transaction;
}

export interface TransactionsState {
  [chainId: number]: ChainTransactionsState;
}
