import TotalTable from '../totalTable/TotalTable';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { useMutation, useQuery } from '@apollo/client';
import LoadingData from '../../../common/loadingData/LoadingData';
import AddTransDetail from '../../../common/popup/addTransDetail/AddTransDetail';
import UpDateTranDetail from '../../../common/popup/upDateTranDetail/UpDateTranDetail';
import ListTransaction from '../../../common/popup/listTransaction/ListTransaction';
import CategorySetting from '../../../common/popup/categorySetting/CategorySetting';
import AddCashGroup from '../../../common/popup/addCashGroup/AddCashGroup';
import AddCategory from '../../../common/popup/addCategory/AddCategory';
import ChangeGroupName from '../../../common/popup/changeGroupName/ChangeGroupName';
import DeleteCategory from '../../../common/popup/deleteCategory/DeleteCategory';
import { DISPLAY_MODE_GROUP } from '../../../../graphql/Mutation';
import { UserCtx } from '../../../../context/user/state';
import {
  HandleGetInCome,
  HandleSumAllTableCashOut,
  HanldeDisPlayMode,
  WeeklyTableFactory,
} from '../../../../models/WeeklyTableFactory';
import { HandleSumAllTableCashIn } from '../../../../models/WeeklyTableFactory';
import { first, flatten, flattenDeep, map, sumBy, tail } from 'lodash';
import './Table.scss';
import { computeCashInAndCashOut } from '.';
import CashTable from '../../../common/layoutTable/cashTable/CashTable';
import { useNavigate, useParams } from "react-router-dom"

