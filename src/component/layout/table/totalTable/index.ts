import { intersectionBy, map, orderBy, sumBy, filter } from 'lodash';

export class computeCashPositionAndGainLoss {
  static formatDate(dateRangeArray: any) {
    const dateArray = dateRangeArray?.map((date: any) => {
      const dateNow = new Date(date.transactionDate).toUTCString();
      const formatDate = dateNow?.split(' ')[2] + ' ' + dateNow?.split(' ')[1];
      const dayFormat = dateNow?.split(' ')[0].slice(0, -1);
      const dateTrasnSaction = new Date(date.transactionDate)
        .toISOString()
        ?.split('T')[0];
      const today = new Date().toISOString()?.split('T')[0];
      return { dateNow, formatDate, dayFormat, dateTrasnSaction, today };
    });
    return dateArray;
  }
  static newArrayGainLoss: any = (
    dateinitialCashFlow: any,
    startingBalance: any,
    setTotalInCome: any,
    gainLoss: any,
  ) => {
    const newArray = [
      { transactionDate: dateinitialCashFlow, result: +startingBalance },
    ].concat(gainLoss);
    setTotalInCome(newArray);
  };
  static fillTransactionToDate: any = (
    totalInCome: any,
    dateinitialCashFlow: any,
    setListSum: React.Dispatch<any>,
  ) => {

    const result: any = filter(totalInCome, t => t.result !== 0).map((val: any, index: any) => {

      let sum = 0;
      let transactionDate = '';
      for (let i = 0; i < index + 1; i++) {
        sum += totalInCome[i]?.result;
        transactionDate = totalInCome[i]?.transactionDate;
      }
      return { transactionDate: transactionDate, sum: sum };
    });
    if (dateinitialCashFlow) {
      result?.shift();
      setListSum(result);
    } else {
      setListSum(result);
    }
  };
  static tranformCashPosition: any = (
    listSum: any,
    dateRangeArray: any,
    firstDateGainLoss: any,
    startingBalance: any,
    gainLoss: any,
    setNewListSum: any,
  ) => {
    if (!listSum) return;
    const listDateSum = [...listSum];
    dateRangeArray?.map((date: any) => {
      // const newListTest =
      if (!map(listSum, 'transactionDate').includes(date.transactionDate)) {
        listDateSum.push({ transactionDate: date.transactionDate, sum: 0 });
      }
      return date;
    });
    // Sort
    const softArray = orderBy(listDateSum, ['transactionDate'], ['asc']);


    const getArrayTest = intersectionBy(
      dateRangeArray,
      listDateSum,
      'transactionDate',
    );

    let sumTmp = 0;
    const result = map(softArray, item => {
      if (item.sum !== 0) {
        sumTmp = item.sum;

      } else if (item.sum === 0 && item?.transactionDate < firstDateGainLoss?.transactionDate) {
        item.sum = startingBalance;
      }
      else if (sumBy(gainLoss, "result") === 0) {
        item.sum = startingBalance;
      } else {
        item.sum = sumTmp;
      }
      return item;
    })
    return setNewListSum(result);
  };
  static fillterCashPositionToDisplay: any = (
    dateRangeArray: any,
    newListSum: any,
    setCashPositionValue: any,
  ) => {
    const findSameDate = dateRangeArray?.map((date: any) => {
      return newListSum?.find(
        (value: any) => value?.transactionDate === date?.transactionDate,
      );
    });
    setCashPositionValue(findSameDate);
  };
  static fillGainLossTodate = (
    gainLoss: any,
    dateRangeArray: any,
    setFillValueToGainLoss: any,
  ) => {
    if (!gainLoss) return;
    const newListGainLoss = gainLoss;
    dateRangeArray?.map((date: any) => {
      // const newListTest =
      if (!map(gainLoss, 'transactionDate').includes(date.transactionDate)) {
        newListGainLoss.push({
          transactionDate: date.transactionDate,
          result: 0,
        });
      }
      return date;
    });
    // Sort
    const softArray = orderBy(newListGainLoss, ['transactionDate'], ['asc']);
    return setFillValueToGainLoss(softArray);
  };
  static fillterGainLossToDisplay = (
    dateRangeArray: any,
    fillValueToGainLoss: any,
    setGainLossDisplay: any,
  ) => {
    const findSameDateGainLoss: any = dateRangeArray?.map((date: any) => {
      return fillValueToGainLoss?.find(
        (value: any) => value.transactionDate === date?.transactionDate,
      );
    });
    setGainLossDisplay(findSameDateGainLoss);
  };
}
