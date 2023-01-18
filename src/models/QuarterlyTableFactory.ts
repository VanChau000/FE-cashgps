import { map, round, orderBy } from 'lodash';

export class QuarterlyTableFactory {
  static getMonthOfQuarterly(dayStart: Date) {
    const newArrMonth = map(Array.from(new Array(3)), (_: any, i: number) => {
      const dayStartOfMonth = new Date(
        dayStart.getFullYear(),
        dayStart.getMonth() + i,
        1,
      );
      const start = `${dayStartOfMonth.getFullYear()}-${dayStartOfMonth.getMonth() + 1 <= 9
        ? `0${dayStartOfMonth.getMonth() + 1}`
        : dayStartOfMonth.getMonth() + 1
        }-${dayStartOfMonth.getDate() <= 9
          ? `0${dayStartOfMonth.getDate()}`
          : dayStartOfMonth.getDate()
        }`;
      const dayEndOfMonth = new Date(
        dayStart.getFullYear(),
        dayStart.getMonth() + 1 + i,
        0,
      );
      const end = `${dayEndOfMonth.getFullYear()}-${dayEndOfMonth.getMonth() + 1 <= 9
        ? `0${dayEndOfMonth.getMonth() + 1}`
        : dayEndOfMonth.getMonth() + 1
        }-${dayEndOfMonth.getDate() <= 9
          ? `0${dayEndOfMonth.getDate()}`
          : dayEndOfMonth.getDate()
        }`;
      return { start, end };
    });
    return newArrMonth;
  }

  static getMonthOfQuarterlyText(dayStart: Date) {

    const newArrMonth = map(Array.from(new Array(3)), (_: any, i: number) => {
      const dayStartOfMonth = new Date(
        dayStart.getFullYear(),
        dayStart.getMonth() + i,
        1,
      );
      const dayEndOfMonth = new Date(
        dayStart.getFullYear(),
        dayStart.getMonth() + 1 + i,
        0,
      );
      return { dayStartOfMonth, dayEndOfMonth };
    });
    return newArrMonth;
  }

  static getDataCashBasedOnWeeksOfMonth(
    listMonthOfQuarterly: any,
    listData: any,
    type: string,
    startBalance?: number,
  ) {
    const data = orderBy(listData, 'transactionDate', 'asc');
    const res = listMonthOfQuarterly.map((month: any, idx: number) => {
      let total = 0;
      let res = 0;
      data.map((data: any) => {
        if (
          new Date(data.transactionDate) >= new Date(month.start) &&
          new Date(data.transactionDate) <= new Date(month.end)
        ) {
          if (type === 'gain')
            total += data.result || 0;
          else if (type === 'cash-position')
            total = data.sum;
        }
        else if (new Date(data.transactionDate) >= new Date(month.end)) {
          if (type === 'cash-position')
            total = startBalance || 0;
        } else if (new Date(data.transactionDate) <= new Date(month.start)) {
          if (type === 'cash-position')
            res = data.sum;
        }
      });
      return { data: total === 0 ? res : total, transaction: month.end };
    });
    return res;
  }

  static getDataCashPerDayBasedOnWeeksOfMonth(
    listQuarterly: any,
    listData: any,
  ) {
    const res = listData?.map((data: any) => {
      const result = listQuarterly?.map((quarterly: any) => {
        let result = 0;
        let estimate = 0;
        data?.totalCashPerDay?.map((item: any) => {
          if (
            new Date(item.transactionDate) >= new Date(quarterly.start) &&
            new Date(item.transactionDate) <= new Date(quarterly.end)
          ) {
            result += item.totalTransaction || 0;
            estimate += item.totalEtimate || 0;
          } else {
            estimate += 0;
            result += 0;
          }
        });
        return {
          totalValue: result,
          totalEstimate: estimate,
          transaction: quarterly.end,
        };
      });

      const listTransactionPerProject = data?.cashEntryRow?.map(
        (entryRow: any) => {
          const resTotal = listQuarterly?.map((quarterly: any) => {
            let valuePerTrans = 0;
            let estimatePerTrans = 0;
            entryRow.transactions?.map((trans: any) => {
              if (
                new Date(quarterly.start) <= new Date(trans.transactionDate) &&
                new Date(quarterly.end) >= new Date(trans.transactionDate)
              ) {
                valuePerTrans += trans.totalValue.total;
                estimatePerTrans += trans.totalEstimated;
              }
            });
            return {
              valuePerTrans: valuePerTrans,
              estimatePerTrans: estimatePerTrans,
              transaction: quarterly.end,
            };
          });
          return { ...entryRow, resTotal };
        },
      );
      return { ...data, result, listTransactionPerProject };
    });
    return res;
  }

  static getTotalCashPerDayBasedOnWeeksOfMonth(listData: any) {
    if (listData?.length < 1) return;
    const dataElement = listData?.map((item: any, index: number) => {
      const res = item.result?.map((element: any, idx: number) => {
        if (listData[index + 1]) {
          return {
            data:
              element.totalValue + listData[index + 1].result[idx].totalValue,
            transaction: element.transaction,
          };
        } else
          return { data: element.totalValue, transaction: element.transaction };
      });
      return res;
    });

    return dataElement;
  }

  static estimatePresentive(listCashPerInBasedOnWeeksOfMonth: any) {
    const result = listCashPerInBasedOnWeeksOfMonth?.map((list: any) => {
      const res = list?.listTransactionPerProject?.map((item: any) => {
        return item.resTotal?.map((data: any) => {
          if (data.estimatePerTrans > 0)
            return round(
              ((data.estimatePerTrans - data.valuePerTrans) /
                data.estimatePerTrans) *
              100,
              1,
            );
          else return 0;
        });
      });
      return res;
    });
    return result;
  }

  static fillQuarterly(quarterlySelected: Date) {
    if (quarterlySelected.getMonth() + 1 <= 3) {
      return `${quarterlySelected.getFullYear()}-01-01`;
    } else if (quarterlySelected.getMonth() + 1 <= 6) {
      return `${quarterlySelected.getFullYear()}-04-01`;
    } else if (quarterlySelected.getMonth() + 1 <= 9) {
      return `${quarterlySelected.getFullYear()}-07-01`;
    } else if (quarterlySelected.getMonth() + 1 <= 12) {
      return `${quarterlySelected.getFullYear()}-10-01`;
    }
  }
}