export class BillFactory {
  static getBillsHistory (data: any) {
    const newBillsHistory: any = []
    const flatData = data?.data.flat();
    flatData.map((item: any) => {
      const describe = item?.description.split(" ")
      const typeSubscription = describe[2] + ' ' + describe[3]
      const priceSubscription = describe[5]
      const start = new Date(item?.period.start * 1000)
      const end = new Date(item?.period.end * 1000)
      newBillsHistory.push({ id: item?.id, typeSubscription: typeSubscription, priceSubscription: priceSubscription, start: start, end: end })
      
    })
    return newBillsHistory;
  }

}

export default BillFactory