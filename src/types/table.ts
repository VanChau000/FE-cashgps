
export interface ITransactions {
  cashEntryRowId: string,
  cashGroupId: string,
  description: string,
  displayMode: string,
  estimatedValue: number,
  frequency: string,
  frequencyStopAt: string,
  id: string,
  ownerId: string,
  projectId: string,
  transactionDate: string,
  value: number,

}

export interface ICashEntryRow {
  cashGroupId: string,
  displayMode: string,
  id: string,
  name: string,
  ownerId: string,
  projectId: string,
  rankOrder: number,
  transactions: [
    transactions: Array<ITransactions>,
    percent: number,
    totalEstimated: number,
    totalValue: {
      date: string,
      total: number,
    },
    transactionDate: string,
  ],
}

export interface ICashPerDay {
  cashEntryRow: Array<ICashEntryRow>,
  displayMode: string,
  groupType: string,
  id: string,
  name: string,
  rankOrder: number,
  totalCashPerDay: {
    totalEtimate: number,
    totalTransaction: number,
    transactionDate: string,
  }
}