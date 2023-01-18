import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCtx } from '../../../../context/user/state';
import { DELETE_TRANS_VALUE } from '../../../../graphql/Mutation';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import { toast } from 'react-toastify';
import './ListTransaction.scss';

function ListTransaction({
  setShowListTrans,
  setShowAddTransDetail,
  listTranDetail,
  setListTranDetail,
  setShowUpdatePopup,
  nameDateCategory,
  setNameDateCategory,
  transWithNoValue,
  listTransNoValue,
  setListTranNoValue,
  setTransWithNoValue,
  currencySymbol
}: any) {
  const { setIdTransaction } = useContext(UserCtx);
  // const [toastActive, setToastActive] = useState(false)
  let modalRef: any = useRef();
  const param = useParams()
  const [idEdit, setIdEdit] = useState(null);
  const [tooglePopup, setTooglePopup] = useState(false);
  const [totalValue, setTotalValue] = useState<any>();
  const [totalEstimated, setTotalEstimated] = useState<any>();
  const [totalNoValue, setTotalNoValue] = useState<any>();
  const [totalNoEstimated, setTotalNoEstimated] = useState<any>();
  const [deleteTransaciton] = useMutation(DELETE_TRANS_VALUE);
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });

  useEffect(() => {
    const getTotalValue = listTranDetail
      ? listTranDetail?.reduce((acc: any, value: any) => {
        return acc + value.value;
      }, 0)
      : 0;
    const getTotalEstimated = listTranDetail
      ? listTranDetail?.reduce((acc: any, value: any) => {
        return acc + value.estimatedValue;
      }, 0)
      : 0;
    setTotalValue(Math.floor(+getTotalValue) as any);
    setTotalEstimated(Math.floor(+getTotalEstimated) as any);
  }, [listTranDetail, setTotalValue, setTotalEstimated]);
  useEffect(() => {
    const getTotalNoValue = listTransNoValue
      ? listTransNoValue?.reduce((acc: any, value: any) => {
        return acc + value?.value;
      }, 0)
      : 0;
    const getTotalNoEstimated = listTransNoValue
      ? listTransNoValue?.reduce((acc: any, value: any) => {
        return acc + value?.estimatedValue;
      }, 0)
      : 0;
    setTotalNoValue(Math.floor(+getTotalNoValue) as any);
    setTotalNoEstimated(Math.floor(+getTotalNoEstimated) as any);
  }, [setTotalNoValue, setTotalNoEstimated, listTransNoValue]);

  const closePopupTrans = () => {
    setNameDateCategory('');
    setTransWithNoValue('');
    if (transWithNoValue) {
      setListTranNoValue('');
    } else if (nameDateCategory) {
      setListTranDetail('');
    }
    setShowListTrans(false);
  };

  const showPopupTransDetail = () => {
    setShowAddTransDetail(true);
    setShowListTrans(false);
  };

  const handleTogglePopup = (id: any) => {
    setIdEdit(id);
    setTooglePopup(!tooglePopup);
  };

  const handleDelete = (id: any) => {
    const newArray = listTranDetail?.filter((item: any) => item?.id !== id);
    setListTranDetail(newArray);
    // const newArrayNovalue = listTransNoValue?.filter((item: any) => item?.id !== id);
    // setListTranNoValue(newArrayNovalue)

    deleteTransaciton({
      variables: {
        deleteTransactionArgs: {
          id,
        },
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
      onCompleted: ({ deleteCashTransaction: { messageOfDeletion } }) => {
        if (messageOfDeletion === 'Cash transaction was removed') {
          refetch({ projectId: param?.projectId })
          toast.success("Transaction has been deleted", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error("Transaction has not been deleted", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    });

  };
  const handleEditTran = (id: any) => {
    setIdTransaction(id);
    setShowUpdatePopup(true);
    setShowListTrans(false);
  };
  const handleEditTranNoValue = (id: any) => {
    setIdTransaction(id);
    setShowUpdatePopup(true);
    setShowListTrans(false);
  };
  const handleDeleteNoValue = (id: any) => {
    // const newArray = listTranDetail?.filter((item: any) => item?.id !== id);
    // setListTranDetail(newArray);
    const newArrayNovalue = listTransNoValue?.filter(
      (item: any) => item?.id !== id,
    );
    setListTranNoValue(newArrayNovalue);
    deleteTransaciton({
      variables: {
        deleteTransactionArgs: {
          id,
        },
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
      onCompleted: ({ deleteCashTransaction: { messageOfDeletion } }) => {
        if (messageOfDeletion === 'Cash transaction was removed') {
          refetch({ projectId: param?.projectId })
          toast.success("Transaction has been deleted", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error("Transaction has not been deleted", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    });
  };

  const date = new Date(
    nameDateCategory?.transactionDate
      ? nameDateCategory?.transactionDate
      : transWithNoValue?.transactionDate,
  ).toUTCString();

  const formatDate = date.split(' ')[2] + ' ' + date.split(' ')[1];
  const year = new Date(
    nameDateCategory?.transactionDate
      ? nameDateCategory?.transactionDate
      : transWithNoValue?.transactionDate,
  ).getFullYear();
  HandleCloseModal(modalRef, setShowListTrans);
  return (
    <>
      <div>
        <div
          id="newTransaction-container"
          onClick={() => setTooglePopup(!tooglePopup)}>
          <div className="newTransaction-content" ref={modalRef}>
            <div className="newTransaction-header">
              <div>
                <h4>
                  {' '}
                  {transWithNoValue?.name
                    ? transWithNoValue?.name
                    : nameDateCategory?.name}{' '}
                  | {formatDate}, {year}
                </h4>
              </div>
              <div className="btn-newTransaction">
                {
                  param?.permission === "VIEW" ? null :
                    <img
                      className="btn-addTransaction"
                      onClick={showPopupTransDetail}
                      src={
                        process.env.REACT_APP_CLIENT_URL +
                        'img/addNewtransaction.svg'
                      }
                      alt="logo"
                    />
                }
                <img
                  className="btn-closeTransaction"
                  onClick={closePopupTrans}
                  src={
                    process.env.REACT_APP_CLIENT_URL +
                    'img/closeNewtransaction.svg'
                  }
                  alt="logo"
                />
              </div>
            </div>
            <div
              className="newTransaction-main"
              onClick={() => setTooglePopup(!tooglePopup)}>
              {transWithNoValue ? (
                <>
                  {transWithNoValue && listTransNoValue?.length === 0 ? (
                    <>
                      <div className="newTransaction-main-noTransaction">
                        <h4 className="noTransaction">
                          You still have not had any {transWithNoValue?.name ? transWithNoValue?.name : nameDateCategory?.name} transaction
                        </h4>
                        {
                          param?.permission === "VIEW" ? null :
                            <h4
                              className="addTransaction"
                              onClick={showPopupTransDetail}>
                              + Add transaction
                            </h4>
                        }
                      </div>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  {listTranDetail?.length > 0 ? (
                    <>
                        {listTranDetail?.map((tran: any, tranId: any) => {
                        return (
                          <>
                            <div key={tranId} className="item-tran">
                              <div className="item-tran-cotainer">
                                <span className="item-tran-money">
                                  {Number(tran.value).toLocaleString()} {currencySymbol}
                                </span>
                                <span className="line-between"></span>
                                <span className="item-tran-estimated">
                                  {Number(tran.estimatedValue).toLocaleString()} {currencySymbol}
                                </span>
                              </div>
                              <div className='item-desctiption'>
                                <span className="item-tran-note">
                                  {tran.description}
                                </span>
                                {
                                  tran.frequency ? <span className='item-tran-frequency'>
                                    {tran.frequency.toLowerCase()}
                                  </span> : null
                                }
                              </div>
                              {
                                param?.permission === "VIEW" ? null :
                                  <img
                                    onClick={() => handleTogglePopup(tranId)}
                                    className="item-tran-edit"
                                    src={
                                      process.env.REACT_APP_CLIENT_URL +
                                      'img/moreRow.svg'
                                    }
                                    alt="logo"
                                  />
                              }
                              {idEdit === tranId && tooglePopup === true ? (
                                <div className="popupEdit-trans-detail">
                                  <div
                                    className="edit-trans-detail"
                                    onClick={() => handleEditTran(tran.id)}>
                                    Edit transaction
                                  </div>
                                  <div
                                    className="delete-trans-detail"
                                    onClick={() => handleDelete(tran.id)}>
                                    Delete transaction
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </>
                        );
                      })}
                    </>
                  ) : (
                    <div className="newTransaction-main-noTransaction">
                      <h4 className="noTransaction">
                        You still have not had any Investment transaction
                      </h4>
                      {
                        param?.permission === "VIEW" ? null :
                          <h4
                            className="addTransaction"
                            onClick={showPopupTransDetail}>
                            + Add transaction
                          </h4>
                      }
                    </div>
                  )}
                </>
              )}
              {transWithNoValue && listTransNoValue?.length > 0 ? (
                <>
                  {listTransNoValue?.map((tran: any, tranId: any) => {
                    return (
                      <>
                        <div key={tranId} className="item-tran">
                          <div className="item-tran-cotainer">
                            <span className="item-tran-money">
                              {Number(tran.value).toLocaleString()} {currencySymbol}
                            </span>
                            <span className="line-between"></span>
                            <span className="item-tran-estimated">
                              {Number(tran.estimatedValue).toLocaleString()} {currencySymbol}
                            </span>
                          </div>
                          <div className='item-desctiption'>
                            <span className="item-tran-note">
                              {tran.description}
                            </span>
                            {
                              tran.frequency ? <span className='item-tran-frequency'>
                                {tran.frequency.toLowerCase()}
                              </span> : null
                            }
                          </div>
                          {
                            param?.permission === "VIEW" ? null :
                              <img
                                onClick={() => handleTogglePopup(tranId)}
                                className="item-tran-edit"
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/moreRow.svg'
                                }
                                alt="logo"
                              />
                          }
                          {idEdit === tranId && tooglePopup === true ? (
                            <div className="popupEdit-trans-detail">
                              <div
                                className="edit-trans-detail"
                                onClick={() => handleEditTranNoValue(tran.id)}>
                                Edit transaction
                              </div>
                              <div
                                className="delete-trans-detail"
                                onClick={() => handleDeleteNoValue(tran.id)}>
                                Delete transaction
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </>
                    );
                  })}
                </>
              ) : null}
            </div>
            <div className="newTransaction-footer">
              {transWithNoValue && listTransNoValue ? (
                <>
                  <div className="total-Transaction-container">
                    <div className="total">
                      Total: {totalNoValue} {currencySymbol} <span>-</span>
                    </div>
                    <span className="line-total" />
                    <div className="estimated">
                      Estimated: {totalNoEstimated} {currencySymbol}<span></span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="total-Transaction-container">
                    <div className="total">
                      Total: {Number(totalValue)?.toLocaleString()} {currencySymbol}
                      {/* <span>-</span> */}
                    </div>
                    <span className="line-total" />
                    <div className="estimated">
                      Estimated: {Number(totalEstimated)?.toLocaleString()} {currencySymbol}
                      <span></span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListTransaction;
