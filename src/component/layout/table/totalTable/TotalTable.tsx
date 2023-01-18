import { useContext, useEffect, useState } from 'react';
import { computeCashPositionAndGainLoss } from './index';
import { UserCtx } from '../../../../context/user/state';
import BalanceState from '../../../common/balanceState/BalanceState';
import './TotalTable.scss';

function TotalTable({
  firstDateGainLoss,
  dateinitialCashFlow,
  startingBalance,
  gainLoss,
  dateRangeArray,
  currencySymbol
}: any) {
  const { setCashPosition } = useContext(UserCtx);
  const [showRow, setShowRow] = useState(true);
  const [totalInCome, setTotalInCome] = useState<any[]>();
  const [listSum, setListSum] = useState<any>();
  const [cashPositionValue, setCashPositionValue] = useState<any>();
  const [newListSum, setNewListSum] = useState<any>();
  const [fillValueToGainLoss, setFillValueToGainLoss] = useState<any>();
  const [gainLossDisplay, setGainLossDisplay] = useState<any>();
  const toggleRow = () => {
    setShowRow(!showRow);
  };
  //format date to display
  const formatDateToDisplay =
    computeCashPositionAndGainLoss.formatDate(dateRangeArray);

  // create new an array with total cashposition and add starting balance
  useEffect(() => {
    computeCashPositionAndGainLoss.newArrayGainLoss(
      dateinitialCashFlow,
      startingBalance,
      setTotalInCome,
      gainLoss,
    );
  }, [startingBalance, gainLoss]);

  // fill value in totalInCome that have no value to display
  useEffect(() => {
    computeCashPositionAndGainLoss.fillTransactionToDate(
      totalInCome,
      dateinitialCashFlow,
      setListSum,
    );
  }, [totalInCome]);

  //filter cash position follow daterange input
  useEffect(() => {
    computeCashPositionAndGainLoss.tranformCashPosition(
      listSum,
      dateRangeArray,
      firstDateGainLoss,
      startingBalance,
      gainLoss,
      setNewListSum,
    );
  }, [listSum, dateRangeArray]);

  //dis play UI with new array cash position
  useEffect(() => {
    computeCashPositionAndGainLoss.fillterCashPositionToDisplay(
      dateRangeArray,
      newListSum,
      setCashPositionValue,
    );
  }, [newListSum]);

  // fill trantion to date gianloss that have no value
  useEffect(() => {
    computeCashPositionAndGainLoss.fillGainLossTodate(
      gainLoss,
      dateRangeArray,
      setFillValueToGainLoss,
    );
  }, [gainLoss, dateRangeArray]);
  // filter gianlos to display UI
  useEffect(() => {
    computeCashPositionAndGainLoss.fillterGainLossToDisplay(
      dateRangeArray,
      fillValueToGainLoss,
      setGainLossDisplay,
    );
  }, [dateRangeArray, fillValueToGainLoss]);
  // push list cash position to local to handle monthly and quaterly
  useEffect(() => {
    setCashPosition(listSum);
    setCashPositionValue(listSum);
  }, [listSum]);
  return (
    <>
      <thead className="thead-table">
        <tr>
          <td className='blance-total'>
            <BalanceState currencySymbol={currencySymbol} />
          </td>
          {formatDateToDisplay?.map((date: any) => {
            return (
              <>
                {+new Date(date?.dateTrasnSaction) <
                  +new Date(dateinitialCashFlow) ? (
                  <td className="thead-cash-content bg-grey">
                    <div className='date-format'>
                      <span >{date?.dayFormat}</span>
                      <p>{date?.formatDate}</p>
                    </div>
                  </td>
                ) : (
                  <td className='thead-cash-content'>
                    {+new Date(date?.dateTrasnSaction) ===
                      +new Date(date?.today) ? (
                      <div className='date-format current-day-color'>
                        <span className='current-day-color'>
                          {date?.dayFormat}
                        </span>
                        <p>
                          {date?.formatDate}
                        </p>
                      </div>
                    ) : (
                      <div className='date-format'>
                        <span>{date?.dayFormat}</span>
                        <p>{date?.formatDate}</p>
                      </div>
                    )}
                  </td>
                )}
              </>
            );
          })}
        </tr>
      </thead>
      <div className='space-line-16'></div>
      <tbody className="total-tbody">
        <tr className="total-tbody-tr">
          <td>
            <div className="total-tbody-first-td">
              {/* <img
                  onClick={toggleRow}
                  src={process.env.REACT_APP_CLIENT_URL + 'img/showMore.svg'}
                  alt="logo"
                /> */}
              <span className='text-title-category'>Net gain/loss</span>
            </div>
          </td>
          {gainLossDisplay?.map((value: any, dateIndex: any) => {
            return value?.transactionDate < dateinitialCashFlow ? (
              <td className="bg-grey cursor-default"> </td>
            ) : value?.result < 0 ? (
              // <td className="bg-red"> -{currencySymbol} {Number((value?.result) * -1).toLocaleString()}</td>
              <td key={value?.result} className="bg-red cursor-default">{Number((value?.result)).toLocaleString()} {currencySymbol}</td>
            ) : (
              <td className="bg-green cursor-default">{Number(value?.result).toLocaleString()} {currencySymbol}</td>
            );
          })}
        </tr>
        {showRow ? (
          <tr>
            <td className="total-cash-position"><div className="total-tbody-first-td"><span className='text-title-category'>Cash position</span></div></td>
            {cashPositionValue?.map((value: any) => {
              return value?.transactionDate < dateinitialCashFlow ? (
                <td className="bg-grey cursor-default"> </td>
              ) : (
                <td className="total-cash-position cursor-default">{Number(value?.sum).toLocaleString()} {currencySymbol} </td>
              );
            })}
          </tr>
        ) : null}
      </tbody>
    </>
  );
}

export default TotalTable;
