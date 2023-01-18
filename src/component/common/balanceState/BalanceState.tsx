import { useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { UserCtx } from '../../../context/user/state';
import { GETSINGLEPROJECT } from '../../../graphql/Query';
import {useParams}from 'react-router-dom'

export const BalanceState = ({ currencySymbol }: any) => {
  const param = useParams()
  const { data: dataSingleProject } = useQuery(GETSINGLEPROJECT,{
    variables: {
      projectId: param?.projectId
    }
  });
  const [startBalance, setStartBalance] = useState<any>();
  const [totalInCome, setTotalInCome] = useState<any[]>();
  const [listSum, setListSum] = useState<any[]>();
  const [dateInitCashFlow, setDateInitCashFlow] = useState<any>();
  const { gainAndLoss }: any = useContext(UserCtx);

  useEffect(() => {
    setStartBalance(
      dataSingleProject?.fetchProject?.infoProject?.startingBalance
    );
  }, [dataSingleProject, param]);
  
  useEffect(() => {
    setDateInitCashFlow(
      dataSingleProject?.fetchProject?.infoProject?.startDate,
    );
  }, [dataSingleProject]);
  // create new an aray with total cashIn/cashOut and add starting balance
  useEffect(() => {
    const newArray = [
      { transactionDate: dateInitCashFlow, result: +startBalance },
    ].concat(gainAndLoss);
    setTotalInCome(newArray);
  }, [startBalance, gainAndLoss]);

  useEffect(() => {
    const handleSum = () => {
      const result = totalInCome?.map((val: any, index: any) => {
        let sum = 0;
        let transactionDate = '';
        for (let i = 0; i < index + 1; i++) {
          sum += totalInCome[i]?.result;
          transactionDate = totalInCome[i]?.transactionDate;
        }
        return { transactionDate: transactionDate, sum: sum };
      });
      if (dateInitCashFlow) {
        result?.shift();
        setListSum(result as any);
      } else {
        setListSum(result as any);
      }
    };
    handleSum();
  }, [totalInCome]);
  
  return (
    <div className='total-balance'>
      <div className="monthly-balance">
        <div>Balance</div>
        <div>
          <span className="total-balence-money">
          {Number(listSum?.at(-1)?.sum).toLocaleString()} {currencySymbol}
          </span>
          <img
            className="total-balence-img"
            src={process.env.REACT_APP_CLIENT_URL + 'img/logoName.svg'}
            alt="logo"
          />
        </div>
      </div>
      <div className="monthly-start-balance">
        Start balance: {Number(startBalance).toLocaleString()} {currencySymbol}
      </div>
    </div>
  );
};
export default BalanceState;
