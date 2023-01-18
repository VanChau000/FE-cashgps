
import { map, round, flattenDeep, groupBy, sumBy } from 'lodash';
export class MonthlyTableFactory {
  static getWeekOfMonth(data: Array<String>) {
    function getWeekNumber(date: any) {
      date = new Date(+date);
      date.setHours(0, 0, 0, 0);
      date.setDate(date?.getDate() + 4 - (date?.getDay() || 7));
      var yearStart: any = new Date(date?.getFullYear(), 0, 1);
      var weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
      return [date?.getFullYear(), weekNo];
    }
    function parseISOLocal(s: any) {
      var b = s.split(/\D/);
      return new Date(b[0], b[1] - 1, b[2]);
    }
    const arr = data?.map(function (s) {
        const week = getWeekNumber(parseISOLocal(s));
        return week[0] + ('0' + week[1]).slice(-2) + ':' + s;
      })
      .sort();

    // Group in arrays by week in an object
    var groupedObj = arr.reduce(function (result: any, value) {
      var b = value.split(':');
      if (!result[b[0]]) result[b[0]] = [];
      result[b[0]].push(b[1]);
      return result;
    }, {});

    const groupedArray = Object.keys(groupedObj)
      .sort()
      .map(key => groupedObj[key]);

    // Grab arrays in order of week number. Sort keys to maintain order
    return groupedArray;
  }
  // get array of number of days in a month
  static genderDayOfMonth(year: number, month: number, result: Array<String>) {
    const monthYear = `${year}-${month}`;
    const nbDaysOfMonth = new Date(year, month, 0).getDate();
    result = [];
    map(Array.from(new Array(nbDaysOfMonth)), (_, idx) =>
      result.push(`${monthYear}-${idx < 9 ? `0${idx + 1}` : idx + 1}`),
    );
    return result;
  }

  static getStartEndOfWeek(weeks: Array<String>) {
    const SEOfWeek = [];
    if (weeks) {
      SEOfWeek.push(weeks[0]);
      SEOfWeek.push(weeks[weeks.length - 1]);
    }
    return SEOfWeek;
  }

  static getWeekNumber(dateWeek: any) {
    const startDateOfYear: any = new Date(dateWeek?.getFullYear(), 0, 1);
    const dayNr =
      Math.ceil((dateWeek - startDateOfYear) / (24 * 60 * 60 * 1000)) - 1;
    const weekNr = Math.ceil((dayNr + startDateOfYear?.getDay()) / 7) ;
    return weekNr;
  }

  static splitMonth(value: any, index: number, charSplit: string) {
    return value.split(charSplit)[index];
  }

  static getNewDataBasedOnWeeksOfMonth(date: string, list: any) {
    const newList: any = [];
    list?.map((item: any) => {
      if (item?.transactionDate?.includes(date)) {
        newList.push(item);
      }
      return newList;
    });
    return newList;
  }

  static getMonthAndYearSelected(date: Date) {
    const result = `${date.getFullYear()}-${date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
      }`;
    return result.toString();
  }

  static getDataBasedOnWeeksOfMonth(
    listMonth: Array<String>,
    listData: any,
    type: string,
    dateStartBalance?: any,
    startBalance?: number,
  ) {
    const result = listMonth?.map((week: any) => {
      let total = 0;
      let res = 0;

      listData?.map((data: any) => {
        if (
          new Date(week[0]) <= new Date(data.transactionDate) &&
          new Date(week[week.length - 1]) >= new Date(data.transactionDate)
        ) {
          if (type === 'gain') total += data?.result || 0;
          else if (type === 'cashPerDay') total += data?.totalTransaction || 0;
          else if (type === 'position') {
            if (data?.sum !== total) {
              total = data.sum;
            }
          }
        } else if (new Date(week[0]) >= new Date(data.transactionDate)) {
          if (type === 'position') {
            res = data.sum;
          }
        } else if (
          new Date(data.transactionDate) >= new Date(dateStartBalance) &&
          new Date(week[week.length - 1]) >= new Date(dateStartBalance)
        ) {
          if (type === 'position') {
            res = startBalance || 0;
          }
        }
      });
      return {
        data: round(total === 0 ? res : total, 1),
        transaction: week[week.length - 1],
      };
    });
    return result;
  }

  static getDataCashPerDayBasedOnWeeksOfMonth(listMonth: any, listData: any) {
    const dataResult = listData?.map((data: any) => {
      const result = listMonth?.map((week: any) => {
        let total = 0;
        let totalEstimate = 0;
        data?.totalCashPerDay?.map((dataTotalTest: any) => {
          if (
            new Date(week[0]) <= new Date(dataTotalTest.transactionDate) &&
            new Date(week[week.length - 1]) >=
            new Date(dataTotalTest.transactionDate)
          ) {
            total += dataTotalTest.totalTransaction || 0;
            totalEstimate += dataTotalTest.totalEtimate || 0;
          }
        });
        return {
          totalValue: round(total, 1),
          totalEstimate: round(totalEstimate, 1),
          transaction: week[week.length - 1],
        };
      });
      const listTransactionPerProject = data?.cashEntryRow?.map(
        (entryRow: any) => {
          const resTotal = listMonth?.map((week: any) => {
            let valuePerTrans = 0;
            let estimatePerTrans = 0;
            entryRow?.transactions?.map((trans: any) => {
              if (
                new Date(week[0]) <= new Date(trans.transactionDate) &&
                new Date(week[week.length - 1]) >=
                new Date(trans.transactionDate)
              ) {
                valuePerTrans += trans.totalValue.total;
                estimatePerTrans += trans.totalEstimated;
              }
            });
            return {
              valuePerTrans: valuePerTrans,
              estimatePerTrans: estimatePerTrans,
              transaction: week[week.length - 1],
            };
          });
          return { ...entryRow, resTotal };
        },
      );
      return {
        ...data,
        result,
        listTransactionPerProject,
      };
    });
    return dataResult;
  }

  static getTotalCashPerDayBasedOnWeeksOfMonth(listData: any) {
    const data = listData?.map((data: any) => {
      return data.result;
    });
    const dataElement = flattenDeep(data)
    const resData = groupBy(dataElement, 'transaction')
    if (!resData) return
    const result = map(resData, (dataTranPerDay: any) => {
      return { data: sumBy(dataTranPerDay, "totalValue"), transaction: dataTranPerDay[0].transaction }
    })
    return result;
  }

  static estimatePresentive(listCashPerInBasedOnWeeksOfMonth: any) {
    const result = listCashPerInBasedOnWeeksOfMonth?.map((list: any) => {
      const res = list?.listTransactionPerProject?.map((item: any) => {
        return item?.resTotal?.map((data: any) => {
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

  static getNbWeekOfMonth(listMonth: any, month: any) {
    var currentWeekNumber = require('current-week-number');
    // const dayjs = require('dayjs')
    const monthString = month.toString().split(' ')[1];
    const res = listMonth?.map((item: any) => {
      const dayOfWeek = `${monthString} ${item[0].split('-')[2]
        } - ${monthString} ${item[item.length - 1].split('-')[2]}`;
      const numberWeek = currentWeekNumber(item[0]);
      return { nbOfWeek: numberWeek, listWeek: dayOfWeek };
    });
    return res;
  }

  static splitWeekOfMonth(listMonth: any) {
    const res = [];
    const range = listMonth?.map((week: any) => {
      return week[week.length - 1];
    });
    res.push(range);
    return res;
  }
}
