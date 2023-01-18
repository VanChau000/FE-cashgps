import {
  differenceBy,
  flattenDeep,
  flattenDepth,
  groupBy,
  map,
  orderBy,
  sumBy,
  uniqBy,
} from 'lodash';
import { useEffect } from 'react';

export class WeeklyTableFactory {
  static getTotalCashInPerTran(dataCashIn: any) {
    const totalCashInPerTran = map(dataCashIn, (d: any) => {
      const cash = map(d.cashEntryRow, c => {
        const transactions = map(c.transactions, t => {
          return {
            ...t,
            totalValue: {
              total: sumBy(t.transactions, 'value'),
              date: t.transactionDate,
            },
            totalEstimated: sumBy(t.transactions, 'estimatedValue'),
            percent: Math.round(
              ((sumBy(t.transactions, 'estimatedValue') -
                sumBy(t.transactions, 'value')) /
                sumBy(t.transactions, 'estimatedValue')) *
              100,
            ),
          };
        });
        return { ...c, transactions: transactions };
      });
      return { ...d, cashEntryRow: cash };
    });
    return totalCashInPerTran;
    // const computeTotalTransaction = (t: any) => {
    //   return {
    //     ...t,
    //     totalValue: {
    //       total: sumBy(t.transactions, 'value'),
    //       date: t.transactionDate,
    //     },
    //     totalEstimated: sumBy(t.transactions, 'estimatedValue'),
    //     percent: Math.round((sumBy(t.transactions, 'estimatedValue') - sumBy(t.transactions, 'value')) / sumBy(t.transactions, 'estimatedValue') * 100)
    //   }
    // }
    // const computeCashEntry = (c: any) => {
    //   const transactions: any = map(c.transactions, computeTotalTransaction => {
    //     return { ...c, transactions: transactions };
    //   })
    // }
    // const computeTotalCashIn = (d: any) => {
    //   const cash = map(d.cashEntryRow, computeCashEntry)
    //   return { ...d, cashEntryRow: cash };
    // }
    // const totalCashInPerTran = map(dataCashIn, computeTotalCashIn)
    // return totalCashInPerTran
  }
  static getTotalCashInPerDay(cashInPerTran: any) {
    const totalCashInPerDay: any = map(cashInPerTran, (d: any, idxCash) => {
      // find unique transaction date in cash-in in each table cash-in
      const transactionTmp = orderBy(
        uniqBy(
          flattenDepth(map(d.cashEntryRow, 'transactions')),
          'transactionDate',
        ),
        ['transactionDate'],
        ['asc'],
      );
      // object inclues unique date of all transacstion in one table cash-in
      const maxtransaction = { transactions: transactionTmp } as any;
      // loc qua cac phan tu cua mang chua unique transaction date
      const r = map(maxtransaction?.transactions, (c, idx) => {
        // map through out cash entry row to campare wih maxtransaction
        const newTransaction = map(d.cashEntryRow, (cashEntry, idxRow) => {
          // compare each cash entry row have transaction with maxtransaction date
          if (
            cashEntry?.transactions?.length !==
            maxtransaction?.transactions?.length
          ) {
            //find the dates missing fill fake value into
            const missDate1: any = differenceBy(
              maxtransaction?.transactions,
              d.cashEntryRow[idxRow]?.transactions,
              'transactionDate',
            );

            // push dates missing with empty value
            const newMissingDate = map(missDate1, date => ({
              ...date,
              totalEstimated: 0,
              percent: 0,
              totalValue: { ...date?.totalValue, total: 0 },
              transactions: [],
            }));

            return {
              ...cashEntry,
              transactions: orderBy(
                cashEntry.transactions.concat(newMissingDate),
                ['transactionDate'],
                ['asc'],
              ),
            };
          }
          return cashEntry;
        });

        const totalCashPerDay: any = map(newTransaction, (r: any, idxRow) => {
          /* get all of array including transacction => to get all transaction*/
          return {
            totalTransaction: r?.transactions[idx]?.totalValue?.total || 0,
            totalEtimate: r?.transactions[idx]?.totalEstimated || 0,
          };
        });

        const res: any = {
          totalTransaction: Math.round(sumBy(totalCashPerDay, 'totalTransaction')),
          totalEtimate: Math.round(sumBy(totalCashPerDay, 'totalEtimate')),
          transactionDate: c?.transactionDate,
        };

        return res;
      });
      return { ...d, totalCashPerDay: r };
    });
    return totalCashInPerDay;
  }
  static getTotalCashOutPerTran(dataCashOut: any) {
    const totalCashInPerTran = map(dataCashOut, (d: any) => {
      const cash = map(d.cashEntryRow, c => {
        const transactions = map(c.transactions, t => {
          return {
            ...t,
            totalValue: {
              total: sumBy(t.transactions, 'value'),
              date: t.transactionDate,
            },
            totalEstimated: sumBy(t.transactions, 'estimatedValue'),
            percent: Math.round(
              ((sumBy(t.transactions, 'estimatedValue') -
                sumBy(t.transactions, 'value')) /
                sumBy(t.transactions, 'estimatedValue')) *
              100,
            ),
          };
        });
        return { ...c, transactions: transactions };
      });
      return { ...d, cashEntryRow: cash };
    });
    return totalCashInPerTran;
  }
  static getTotalCashOutPerDay(cashOutPerTran: any) {
    const totalCashOutPerDay: any = map(cashOutPerTran, (d: any, idxCash) => {
      // const maxtransaction = maxBy(d.cashEntryRow, 'transactions.length') as any;
      const transactionTmp = orderBy(
        uniqBy(
          flattenDepth(map(d.cashEntryRow, 'transactions')),
          'transactionDate',
        ),
        ['transactionDate'],
        ['asc'],
      );
      const maxtransaction = { transactions: transactionTmp } as any;
      const r = map(maxtransaction?.transactions, (c, idx) => {
        /* get length of lonsgest Array => to get index*/
        const newTransaction = map(d.cashEntryRow, (cashEntry, idxRow) => {
          if (
            cashEntry?.transactions?.length !==
            maxtransaction?.transactions?.length
          ) {
            //find the dates missing
            const missDate1: any = differenceBy(
              maxtransaction?.transactions,
              d.cashEntryRow[idxRow]?.transactions,
              'transactionDate',
            );
            // push dates missing with empty value
            const newMissingDate = map(missDate1, date => ({
              ...date,
              totalEstimated: 0,
              totalValue: { ...date?.totalValue, total: 0 },
              transactions: [],
            }));

            return {
              ...cashEntry,
              transactions: orderBy(
                cashEntry.transactions.concat(newMissingDate),
                ['transactionDate'],
                ['asc'],
              ),
            };
          }
          return cashEntry;
        });
        const totalCashPerDay: any = map(newTransaction, (r: any, idxRow) => {
          /* get all of array including transacction => to get all transaction*/
          return {
            totalTransaction: r?.transactions[idx]?.totalValue?.total || 0,
            totalEtimate: r?.transactions[idx]?.totalEstimated || 0,
          };
        });
        const res = {
          totalTransaction: Math.round(sumBy(totalCashPerDay, 'totalTransaction')),
          totalEtimate: Math.round(sumBy(totalCashPerDay, 'totalEtimate')),
          transactionDate: c?.transactionDate,
        };

        return res;
      });
      return { ...d, totalCashPerDay: r };
    });
    return totalCashOutPerDay;
  }
}
export const HandleSumAllTableCashIn = (
  dataCashIn: any,
  totalCashInPerDay: any,
  setTotalCashIn: (state: any) => void,
) => {
  useEffect(() => {
    const getTotalCashInTest = (totalCashInPerDay: any) => {
      // get all value from cashIn and push them all in an array (with the same day)
      const cashInArray: any = [];
      totalCashInPerDay.map((user: any, idx: any) => {
        const singleCashIn: any = user.totalCashPerDay.map(
          (item: any, index: any) => {
            return { totalCashIn: item.totalTransaction, date: item.transactionDate };
          },
        );
        return cashInArray.push(singleCashIn);
      });

      // sum value trans with the same day
      const result: any = map(
        Object.values(groupBy(flattenDeep(cashInArray), 'date')),
        (cashIn: any) => {
          return {
            date: cashIn[0]?.date || '',
            totalCashIn: sumBy(cashIn, 'totalCashIn'),
          };
        },
      );
      setTotalCashIn(result);
    };
    getTotalCashInTest(totalCashInPerDay);
  }, [dataCashIn]);
};
export const HandleSumAllTableCashOut = (
  dataCashOut: any,
  totalCashOutPerDay: any,
  setTotalCashOut: (state: any) => void,
) => {
  useEffect(() => {
    const getTotalCashOutTest = (totalCashOutPerDay: any) => {
      // get all value from cashIn and push them all in an array (with the same day)
      const cashOutArray: any = [];
      totalCashOutPerDay.map((user: any, idx: any) => {
        const singleCashOut: any = user.totalCashPerDay.map(
          (item: any, index: any) => {
            return { totalCashOut: item.totalTransaction, date: item.transactionDate };
          },
        );
        return cashOutArray.push(singleCashOut);
      });
      // sum value trans with the same day
      const result = map(
        Object.values(groupBy(flattenDeep(cashOutArray), 'date')),
        (cashOut: any) => {
          return {
            date: cashOut[0]?.date || '',
            totalCashOut: sumBy(cashOut, 'totalCashOut'),
          };
        },
      );
      setTotalCashOut(result);
    };
    getTotalCashOutTest(totalCashOutPerDay);
  }, [dataCashOut]);
};
export const HandleGetInCome = (
  totalCashIn: any,
  totalCashOut: any,
  setGainLoss: (state: any) => void,
) => {
  useEffect(() => {
    const handleGetInCome = (cashIn: any, cashOut: any) => {
      //find the days difference between cashin and cash out
      const differrnceDaysCashIn = differenceBy(cashIn, cashOut, 'date');
      const listDiffernceDaysCashIn: any = differrnceDaysCashIn?.map(
        (date: any) => {
          return { date: date?.date, totalCashOut: 0 };
        },
      );
      //find the days difference between cashin and cash out
      const differrnceDaysCashOut = differenceBy(cashOut, cashIn, 'date');
      const lsitDiffernceDaysCashOut: any = differrnceDaysCashOut?.map(
        (date: any) => {
          return { date: date?.date, totalCashIn: 0 };
        },
      );
      const totalCashIn = orderBy(
        cashIn?.concat(lsitDiffernceDaysCashOut),
        ['date'],
        ['asc'],
      );
      const totalCashOut = orderBy(
        cashOut?.concat(listDiffernceDaysCashIn),
        ['date'],
        ['asc'],
      );

      const gianAndloss: any = totalCashIn?.map((x: any) => {
        const findeDateInOut: any = totalCashOut?.find(
          (y: any) => y?.date === x?.date,
        );
        return {
          transactionDate: x.date,
          result: x?.totalCashIn - findeDateInOut?.totalCashOut,
        };
      });
      // order the transactionDate asc becasue some day user may not fill data
      const newArrayOrderBy = orderBy(
        gianAndloss,
        ['transactionDate'],
        ['asc'],
      );
      setGainLoss(newArrayOrderBy);
    };
    handleGetInCome(totalCashIn, totalCashOut);
  }, [totalCashOut, totalCashIn]);
};

