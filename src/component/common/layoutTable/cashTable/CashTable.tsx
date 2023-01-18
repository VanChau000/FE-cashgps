import { useParams } from "react-router-dom";

function CashTable({
    showAddGroupName,
    totalCashOutPerDay,
    showRow,
    toggleHide,
    toggleShow,
    showCategoryGroup,
    showCategoryName,
    dateRangeArray,
    dateInitCashFlow,
    currencySymbol,
    showTrans,
    showTransWithNoValue,
    totalCashOut,
    typeCash
}: any) {
    const param = useParams()
    return (
        <>
            <tbody className='tbody-table'>
                {
                    param?.permission === "VIEW" ?
                        <tr>
                            <td >
                                <div className="cash-title">
                                    <span> {typeCash === "IN" ? "Cash in" : "Cash out"}</span>
                                    {/* <img src={process.env.REACT_APP_CLIENT_URL + 'img/AddgroupIcon.svg'} alt="add group" /> */}
                                </div>
                            </td>
                        </tr>
                        :
                        <tr>
                            <td onClick={() => showAddGroupName(typeCash === "IN" ? 'IN' : 'OUT')}>
                                <div className="cash-title">
                                    <span> {typeCash === "IN" ? "Cash in" : "Cash out"}</span>
                                    <img src={process.env.REACT_APP_CLIENT_URL + 'img/AddgroupIcon.svg'} alt="add group" />
                                </div>
                            </td>
                        </tr>
                }

          {totalCashOutPerDay?.map((data: any, index: any) => {
                    return (
                        <>
                            <tr key={index} className='font-size-14 font-weight-700 text-title-category'>
                                <td>
                                    <div className="thead-table-edit">
                              <div>
                                {data?.cashEntryRow.length > 0 ? <>
                                  {showRow?.includes(data.id) ? (
                                    <>
                                      <img onClick={() => toggleHide(data)} src={process.env.REACT_APP_CLIENT_URL + 'img/showMore.svg'}
                                        alt="logo"
                                      />
                                      <span style={{ cursor: 'pointer' }}
                                        onClick={() => toggleHide(data)}>
                                        {data.name}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <img onClick={() => toggleShow(data)} src={process.env.REACT_APP_CLIENT_URL + 'img/hide.svg'}
                                        alt="logo"
                                      />
                                      <span style={{ cursor: 'pointer' }}
                                        onClick={() => toggleShow(data)}>
                                        {data.name}
                                      </span>
                                    </>
                                  )}
                                </> : <>
                                  <img className="toggle-show-hide-img" src={process.env.REACT_APP_CLIENT_URL + 'img/hide.svg'} alt="logo" />
                                  <span style={{ cursor: 'default' }}> {data.name} </span>
                                </>}

                                        </div>
                                        {
                                            param?.permission === "VIEW" ? null :
                                                <div>
                                                    <img onClick={() => showCategoryGroup(data.name, data)}
                                                        src={process.env.REACT_APP_CLIENT_URL + 'img/more.svg'
                                                        }
                                                        alt="logo"
                                                    />
                                                    <img
                                                        onClick={() => showCategoryName(data)}
                                                        className="addBlur"
                                                        src={process.env.REACT_APP_CLIENT_URL + 'img/addBlur.svg'
                                                        }
                                                        alt="logo"
                                                    />
                                                </div>
                                        }

                                    </div>
                                </td>
                                {dateRangeArray?.map((date: any, dateIndex: any) => {
                                    return (
                                        <>
                                            {date?.transactionDate < dateInitCashFlow ? (
                                                <td key={dateIndex} className="bg-grey cursor-default"></td>
                                            ) : (
                                                <>
                                                    {data?.totalCashPerDay?.find(
                                                        (e: any) => e.transactionDate === date?.transactionDate) ? (
                                                        <td key={date?.transactionDate} className="cursor-default">
                                                            {Number(data?.totalCashPerDay?.find((e: any) => e.transactionDate === date.transactionDate)?.totalTransaction).toLocaleString()} {currencySymbol}
                                                        </td>
                                                    ) : (
                                                        <td key={date?.transactionDate} className="cursor-default">0 {currencySymbol}</td>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    );
                                })}
                            </tr>
                            {showRow?.includes(data.id) ? (
                                <>
                                    {data?.cashEntryRow?.map((cash: any, cahIndex: any) => {

                                        return (
                                            <>
                                                {cash?.displayMode === 'USED' ? (
                                                    <tr key={cash?.id} >
                                                        <td><div className='sub-category'>{cash?.name}</div></td>
                                                        {dateRangeArray?.map(
                                                            (date: any, dateIndex: any) => {
                                                                return (
                                                                    <>
                                                                        {date?.transactionDate < dateInitCashFlow ? <td key={dateIndex} className="bg-grey cursor-default"></td>
                                                                            :
                                                                            cash?.transactions?.find((e: any) => e.transactionDate === date?.transactionDate
                                                                            ) ? (
                                                                                <>
                                                                                    <td className="td-value-tran bg-white-hover"
                                                                                        key={date?.transactionDate}
                                                                                        onClick={() => showTrans(cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate), cash, data)}>
                                                                                        {
                                                                                            cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).totalValue.total === 0 ? <span>-</span> :
                                                                                                `${Number(cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).totalValue.total).toLocaleString()} ${currencySymbol}`
                                                                                        }
                                                                                        <span className="td-estimated-tran">
                                                                                            {cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).totalEstimated === 0 ? null :
                                                                                                `${Number(cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).totalEstimated).toLocaleString()} ${currencySymbol}`
                                                                                            }
                                                                                        </span>
                                                                                        {cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).totalValue.total &&
                                                                                            cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).totalEstimated ? (
                                                                                            <>
                                                                                                <div className='percent'>
                                                                                                    {cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).percent > 0 ? (
                                                                                                        <span className="td-percen-tran-red">
                                                                                                            <img className='img-td-percen-tran-red' src={process.env.REACT_APP_CLIENT_URL + 'img/negativeIcon.svg'} alt="negativeIcon" />
                                                                                                            {cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).percent} %
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <span className="td-percen-tran-blue">
                                                                                                            <img className='img-td-percen-tran-blue' src={process.env.REACT_APP_CLIENT_URL + 'img/positiveIcon.svg'} alt="positiveIcon" />
                                                                                                            {Math.abs(cash?.transactions?.find((e: any) => e.transactionDate === date.transactionDate).percent,)} %
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </>
                                                                                        ) : null}
                                                                                    </td>
                                                                                </>
                                                                            ) : (
                                                                                <td className="bg-white-hover" onClick={() => showTransWithNoValue(date?.transactionDate, cash)}>-</td>
                                                                            )}
                                                                    </>
                                                                );
                                                            },
                                                        )}
                                                    </tr>
                                                ) : null}
                                            </>
                                        );
                                    })}
                                </>
                            ) : null}
                        </>
                    );
                })}

                <tr>
                    <td><div className='total-cash font-weight-600'>{typeCash === "IN" ? "Total cash in" : "Total cash out"}</div></td>
                    {dateRangeArray?.map((date: any, dateIndex: any) => {
                        return (
                            date?.transactionDate < dateInitCashFlow ? <td key={dateIndex} className="bg-grey cursor-default"> </td> :
                                totalCashOut?.find(
                                    (e: any) => e.date === date.transactionDate,
                                ) ? (
                                    <td key={date?.transactionDate} className={typeCash === "IN" ? 'total-cash-in cursor-default' : 'total-cash-out cursor-default'}>
                                        {Number(
                                            totalCashOut?.find(
                                                (e: any) => e.date === date.transactionDate,
                                            )?.[typeCash === "IN" ? "totalCashIn" : "totalCashOut"],
                                        ).toLocaleString()} {currencySymbol}
                                    </td>
                                ) : (
                                    <td className={typeCash === "IN" ? 'total-cash-in cursor-default' : 'total-cash-out cursor-default'}>0 {currencySymbol} </td>
                                )
                        )
                    })}
                </tr>

            </tbody>
        </>
    )
}

export default CashTable