import React, { useRef, useState } from 'react'
import { HandleCloseModal } from '../../../../utils/ModalClose'
import LoadingData from '../../loadingData/LoadingData'
import './Billing.scss'

function Billing({ setIsOpenBilling, billsHistory, loading }: any) {

  const billingRef: any = useRef()
  const [toggleBillsHistory, setToggleBillsHistory] = useState(false)
  const handleShowTransactionHistory = () => {
    if (billsHistory.length === 0) return
    setToggleBillsHistory(!toggleBillsHistory)
  }
  const renderBill = () => {
    return (
      <>
        <p className='title-render-bill'>Bills</p>
        {
          billsHistory.length > 0 ? <>
            <p>You have bills that will be paid automatically and on {billsHistory && billsHistory[0]?.end.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            <div className='current-bill'>
              <p>Monthly Basic Plan</p>
              <p>{billsHistory && billsHistory[0]?.priceSubscription} | Next payment: {billsHistory && billsHistory[0]?.end.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </> : <p className='no-history-bill'>There are no charges on your upcoming bill.</p>
        }
      </>
    )
  }
  HandleCloseModal(billingRef, setIsOpenBilling as any);

  return (
    <div className="wrap-billing" >
      {
        loading ?
          <div className="container-billing" style={{"height":"500px", "display":"flex", "justifyContent":"center", "alignItems":"center"}} > <LoadingData /></div>
          :
          <div className="container-billing" ref={billingRef}>
            <div className="billing-header">
              <p>Billing</p>
              <img
                onClick={() => setIsOpenBilling(false)}
                src={process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'}
                alt="close-icon"
              />
            </div>
            <div className='billing-body'>
              <div className="bills">
                {renderBill()}
              </div>
              {billsHistory.length > 0 ? <div className='transaction-history' onClick={handleShowTransactionHistory}>
                <p>Transactions history</p>
                {toggleBillsHistory ? <img src={process.env.REACT_APP_CLIENT_URL + 'img/arrow-up-blue.svg'}
                  alt="arrow-up-icon" /> : <img src={process.env.REACT_APP_CLIENT_URL + 'img/arrow-down-blue.svg'}
                    alt="arrow-up-icon" />}
              </div> : null}

              <div className={toggleBillsHistory ? `wrap-history-transaction` : "hide"}>
                {billsHistory?.map((item: any) => {
                  return (
                    <div className="history-transaction">
                      <div>
                        <p>{item?.typeSubscription} Plan, {item?.start.toLocaleDateString("en-US", { year: 'numeric', month: 'short' })}</p>
                        <p className='transaction-price'>{item?.priceSubscription}</p>
                      </div>
                      <p>
                        {item?.start.toLocaleDateString("en-US", { hour: 'numeric', minute: 'numeric' }).split(',')[1]}
                        &nbsp;&nbsp;
                        {item?.start.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  )
                })
                }
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default Billing