//display mode saturday and sunday
export const HanldeDisPlayMode = (
  dateRange: any,
  weekSchedule: any,
  setDateRangeArray: (state: any) => void,
) => {
  useEffect(() => {
    const dateRangeArrayFormat: any = dateRange?.map((i: any) => {
      return {
        transactionDate: i
          .toLocaleDateString('en-GB')
          .split('/')
          .reverse()
          .join('-'),
      };
    });
    if (weekSchedule === '63') {
      const lackOfSaturday = dateRangeArrayFormat?.filter(
        (date: any) =>
          new Date(date?.transactionDate).toDateString().split(' ')[0] !==
          'Sun',
      );
      setDateRangeArray(lackOfSaturday);
      return;
    } else if (weekSchedule === '95') {
      const lackOfSunday = dateRangeArrayFormat?.filter(
        (date: any) =>
          new Date(date?.transactionDate).toDateString().split(' ')[0] !==
          'Sat',
      );
      setDateRangeArray(lackOfSunday);
      return;
    } else if (weekSchedule === '31') {
      const lackOfweekend = dateRangeArrayFormat?.filter(
        (date: any) =>
          new Date(date?.transactionDate).toDateString().split(' ')[0] !==
          'Sun' &&
          new Date(date?.transactionDate).toDateString().split(' ')[0] !==
          'Sat',
      );
      setDateRangeArray(lackOfweekend);
      return;
    } else if (weekSchedule === '127') {
      setDateRangeArray(dateRangeArrayFormat);
      return;
    }
    setDateRangeArray(dateRangeArrayFormat);
  }, [weekSchedule, dateRange]);
};
