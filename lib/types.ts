export interface TransactionReceipt {
  from: string;
  to: string;
  contractAddress: string;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  hadSuccess: boolean;
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

export interface OracleTransaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> extends Transaction<TransactionInfo> {
  oracleConfirmedTime?: number;
  oracleRecept?: TransactionReceipt;
  isOracleTransaction: true;
}

export interface ChainTransactionsState<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> {
  [transactionHash: string]:
    | Transaction<TransactionInfo>
    | OracleTransaction<TransactionInfo>;
}

export interface TransactionsState<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> {
  [chainId: number]: ChainTransactionsState<TransactionInfo>;
}
