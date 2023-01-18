import { uuidv4 } from "@firebase/util";
import { map } from "lodash";
interface typeTransValue {
  cashTransactionId: string;
  upsertArgs: {
    value: number | null;
    transactionDate: string;
    estimatedValue: number | null;
    frequency: string |null;
    frequencyStopAt: string|null;
    description: string;
    cashEntryRowId: string;
  }
}
export class AddTransDetailFactory {
  static monthDiff(dateFrom: Date, dateTo: Date) {
    if (dateTo.getDate() < dateFrom.getDate()) {
      return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear())) - 1
    }
    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }
  static weekDiff(dateFrom: Date, dateTo:Date) {
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.round(Math.abs(dateTo.getTime() - dateFrom.getTime()) / msInWeek,
    );
  }
  static getYearDiff(dateFrom: Date, dateTo: Date) {
    if (dateTo.getMonth() < dateFrom.getMonth() ) {
      return Math.abs(dateTo.getFullYear() - dateFrom.getFullYear()) -1 ;
    } else if (dateTo.getMonth() === dateFrom.getMonth() && dateTo.getDate() < dateFrom.getDate()) {
      return Math.abs(dateTo.getFullYear() - dateFrom.getFullYear()) -1;
    }
    return Math.abs(dateTo.getFullYear() - dateFrom.getFullYear());
  }

  static renderFrequencyTrans(data: any, startAt: any,cashEntryRowId: any) {
    const newListData: typeTransValue[] = [];
    if (data?.frequency === 'DAILY') {
      const lengthOfArr = (+new Date(data?.frequencyStopAt) - +new Date(startAt)) / (1000 * 60 * 60 * 24);
      map(Array.from(new Array(lengthOfArr)), (_: any, i: number) => {
        const idTran: any = uuidv4();
        const transDate = new Date(startAt).setDate(new Date(startAt).getDate() + i+1)  
        const newObj = {
          cashTransactionId: idTran,
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: null,
            frequencyStopAt: null,
            description: data.description,
            transactionDate: new Date(transDate).toJSON().split('T')[0],
            cashEntryRowId: cashEntryRowId,
          }
        }
        newListData.push(newObj)
      });
      newListData.push({cashTransactionId: data.id ? data.id : uuidv4(),
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: data.frequency,
            frequencyStopAt: data.frequencyStopAt,
            description: data.description,
            transactionDate: new Date(startAt).toJSON().split('T')[0],
            cashEntryRowId: cashEntryRowId,
          }})
    }
    else if (data?.frequency === 'WEEKLY') {
      const lengthOfArr = this.weekDiff(new Date(startAt), new Date(data?.frequencyStopAt))
      map(Array.from(new Array(lengthOfArr)), (_: any, i: number) => {
        const idTran: any = uuidv4();
        const transDate = new Date(startAt).setDate(new Date(startAt).getDate() + ((i+1)*7))  
        const newObj = {
          cashTransactionId: idTran,
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: null,
            frequencyStopAt: null,
            description: data.description,
            transactionDate: new Date(transDate).toJSON().split('T')[0],
            cashEntryRowId: cashEntryRowId,
          }
        }
        newListData.push(newObj)
      });
      newListData.push({cashTransactionId: data.id ? data.id : uuidv4(),
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: data.frequency,
            frequencyStopAt: data.frequencyStopAt,
            description: data.description,
            transactionDate: new Date(startAt).toJSON().split('T')[0],
            cashEntryRowId: cashEntryRowId,
          }})
    }
    else if (data?.frequency === 'MONTHLY') {
      const lengthOfArr = this.monthDiff(new Date(startAt), new Date(data?.frequencyStopAt))
      map(Array.from(new Array(lengthOfArr)), (_: any, i: number) => {
        const idTran: any = uuidv4();
        const transDate = new Date(startAt)
        const newObj = {
          cashTransactionId: idTran,
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: null,
            frequencyStopAt: null,
            description: data.description,
            transactionDate: `${transDate.getFullYear()}-${transDate.getMonth() < 9 ? `0${(transDate.getMonth() + i + 2)}`:(transDate.getMonth() + i + 2)}-${transDate.getDate() <= 9 ? `0${transDate.getDate()}`:transDate.getDate()}`,
            cashEntryRowId:cashEntryRowId,
          }
        }
        newListData.push(newObj)
      });
      newListData.push({cashTransactionId: data.id ? data.id : uuidv4(),
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: data.frequency,
            frequencyStopAt: data.frequencyStopAt,
            description: data.description,
            transactionDate: new Date(startAt).toJSON().split('T')[0],
            cashEntryRowId: cashEntryRowId,
          }})
    }
    else if (data?.frequency === 'ANNUALLY') {
      const lengthOfArr = this.getYearDiff(new Date(startAt), new Date(data?.frequencyStopAt))
      map(Array.from(new Array(lengthOfArr)), (_: any, i: number) => {
        const idTran: any = uuidv4();
        const transDate = new Date(startAt)
        const newObj = {
          cashTransactionId: idTran,
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: null,
            frequencyStopAt: null,
            description: data.description,
            transactionDate: `${transDate.getFullYear() + i + 1}-${transDate.getMonth() < 9 ? `0${(transDate.getMonth() + 1)}` :`${(transDate.getMonth() + 1)}`}-${transDate.getDate() <= 9 ? `0${transDate.getDate()}`:transDate.getDate()}`,
            cashEntryRowId:cashEntryRowId,
          }
        }
        newListData.push(newObj)
      });
      newListData.push({cashTransactionId: data.id ? data.id : uuidv4(),
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: data.frequency,
            frequencyStopAt: data.frequencyStopAt,
            description: data.description,
            transactionDate: new Date(startAt).toJSON().split('T')[0],
            cashEntryRowId: cashEntryRowId,
          }})
    } else {
        const transDate = new Date(startAt)
      newListData.push({
        cashTransactionId: data.id ? data.id : uuidv4(),
          upsertArgs: {
            value: data.value,
            estimatedValue: data.estimatedValue,
            frequency: null,
            frequencyStopAt: null,
            description: data.description,
            transactionDate: `${transDate.getFullYear()}-${transDate.getMonth() < 9 ? `0${(transDate.getMonth() + 1)}` :`${(transDate.getMonth() + 1)}`}-${transDate.getDate() <= 9 ? `0${transDate.getDate()}`:transDate.getDate()}`,
            cashEntryRowId: cashEntryRowId,
          }})
    }
    return newListData;
  }
}
export default AddTransDetailFactory;