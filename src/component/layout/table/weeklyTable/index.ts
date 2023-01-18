export class computeCashInAndCashOut {
  //get List id and name of cash gorup to edit duplicated
  static getListCashGroup = (cashGroupArr: any, setListCashGroup: any) => {
    const newListCashGroup = cashGroupArr?.map((cashGorup: any) => {
      const listEachGroup = cashGorup?.map((cash: any) => {
        return {
          cashId: cash?.id,
          cashName: cash?.name,
          groupType: cash?.groupType,
        };
      });
      return [...listEachGroup];
    });
    setListCashGroup(newListCashGroup);
  };
  //check id for "USED" and push them into array
  static findIdDisplay = (dataSingleProject: any, setShowRow: any) => {
    let listArrId: any = [];
    const arr = dataSingleProject?.fetchProject?.cashGroup?.map(
      (cashGroup: any) => {
        const arr2 = cashGroup?.map((cash: any) => {
          if (cash?.displayMode === 'USED') {
            listArrId.push(cash?.id);
            return cash?.id;
          }
          return cash;
        });
        return cashGroup;
      },
    );
    setShowRow([...listArrId]);
  };
}
