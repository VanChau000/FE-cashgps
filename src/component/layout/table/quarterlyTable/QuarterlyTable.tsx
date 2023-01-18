import { useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCtx } from '../../../../context/user/state';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { MonthlyTableFactory } from '../../../../models/MonthlyTableFactory';
import { QuarterlyTableFactory } from '../../../../models/QuarterlyTableFactory';
import BalanceState from '../../../common/balanceState/BalanceState';
import Table from '../../../common/layoutTable/TableLayout';
// import AddCashGroup from '../../../common/popup/addCashGroup/AddCashGroup';

export const QuarterlyTable = (props: any) => {
  const { quarterlySelected, selectedDateFromQuaterlyToMonth } = props
  const { gainAndLoss, cashPosition, cashPerDayIn, cashPerDayOut }: any =
    useContext(UserCtx);
  const param = useParams()
  const { data: dataSingleProject } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const startDate = dataSingleProject?.fetchProject?.infoProject?.startDate;
  const startBalance = dataSingleProject?.fetchProject?.infoProject?.startingBalance;

  const quarterlyFilled = QuarterlyTableFactory.fillQuarterly(quarterlySelected)

  const quarterlyText = QuarterlyTableFactory.getMonthOfQuarterlyText(new Date(quarterlyFilled || '')
  );
  const [currencySymbol, setCurrencySymbol] = useState<any>()

  const quarterly = QuarterlyTableFactory.getMonthOfQuarterly(
    new Date(new Date(quarterlyFilled || '')),
  );
  // const [toggleNetGain, setToggleNetGain] = useState(true);
  const listNetGainLoss = QuarterlyTableFactory.getDataCashBasedOnWeeksOfMonth(
    quarterly,
    gainAndLoss,
    'gain',
  );
  const listDataPosition = QuarterlyTableFactory.getDataCashBasedOnWeeksOfMonth(
    quarterly,
    cashPosition,
    'cash-position', startBalance
  );

  const listCashPerInBasedOnWeeksOfMonth =
    QuarterlyTableFactory.getDataCashPerDayBasedOnWeeksOfMonth(
      quarterly,
      cashPerDayIn,
    );

  const listCashPerOutBasedOnWeeksOfMonth =
    QuarterlyTableFactory.getDataCashPerDayBasedOnWeeksOfMonth(
      quarterly,
      cashPerDayOut,
    );
  const totalCashPerDayIn: any =
    MonthlyTableFactory.getTotalCashPerDayBasedOnWeeksOfMonth(
      listCashPerInBasedOnWeeksOfMonth,
    );
  const totalCashPerDayOut: any =
    MonthlyTableFactory.getTotalCashPerDayBasedOnWeeksOfMonth(listCashPerOutBasedOnWeeksOfMonth)
  const estimatePresentCashIn = QuarterlyTableFactory.estimatePresentive(listCashPerInBasedOnWeeksOfMonth)
  const estimatePresentCashOut = QuarterlyTableFactory.estimatePresentive(listCashPerOutBasedOnWeeksOfMonth)
  const handleSelectTransaction = (index: any, dateTimeTransaction: any) => {
    if (new Date(dateTimeTransaction) < new Date(startDate)) return
    selectedDateFromQuaterlyToMonth(quarterly[index].start)
  }
  const currentDay = new Date()
  // const [showAddGroupPopup, setShowAddGroupPopup] = useState(false)

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
              {quarterlyText?.map((item: any, index: number) => {
                return (
                  <td key={index} className={`thead-cash-content ${new Date(`${new Date(item.dayEndOfMonth).getFullYear()}-${new Date(item.dayEndOfMonth).getMonth() + 1}-${new Date(item.dayEndOfMonth).getDate()}`) < new Date(startDate) ? 'bg-grey' : ''}`}>
                    <div className='date-format'>
                      <span className={new Date(item.dayStartOfMonth) <= currentDay && new Date(item.dayEndOfMonth) >= currentDay ? `current-day-color` : ``}>
                        {item.dayStartOfMonth.toLocaleString('default', { month: 'long' })}

                      </span>
                      <h4 className={new Date(item.dayStartOfMonth) <= currentDay && new Date(item.dayEndOfMonth) >= currentDay ? `current-day-color` : ``}>
                        {`${item.dayStartOfMonth.toString().split(' ')[1]} ${item.dayStartOfMonth.toString().split(' ')[2]}`} - {`${item.dayEndOfMonth.toString().split(' ')[1]} ${item.dayEndOfMonth.toString().split(' ')[2]}`}
                      </h4>
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
                <div>
                <div>
                  {/* <img
                    src={
                      toggleNetGain
                        ? process.env.REACT_APP_CLIENT_URL + 'img/showMore.svg'
                        : process.env.REACT_APP_CLIENT_URL + 'img/hide.svg'
                    }
                    alt="arrow-down-icon || arrow-right-icon"
                    onClick={() => setToggleNetGain(!toggleNetGain)}
                  /> */}
                  <span className='text-title-category '>Net gain/loss</span>
                </div>
                </div>
              </td>
            {listNetGainLoss?.map((item: any, index: number) => {
                return (
                  <td className={`${item.data >= 0 ? 'netGain' : 'netLoss'} ${new Date(item.transaction) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}`} key={index}
                    onClick={() => handleSelectTransaction(index, item.transaction)}
                  >{Number(item.data).toLocaleString()}&nbsp;{currencySymbol}</td>
                )
              })}
          </tr>
          <tr>
            <td ><div className='cash-position text-title-category'>Cash position</div></td>
            {listDataPosition?.map((item: any, idx: number) => {
                return (
                  <td key={idx} className={`text-color-cash-position total-cash-position ${new Date(item.transaction) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}`}
                    onClick={() => handleSelectTransaction(idx, item.transaction)}
                  >{Number(item.data).toLocaleString()}&nbsp;{currencySymbol}</td>
                )
              })}
          </tr>
        </tbody>
        {/* table cash in */}
        {<Table totalCashPerDay={totalCashPerDayIn} listCashPerBasedOnWeeksOfMonth={listCashPerInBasedOnWeeksOfMonth} useFor="cash in" startDate={startDate} currencySymbol={currencySymbol} estimatePresentCash={estimatePresentCashIn} handleSelectTransaction={handleSelectTransaction} dateSplit={quarterly} />}
        {/* table cash out */}
        {<Table totalCashPerDay={totalCashPerDayOut} listCashPerBasedOnWeeksOfMonth={listCashPerOutBasedOnWeeksOfMonth} useFor="cash out" startDate={startDate} currencySymbol={currencySymbol} estimatePresentCash={estimatePresentCashOut} handleSelectTransaction={handleSelectTransaction} dateSplit={quarterly} />}
      </table>
    </div >
  )
}

export default QuarterlyTable;
