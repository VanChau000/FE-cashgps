import { useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { UserCtx } from '../../../../context/user/state';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { MonthlyTableFactory } from '../../../../models/MonthlyTableFactory';
import BalanceState from '../../../common/balanceState/BalanceState';
import Table from '../../../common/layoutTable/TableLayout';
import './MonthlyTable.scss';
import { useParams } from 'react-router-dom'

export const MonthlyTable = (props: any) => {
  const { monthSelected, selectedDateFromMonthToWeek } = props;
  const [result, setResult] = useState<Array<String>>(['']);
  const { gainAndLoss, cashPosition, cashPerDayIn, cashPerDayOut }: any =
    useContext(UserCtx);
  const param = useParams()
  const { data: dataSingleProject } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const startDate = dataSingleProject?.fetchProject?.infoProject?.startDate;
  const [currencySymbol, setCurrencySymbol] = useState<any>()
  const month = new Date(monthSelected);
  const monthYearSelected = MonthlyTableFactory.getMonthAndYearSelected(month);
  const monthSplit = MonthlyTableFactory.getWeekOfMonth(result);
  const listNetGainLossBasedOnWeeksOfMonth =
    MonthlyTableFactory.getNewDataBasedOnWeeksOfMonth(
      monthYearSelected,
      gainAndLoss,
    );
  const startBalance = dataSingleProject?.fetchProject?.infoProject?.startingBalance;
  const listDataNetGainLoss = MonthlyTableFactory.getDataBasedOnWeeksOfMonth(
    monthSplit,
    listNetGainLossBasedOnWeeksOfMonth,
    'gain',
  );
  const listDataPosition = MonthlyTableFactory.getDataBasedOnWeeksOfMonth(
    monthSplit,
    cashPosition,
    'position',
    startDate,
    startBalance
  );
  const listCashPerInBasedOnWeeksOfMonth =
    MonthlyTableFactory.getDataCashPerDayBasedOnWeeksOfMonth(
      monthSplit,
      cashPerDayIn,
    );
  const listCashPerOutBasedOnWeeksOfMonth =
    MonthlyTableFactory.getDataCashPerDayBasedOnWeeksOfMonth(
      monthSplit,
      cashPerDayOut,
    );
  const totalCashPerDayIn =
    MonthlyTableFactory.getTotalCashPerDayBasedOnWeeksOfMonth(
      listCashPerInBasedOnWeeksOfMonth,
    );
  const totalCashPerDayOut =
    MonthlyTableFactory.getTotalCashPerDayBasedOnWeeksOfMonth(listCashPerOutBasedOnWeeksOfMonth)

  const estimatePresentCashIn = MonthlyTableFactory.estimatePresentive(listCashPerInBasedOnWeeksOfMonth)
  const estimatePresentCashOut = MonthlyTableFactory.estimatePresentive(listCashPerOutBasedOnWeeksOfMonth)

  const currentDay = new Date();
  // const [showAddGroupPopup, setShowAddGroupPopup] = useState(false)
  const handleSelectTransaction = (index: any, dateTimeTransaction: any) => {
    if (new Date(dateTimeTransaction) < new Date(startDate)) return
    selectedDateFromMonthToWeek(monthSplit[index][0])
  }

  useEffect(() => {
    if (!monthSelected) return;
    const monthGender = MonthlyTableFactory.genderDayOfMonth(
      monthSelected.getFullYear(),
      monthSelected?.getMonth() + 1,
      result,
    );
    setResult(monthGender);
  }, [monthSelected]);

  useEffect(() => {
    setCurrencySymbol(dataSingleProject?.fetchProject?.infoProject?.currencySymbol);
  }, [dataSingleProject]);
  return (
    <div className="wrap-table">
      <table className="table-container">
        <thead className="thead-table">
          <tr >
            <td className='blance-total'>
              <BalanceState currencySymbol={currencySymbol} />
            </td>
            <>
              {monthSplit?.map((week: any, index: number) => {
                return (
                  <td key={index} className={`thead-cash-content ${new Date(week[week.length - 1]) < new Date(startDate) ? "bg-grey" : ""}`
                  }>
                    <div className='date-format'>
                      <span className={new Date(week[0]) <= currentDay && new Date(week[week.length - 1]) >= currentDay ? `current-day-color` : ``}>week {MonthlyTableFactory.getWeekNumber(new Date(week[1] ? week[1] : week[0]))}
                      </span>
                      <p className={new Date(week[0]) <= currentDay && new Date(week[week.length - 1]) >= currentDay ? `current-day-color` : ``}>
                        {MonthlyTableFactory.splitMonth(month.toString(), 1, ' ')}&nbsp;
                        {week[0].split('-')[2]} -&nbsp;
                        {month.toString().split(' ')[1]}&nbsp;
                        {week[monthSplit[index].length - 1].split('-')[2]}
                      </p>
                    </div>
                  </td>
                );
              })}
            </>
          </tr>
        </thead>
        <div className='space-line-16'></div>
        <tbody className="tbody-table">
          <tr className="total-tbody-tr">
            <td>
              <div className="total-tbody-first-td">
                <span className='text-title-category'>Net gain/loss</span>
              </div>
            </td>
            {listDataNetGainLoss?.map((item: any, index: number) => {
              return <td key={index} className={`${item.data >= 0 ? 'netGain' : 'netLoss'} ${new Date(item.transaction) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}`}
                onClick={() => handleSelectTransaction(index, item.transaction)}
              >{Number(item.data).toLocaleString()}&nbsp;{currencySymbol}</td>
            })}
          </tr>
          <tr>
            <td ><div className={`cash-position text-title-category`}>Cash position</div></td>
            {listDataPosition?.map((item: any, idx: number) => {
              return (
                <td key={idx} className={`text-color-cash-position total-cash-position ${new Date(item.transaction) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}`}
                  onClick={() => handleSelectTransaction(idx, item.transaction)}
                >
                  {Number(item.data).toLocaleString()}&nbsp;{currencySymbol}
                </td>
              )
            })}
          </tr>
        </tbody>
        {/* table cash in */}
        {
          <Table totalCashPerDay={totalCashPerDayIn} listCashPerBasedOnWeeksOfMonth={listCashPerInBasedOnWeeksOfMonth}
            estimatePresentCash={estimatePresentCashIn}
            useFor="cash in" startDate={startDate} currencySymbol={currencySymbol} typeCash="IN" handleSelectTransaction={handleSelectTransaction} dateSplit={monthSplit} />
        }
        {/* table cash out */}
        {
          <Table totalCashPerDay={totalCashPerDayOut} listCashPerBasedOnWeeksOfMonth={listCashPerOutBasedOnWeeksOfMonth}
            estimatePresentCash={estimatePresentCashOut} useFor="cash out" startDate={startDate} currencySymbol={currencySymbol} typeCash="OUT" handleSelectTransaction={handleSelectTransaction} dateSplit={monthSplit} />
        }
      </table>
    </div>
  );
};

export default MonthlyTable;
