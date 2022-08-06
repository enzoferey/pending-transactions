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

export interface Transaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> {
  from: string;
  hash: string;
  addedTime: number;
  info: TransactionInfo;
  lastCheckedBlockNumber?: number;
  confirmedTime?: number;
  receipt?: TransactionReceipt;
}

export interface ChainTransactionsState<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> {
  [transactionHash: string]: Transaction<TransactionInfo>;
}

export interface TransactionsState<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> {
  [chainId: number]: ChainTransactionsState<TransactionInfo>;
}