function Table({ dateRange }: any) {
  const {
    setNameCashGroup,
    setCashPerDayIn,
    cashPerDayIn,
    setCashPerDayOut,
    setGainAndLoss,
    setInforProject,
    cashPosition,
    setWeekSchedule,
    weekSchedule,
    setListCashGroup,
    setIdCash,
  } = useContext(UserCtx);
  const param = useParams()
  const navigate = useNavigate()
  const { loading: projectLoading, error, data: dataSingleProject }: any = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const [displayModeGroup] = useMutation(DISPLAY_MODE_GROUP);
  const [loading, seLoading] = useState<any>(false)
  const [typeCashIn, setTypeCashIn] = useState<any>("IN")
  const [typeCashOut, setTypeCashOut] = useState<any>("OUT")
  const [showRow, setShowRow] = useState<any[]>([]);
  const [showListTrans, setShowListTrans] = useState<any>(false);
  const [showAddTransDetail, setShowAddTransDetail] = useState<any>(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState<any>(false);
  const [showCategoryGroupPopup, setShowCategoryGroupPopup] = useState<any>(false);
  const [showAddCategory, setShowAddCategoryPopup] = useState<any>(false);
  const [showChangeGroupNamePopup, setShowChangeGroupNamePopup] = useState<any>();
  const [showDeletePopup, setShowDeletePopup] = useState<any>(false);
  const [currencySymbol, setCurrencySymbol] = useState<any>()
  const [listTranDetail, setListTranDetail] = useState<any>([]);
  const [listNameCategoryEdit, setListNameCategoryEdit] = useState<any>([]);
  const [dataCategory, setDataCategory] = useState<any>();
  const [nameCategory, setNameCategory] = useState<any>();
  const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
  const [typeCashGroup, setTypeCashGroup] = useState<any>();
  const [valueCategory, setValueCategory] = useState();
  const [listTransNoValue, setListTranNoValue] = useState<any>([]);
  const [cashGroupArr, setCashGroupArr] = useState<any>();
  const [nameDateCategory, setNameDateCategory] = useState<any>({
    name: '',
    transactionDate: '',
    cashEntryRowId: '',
  });
  const [transWithNoValue, setTransWithNoValue] = useState<any>({
    name: '',
    transactionDate: '',
    cashEntryRowId: '',
  });

  // woking with BE
  const [dataCashIn, setDataCashIn] = useState<any>();
  const [totalCashIn, setTotalCashIn] = useState<any>();
  useEffect(() => {
    setDataCashIn(dataSingleProject?.fetchProject?.cashGroup[0]);
  }, [dataSingleProject]);
  const [dataCashOut, setDataCashOut] = useState<any>();
  const [totalCashOut, setTotalCashOut] = useState<any>();
  useEffect(() => {
    setDataCashOut(dataSingleProject?.fetchProject?.cashGroup[1]);
  }, [dataSingleProject]);
  const [startBalence, setStartBalence] = useState<any>();
  useEffect(() => {
    setStartBalence(
      dataSingleProject?.fetchProject?.infoProject?.startingBalance
    );
  }, [dataSingleProject]);

  const [dateInitCashFlow, setDateInitCashFlow] = useState<any>();

  useEffect(() => {
    setDateInitCashFlow(
      dataSingleProject?.fetchProject?.infoProject?.startDate,
    );
  }, [dataSingleProject]);
  useEffect(() => {
    setInforProject(dataSingleProject?.fetchProject?.infoProject);
  }, [dataSingleProject?.fetchProject?.infoProject]);
  useEffect(() => {
    setWeekSchedule(dataSingleProject?.fetchProject?.infoProject?.weekSchedule);
  }, [dataSingleProject]);
  useEffect(() => {
    setCashGroupArr(dataSingleProject?.fetchProject?.cashGroup);
  }, [dataSingleProject]);
  useEffect(() => {
    setCurrencySymbol(dataSingleProject?.fetchProject?.infoProject?.currencySymbol);
  }, [dataSingleProject]);
  useEffect(() => {
    const trialExpired = dataSingleProject?.fetchProject?.ownerSubscriptionExpiresAt
    const today = new Date()?.toISOString()?.slice(0, 10)
    if (trialExpired === today || trialExpired < today) {
      navigate('/expiredTrial')
    }
  }, [param?.projectId, dataSingleProject])


  const [inTest, setIntest] = useState<any>()
  //hanlde data cashIn
  const totalCashInPerTran =
    WeeklyTableFactory.getTotalCashInPerTran(dataCashIn);
  const totalCashInPerDay =
    WeeklyTableFactory.getTotalCashInPerDay(totalCashInPerTran);
  HandleSumAllTableCashIn(dataCashIn, totalCashInPerDay, setTotalCashIn);

  // in order to implement this function you need to gourpType and gourpID to filter which group that transaction will be in
  // need to cashGroupId to know which entry row cotain that transaction

  console.log({dataCashIn})

  const arr = [
    {
      cashEntryRowId: "633",
      cashGroupId: "498",
      description: "",
      displayMode: "USED",
      estimatedValue: 0,
      frequency: null,
      frequencyStopAt: null,
      id: "sfsdf",
      ownerId: "266",
      projectId: "182",
      transactionDate: "2023-01-10",
      value: 2000,
      groupType: "IN",
      groupId: "498",
      entryRowId: "633"
    },
    {
      cashEntryRowId: "633",
      cashGroupId: "498",
      description: "",
      displayMode: "USED",
      estimatedValue: 0,
      frequency: null,
      frequencyStopAt: null,
      id: "sfsdf",
      ownerId: "266",
      projectId: "182",
      transactionDate: "2023-01-10",
      value: 2000,
      groupType: "IN",
      groupId: "498",
      entryRowId: "633"
    }, {
      cashEntryRowId: "633",
      cashGroupId: "498",
      description: "",
      displayMode: "USED",
      estimatedValue: 0,
      frequency: null,
      frequencyStopAt: null,
      id: "sfsdf",
      ownerId: "266",
      projectId: "182",
      transactionDate: "2023-01-10",
      value: 2000,
      groupType: "IN",
      groupId: "498",
      entryRowId: "633"
    }
  ]




  // repeat frequance
  const test = {
    cashEntryRowId: "641",
    cashGroupId: "498",
    description: "",
    displayMode: "USED",
    estimatedValue: 0,
    frequency: null,
    frequencyStopAt: null,
    id: "12345678",
    ownerId: "266",
    projectId: "182",
    transactionDate: "2023-01-10",
    value: 2000,
    groupType: "IN",
    groupId: "503",
    entryRowId: "641"
  }

  const dayjs = require('dayjs');
  function renderListTests(length: any, test: any, frequance: any) {

    return Array.from({ length }, (_, i) => {
      let newTransactionDate = new Date(test.transactionDate);

      const a = newTransactionDate.setDate(newTransactionDate.getDate() + (i * 28))

      const totalDaysInMonth = dayjs(a).daysInMonth();
      newTransactionDate.setDate(newTransactionDate.getDate() + (frequance === "daily" ? i : frequance === "weekly" ? (i * 7) : frequance === "monthly" ? (i * 30) : i));


      return {
        cashEntryRowId: test.cashEntryRowId,
        cashGroupId: test.cashGroupId,
        description: test.description,
        displayMode: test.displayMode,
        estimatedValue: test.estimatedValue,
        frequency: test.frequency,
        frequencyStopAt: test.frequencyStopAt,
        id: test.id,
        ownerId: test.ownerId,
        projectId: test.projectId,
        transactionDate: newTransactionDate.toISOString().slice(0, 10),
        value: test.value,
        groupType: test.groupType,
        groupId: test.groupId,
        entryRowId: test.entryRowId,
      };
    })
  }  

  const a = (input: any) => {
    const totalCashInPerTran = map(dataCashIn, (d: any) => {
      if (input?.groupId === d?.id) {
        const cash = map(d.cashEntryRow, c => {
          if (c?.id === input?.entryRowId) {
            const transactions = map(c.transactions, t => {
              if (t?.transactionDate === input?.transactionDate) {
                const a = map(t.transactions, u => {
                  return { ...u }
                })
                return {
                  ...t,
                  transactions: flattenDeep([
                    ...a,
                    tail(renderListTests(5, test, "daily"))
                  ])
                };
              } else {
                return { ...t }
              }
            });
            return { ...c, transactions: transactions };
          } else {
            return { ...c }
          }
        });
        return { ...d, cashEntryRow: cash };
      } else {
        return { ...d }
      }
    });
    return totalCashInPerTran;
  }
  useEffect(() => {
    const input = {
      cashEntryRowId: "641",
      cashGroupId: "498",
      description: "",
      displayMode: "USED",
      estimatedValue: 0,
      frequency: null,
      frequencyStopAt: null,
      id: "12345678",
      ownerId: "266",
      projectId: "182",
      transactionDate: "2023-01-10",
      value: 2000,
      groupType: "IN",
      groupId: "503",
      entryRowId: "641"
    }
    // a(input)
  }, [])




  // change transaction child follow parant 

  const parentElement = {
    id: 1,
    value: 'initial value',
  };
  const childElement = [
    {
      id: 1,
      value: 'initial value'
    },
    {
      id: 2,
      value: 'initial value'
    }
  ]

  function updateParentAndChild(newValue: any) {
    const test: any = childElement.map(child => {
      if (child.id === parentElement.id) {
        return child.value = newValue;
      } else {
        return { ...child }
      }
    });
    return test;
  }
  // updateParentAndChild('new value');
















  // hanlde data cashOut
  const totalCashOutPerTran =
    WeeklyTableFactory.getTotalCashInPerTran(dataCashOut);
  const totalCashOutPerDay =
    WeeklyTableFactory.getTotalCashOutPerDay(totalCashOutPerTran);
  HandleSumAllTableCashOut(dataCashOut, totalCashOutPerDay, setTotalCashOut);

  // inCome with date, cashIn/cashOut
  const [gainLoss, setGainLoss] = useState<any>();
  HandleGetInCome(totalCashIn, totalCashOut, setGainLoss);
  //get first date of gain loss for display cash position
  const [firstDateGainLoss, setFirstDateGainLoss] = useState<any>();
  useEffect(() => {
    if (gainLoss) {
      setFirstDateGainLoss(first(gainLoss));
    } else {
      return;
    }
  }, [gainLoss]);

  //display mode saturday and sunday
  const [dateRangeArray, setDateRangeArray] = useState<any>();
  HanldeDisPlayMode(dateRange, weekSchedule, setDateRangeArray);

  //get List id and name of cash gorup to edit
  useEffect(() => {
    computeCashInAndCashOut.getListCashGroup(cashGroupArr, setListCashGroup);
  }, [cashGroupArr]);

  //check id for "USED" and push them into array
  useEffect(() => {
    computeCashInAndCashOut.findIdDisplay(dataSingleProject, setShowRow);
  }, [dataSingleProject]);

  // filter show
  const toggleHide = (data: any) => {
    const filterIdDisplay = showRow.filter((item: any) => item !== data?.id);
    setShowRow(filterIdDisplay);
    displayModeGroup({
      variables: {
        upsertGroupArgs: {
          groupId: data?.id,
          projectId: param?.projectId,
          upsertArgs: {
            displayMode: 'ARCHIVED',
          },
        },
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
    });
  };
  const toggleShow = (data: any) => {
    setShowRow([...(showRow as any), data?.id as any]);
    displayModeGroup({
      variables: {
        upsertGroupArgs: {
          groupId: data?.id,
          projectId: param?.projectId,
          upsertArgs: {
            displayMode: 'USED',
          },
        },
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
    });
  };
  const showTrans = (value: any, cashRow: any, cashGroup: any) => {
    setTransWithNoValue('');
    setNameDateCategory({
      name: cashRow?.name,
      transactionDate: value?.transactionDate,
      cashEntryRowId: cashRow?.id,
    });
    setListTranDetail(value?.transactions);
    setShowListTrans(true);
  };
  const showTransWithNoValue = (date: any, entryRow: any) => {
    setListTranDetail('');
    setListTranNoValue('');
    setShowListTrans(true);
    setTransWithNoValue({
      name: entryRow?.name,
      transactionDate: date,
      cashEntryRowId: entryRow?.id,
    });
    // setShowAddTransDetail(true)
  };
useCallback(() => {
  console.log("call back....")
},[])
useMemo(() => {
  console.log("memo....")
},[])
  //create and show category-group
  const showCategoryGroup = (nameCashCategory: any, categoryGroup: any) => {
    setShowCategoryGroupPopup(true);
    setListNameCategoryEdit(categoryGroup?.cashEntryRow);
    setDataCategory(categoryGroup);
    setNameCategory(nameCashCategory);
    setNameCashGroup({
      groupType: categoryGroup?.groupType,
      id: categoryGroup?.id,
      name: categoryGroup?.name,
    });
  };

  //create and show category
  const showCategoryName = (value: any) => {
    setShowAddCategoryPopup(true);
    setValueCategory(value);
    setIdCash(value?.id);
  };
  //handle show add cash group name
  const showAddGroupName = (type: any) => {
    setShowAddGroupPopup(true);
    setTypeCashGroup(type);
  };

  useEffect(() => {
    setCashPerDayIn(totalCashInPerDay);
    setCashPerDayOut(totalCashOutPerDay);
    setGainAndLoss(gainLoss);
  }, [cashPosition]);

  useEffect(() => {
    const timer = setTimeout(() => {
      seLoading(true);
    }, 300);
    return () => clearTimeout(timer);
  })
  if (error?.message === "Not found") navigate('/notFound')
  return (
    <div className="wrap-table">
      {loading && dataCashIn && dataCashOut ? (
        <table className="table-container">
          <TotalTable
            firstDateGainLoss={firstDateGainLoss}
            dateinitialCashFlow={dateInitCashFlow}
            startingBalance={startBalence}
            gainLoss={gainLoss}
            dateRangeArray={dateRangeArray}
            currencySymbol={currencySymbol}
          />
          <CashTable
            showAddGroupName={showAddGroupName}
            totalCashOutPerDay={totalCashInPerDay}
            showRow={showRow}
            toggleHide={toggleHide}
            toggleShow={toggleShow}
            showCategoryGroup={showCategoryGroup}
            showCategoryName={showCategoryName}
            dateRangeArray={dateRangeArray}
            dateInitCashFlow={dateInitCashFlow}
            currencySymbol={currencySymbol}
            showTrans={showTrans}
            showTransWithNoValue={showTransWithNoValue}
            totalCashOut={totalCashIn}
            typeCash={typeCashIn}
          />
          <CashTable
            showAddGroupName={showAddGroupName}
            totalCashOutPerDay={totalCashOutPerDay}
            showRow={showRow}
            toggleHide={toggleHide}
            toggleShow={toggleShow}
            showCategoryGroup={showCategoryGroup}
            showCategoryName={showCategoryName}
            dateRangeArray={dateRangeArray}
            dateInitCashFlow={dateInitCashFlow}
            currencySymbol={currencySymbol}
            showTrans={showTrans}
            showTransWithNoValue={showTransWithNoValue}
            totalCashOut={totalCashOut}
            typeCash={typeCashOut}
          />
        </table>
      ) : (
        <div className="loading-data">
          <LoadingData />
        </div>
      )}

      {showListTrans ? (
        <ListTransaction
          setShowListTrans={setShowListTrans}
          setShowAddTransDetail={setShowAddTransDetail}
          listTranDetail={listTranDetail}
          setShowUpdatePopup={setShowUpdatePopup}
          setListTranDetail={setListTranDetail}
          nameDateCategory={nameDateCategory}
          transWithNoValue={transWithNoValue}
          listTransNoValue={listTransNoValue}
          setListTranNoValue={setListTranNoValue}
          setTransWithNoValue={setTransWithNoValue}
          setNameDateCategory={setNameDateCategory}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {showAddTransDetail ? (
        <AddTransDetail
          setShowListTrans={setShowListTrans}
          setShowAddTransDetail={setShowAddTransDetail}
          listTranDetail={listTranDetail}
          setListTranDetail={setListTranDetail}
          transWithNoValue={transWithNoValue}
          listTransNoValue={listTransNoValue}
          setListTranNoValue={setListTranNoValue}
          nameDateCategory={nameDateCategory}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {showUpdatePopup ? (
        <UpDateTranDetail
          setShowListTrans={setShowListTrans}
          setShowUpdatePopup={setShowUpdatePopup}
          listTransNoValue={listTransNoValue}
          setListTranNoValue={setListTranNoValue}
          listTranDetail={listTranDetail}
          setListTranDetail={setListTranDetail}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {showCategoryGroupPopup ? (
        <CategorySetting
          listNameCategoryEdit={listNameCategoryEdit}
          setListNameCategoryEdit={setListNameCategoryEdit}
          nameCategory={nameCategory}
          setShowChangeGroupNamePopup={setShowChangeGroupNamePopup}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
          setShowDeletePopup={setShowDeletePopup}
          setShowAddCategoryPopup={setShowAddCategoryPopup}
        />
      ) : null}
      {showAddGroupPopup ? (
        <AddCashGroup
          typeCashGroup={typeCashGroup}
          setShowAddGroupPopup={setShowAddGroupPopup}
        />
      ) : null}
      {showAddCategory ? (
        <AddCategory
          listNameCategoryEdit={listNameCategoryEdit}
          setListNameCategoryEdit={setListNameCategoryEdit}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
          setShowAddCategoryPopup={setShowAddCategoryPopup}
          valueCategory={valueCategory}
        />
      ) : null}
      {showChangeGroupNamePopup ? (
        <ChangeGroupName
          setNameCategory={setNameCategory}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
          setShowChangeGroupNamePopup={setShowChangeGroupNamePopup}
        />
      ) : null}
      {showDeletePopup ? (
        <DeleteCategory
          listNameCategoryEdit={listNameCategoryEdit}
          setListNameCategoryEdit={setListNameCategoryEdit}
          setShowDeletePopup={setShowDeletePopup}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
        />
      ) : null}
    </div>
  );
}

export default Table;
