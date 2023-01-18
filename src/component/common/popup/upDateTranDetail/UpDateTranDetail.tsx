import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UPDATE_TRANS_VALUE } from '../../../../graphql/Mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { UserCtx } from '../../../../context/user/state';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import CurrencyInput from 'react-currency-input-field';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddTransDetailFactory from '../../../../models/AddTransDetailFactory';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface typeTransValue {
  id: string;
  value: number | null;
  estimatedValue: number | null;
  frequency: string;
  frequencyStopAt: string;
  description: string;
}

function UpDateTranDetail({
  setShowListTrans,
  setShowUpdatePopup,
  listTranDetail,
  setListTranDetail,
  listTransNoValue,
  setListTranNoValue,
  currencySymbol
}: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const { idTransaction, setIdTransaction } = useContext(UserCtx);
  const [updateTransValue] = useMutation(UPDATE_TRANS_VALUE);
  const [showFrequency, setShowFrequency] = useState<boolean>(false);
  const [transValue, setTranValue] = useState<typeTransValue>({
    id: '',
    value: null,
    estimatedValue: null,
    frequency: '',
    frequencyStopAt: '',
    description: '',
  });
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });

  const [minDate, setMinDate] = useState<any>(new Date());

  const [startDate, setStartDate] = useState<any>(new Date(transValue.frequencyStopAt));

  const handleChangeTransValue = (e: any): void => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTranValue({
      ...transValue,
      [e.target.name]: value,
    });
  };

  const handleChangeCurrency = (value: any, nameInput: any) => {
    if (nameInput === 'value') setTranValue({ ...transValue, value: value });
    else if (nameInput === 'estimate')
      setTranValue({ ...transValue, estimatedValue: value });
  };

  const handleShowPopupTransDetail = () => {
    setIdTransaction('');
    setShowUpdatePopup(false);
    setShowListTrans(true);
  };
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])
  useEffect(() => {
    if (listTranDetail) {
      const findDataEdit = listTranDetail?.filter(
        (item: any) => item.id === idTransaction,
      );
      setTranValue({
        ...findDataEdit[0],
      });
      if (showFrequency && findDataEdit[0].frequency === "") {
        setTranValue({ ...transValue, frequency: "DAILY" })
      }

      if (!findDataEdit[0].frequencyStopAt || findDataEdit[0].frequencyStopAt === '') {
        setStartDate(new Date(findDataEdit[0].transactionDate))
      } else {
        setStartDate(new Date(findDataEdit[0].frequencyStopAt))
      }
      setMinDate(new Date(findDataEdit[0].transactionDate))


    } else {
      const findDataEdit = listTransNoValue?.filter(
        (item: any) => item.id === idTransaction,
      );
      setTranValue({
        ...findDataEdit[0],
      });
      if (findDataEdit[0].frequencyStopAt === '') {
        setStartDate(new Date(findDataEdit[0].transactionDate))
      } else {
        setStartDate(new Date(findDataEdit[0].frequencyStopAt))
      }
    }

  }, [idTransaction, showFrequency]);

  function format(n: any, currency: any) {
    if (n)
      return (
        currency +
        n.toFixed(2).replace(/./g, function (c: any, i: any, a: any) {
          return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
        })
      );
  }

  const handleChangeDate = (date: Date) => {
    setStartDate(date)
    setTranValue({
      ...transValue, frequencyStopAt: `${date?.getFullYear()}-${date?.getMonth() < 9
        ? `0${date?.getMonth() + 1}`
        : date?.getMonth() + 1
        }-${date?.getDate() < 9
          ? `0${date?.getDate()}`
          : date?.getDate()
        }`
    })
  }

  const handleSubmitTran = (e: any) => {
    e.preventDefault()
    let dataEdit: any = [];
    if (listTranDetail) {
      const dataCoppy = [...listTranDetail];
      const newDataEdit =
        dataCoppy &&
        dataCoppy.map(item => {
          if (item.id === transValue.id) {
            item = {
              id: transValue.id,
              value: parseInt(transValue.value as any) || 0,
              estimatedValue: parseInt(transValue.estimatedValue as any) || 0,
              frequency: transValue.frequency,
              frequencyStopAt: transValue.frequencyStopAt,
              description: transValue.description,
            };
          }
          return item;
        });
      dataEdit = [...newDataEdit];
      setListTranDetail([...dataEdit]);
      const newData: any = {
        id: listTranDetail[0].id,
        value: parseInt(transValue.value as any),
        estimatedValue: parseInt(transValue.estimatedValue as any),
        frequency: transValue?.frequency === '' ? null : transValue?.frequency,
        frequencyStopAt: transValue?.frequencyStopAt === '' ? null : transValue?.frequencyStopAt,
        description: transValue.description,
      };
      const a = AddTransDetailFactory.renderFrequencyTrans(newData, listTranDetail[0]?.transactionDate, listTranDetail[0]?.cashEntryRowId)

      console.log("vaoday........",
        [{
          cashTransactionId: newData.id,
          upsertArgs: {
            description: newData.description,
            estimatedValue: newData.estimatedValue,
            frequency: newData.frequency,
            frequencyStopAt: newData.frequencyStopAt,
            value: newData.value,
            transactionDate: listTranDetail[0]?.transactionDate,
            cashEntryRowId: listTranDetail[0]?.cashEntryRowId
          }
        }],
        "ahhahaahha...", a
      );

      console.log("ham ml...", AddTransDetailFactory.renderFrequencyTrans(newData, listTranDetail[0]?.transactionDate, listTranDetail[0]?.cashEntryRowId));


      updateTransValue({
        variables: {
          upsertTransactionArgs: {
            projectId: param?.projectId,
            transactions: [{
              cashTransactionId: newData.id,
              upsertArgs: {
                description: newData.description,
                estimatedValue: newData.estimatedValue,
                frequency: newData.frequency,
                frequencyStopAt: newData.frequencyStopAt,
                value: newData.value,
                transactionDate: listTranDetail[0]?.transactionDate,
                cashEntryRowId: listTranDetail[0]?.cashEntryRowId
              }
            }]


            // newData?.frequency ? [{
            //   cashTransactionId: newData.id,
            //   upsertArgs: {
            //     description: newData.description,
            //     estimatedValue: newData.estimatedValue,
            //     frequency: newData.frequency,
            //     frequencyStopAt: newData.frequencyStopAt,
            //     value: newData.value,
            //     transactionDate: listTranDetail[0]?.transactionDate,
            //     cashEntryRowId: listTranDetail[0]?.cashEntryRowId
            //   }
            // }] : AddTransDetailFactory.renderFrequencyTrans(newData, listTranDetail[0]?.transactionDate, listTranDetail[0]?.cashEntryRowId)
          }
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted: ({ createOrUpdateCashEntry: { result } }) => {
          if (result === 'Transaction was updated') {
            refetch({ projectId: param?.projectId })
            setIdTransaction('');
            setShowUpdatePopup(false);
            setShowListTrans(true);
            toast.success("Transaction has been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            setIdTransaction('');
            setShowUpdatePopup(false);
            setShowListTrans(true);
            toast.error("Transaction has not been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      });

    } else {
      const dataCoppy = [...listTransNoValue];
      const newDataEdit =
        dataCoppy &&
        dataCoppy.map(item => {
          if (item.id === transValue.id) {
            item = {
              id: transValue.id,
              value: parseInt(transValue.value as any),
              estimatedValue: parseInt(transValue.estimatedValue as any),
              frequency: transValue.frequency,
              frequencyStopAt: transValue.frequencyStopAt,
              description: transValue.description,
            };
          }
          return item;
        });
      setListTranNoValue([...newDataEdit]);

      const newData: any = {
        id: listTransNoValue[0].id,
        value: parseInt(transValue.value as any),
        estimatedValue: parseInt(transValue.estimatedValue as any),
        frequency: transValue?.frequency === '' ? null : transValue?.frequency,
        frequencyStopAt: transValue?.frequencyStopAt === '' ? null : transValue?.frequencyStopAt,
        description: transValue.description,
      };
      console.log("newData b", newData);
      updateTransValue({
        variables: {
          upsertTransactionArgs: {
            projectId: param?.projectId,
            transactions: AddTransDetailFactory.renderFrequencyTrans(newData, listTransNoValue[0]?.transactionDate, listTransNoValue[0]?.cashEntryRowId)
          }
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted: ({ createOrUpdateCashEntry: { result } }) => {
          if (result === 'Transaction was updated') {
            refetch({ projectId: param?.projectId })
            setIdTransaction('');
            setShowUpdatePopup(false);
            setShowListTrans(true);
            toast.success("Transaction has been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            setIdTransaction('');
            setShowUpdatePopup(false);
            setShowListTrans(true);
            toast.error("Transaction has not been updated'", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      });
    }
  };
  console.log("startDate", startDate)
  HandleCloseModal(modalRef, setShowUpdatePopup);
  return (
    <>
      <div id="addTrans-detail-container">
        <form onSubmit={handleSubmitTran}>
          <div className="addTrans-detail" ref={modalRef}>
            <div className="addTrans-detail-header">
              <h4>Update transaction</h4>
              <img
                onClick={() => handleShowPopupTransDetail()}
                src={
                  process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'
                }
                alt="logo"
              />
            </div>
            <div className="addTrans-detail-input">
              <div className="addTrans-input-number">
                <div>
                  <h4>Amount</h4>
                  <CurrencyInput
                    ref={inputRef}
                    name="value"
                    maxLength={15}
                    decimalsLimit={2}
                    value={transValue.value?.toString()}
                    onValueChange={(value: any, name: any) =>
                      handleChangeCurrency(value, name)
                    }></CurrencyInput>
                  <h5 className="moneyIcon"> {currencySymbol}</h5>
                </div>
                <div>
                  <h4>Estimated</h4>
                  <CurrencyInput
                    name="estimate"
                    maxLength={15}
                    decimalsLimit={2}
                    value={transValue.estimatedValue?.toString()}
                    onValueChange={(value: any, name: any) =>
                      handleChangeCurrency(value, name)
                    }></CurrencyInput>
                  <h5 className="moneyIcon-estimated"> {currencySymbol}</h5>
                </div>
              </div>
              <div className="addTrans-input-checkbox">
                <label key="frequency-transaction">
                  <input
                    onChange={e => setShowFrequency(e.target.checked as any)}
                    checked={showFrequency}
                    value={showFrequency as any}
                    type="checkbox"
                    name="showFrequency"
                  />
                  <span>Frequency transaction</span></label>
              </div>
              {showFrequency ? (
                <>
                  <div className="addTrans-input-radio">
                    <div className="input-radio">
                      <label key="daily-frequency">
                        <input
                          type="radio"
                          name="frequency"
                          value="DAILY"
                          checked={transValue.frequency === 'DAILY'}
                          onChange={handleChangeTransValue}
                        />
                        <span>Daily</span>
                      </label>
                    </div>
                    <div className="input-radio">
                      <label key="weekly-frequency">
                        <input
                          type="radio"
                          name="frequency"
                          value="WEEKLY"
                          checked={transValue.frequency === 'WEEKLY'}
                          onChange={handleChangeTransValue}
                        />
                        <span>Weekly</span>
                      </label>
                    </div>
                    <div className="input-radio">
                      <label key="monthly-frequency">
                        <input
                          type="radio"
                          name="frequency"
                          value="MONTHLY"
                          checked={transValue.frequency === 'MONTHLY'}
                          onChange={handleChangeTransValue}
                        />
                        <span>Monthly</span>
                      </label>
                    </div>
                    <div className="input-radio">
                      <label key="annual-frequency">
                        <input
                          type="radio"
                          name="frequency"
                          value="ANNUALY"
                          checked={transValue.frequency === 'ANNUALY'}
                          onChange={handleChangeTransValue}
                        />
                        <span>Annually</span>
                      </label>
                    </div>
                  </div>
                  <div className="addTrans-input-date">
                    <h4>Frequency stops at</h4>
                    <input
                      type="date"
                      value={`${startDate?.getFullYear()}-${startDate?.getMonth() < 9 ? `0${startDate?.getMonth() + 1}` : startDate?.getMonth() + 1}-${startDate?.getDate() < 9 ? `0${startDate?.getDate()}` : startDate?.getDate()}`}
                      name="frequencyStopAt"
                      readOnly
                    />
                    <DatePicker
                      todayButton="Today"
                      id="datePickerTransaction"
                      selected={startDate}
                      onChange={(date: Date) => handleChangeDate(date)}
                      closeOnScroll={true}
                      minDate={minDate}
                    />
                    <label className="calender-btn-transaction" htmlFor="datePickerTransaction">
                      <img
                        src={process.env.REACT_APP_CLIENT_URL + 'img/calender.svg'}
                        alt="calender"
                      />
                    </label>
                  </div>
                </>
              ) : null}
              <div className="addTrans-input-textBox">
                <h4>Note</h4>
                <div>
                  <textarea
                    name="description"
                    maxLength={250}
                    value={transValue.description}
                    onChange={handleChangeTransValue}
                  />
                  <span>{transValue.description.length}/250</span>
                </div>
              </div>
              <button
                disabled={
                  (transValue.value as any) <= 0 &&
                  (transValue.estimatedValue as any) <= 0
                }
                onClick={handleSubmitTran}
                className={
                  (transValue.value as any > 0 || transValue.estimatedValue as any > 0)
                    ? 'btn-addTrans-detail active-btn-detail'
                    : 'btn-addTrans-detail'
                }>
                Update
              </button>
            </div>
          </div>
        </form>

      </div>
    </>
  );
}

export default UpDateTranDetail;
