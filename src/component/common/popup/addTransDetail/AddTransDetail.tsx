import React, { useEffect, useState, useContext, useRef } from 'react';
import { ADD_TRANS_VALUE } from '../../../../graphql/Mutation';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { v4 as uuidv4 } from 'uuid';
import './AddTransDetail.scss';
import { useMutation, useQuery } from '@apollo/client';
import { UserCtx } from '../../../../context/user/state';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import CurrencyInput from 'react-currency-input-field';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom"
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

function AddTransDetail({
  setShowAddTransDetail,
  setShowListTrans,
  listTranDetail,
  setListTranDetail,
  transWithNoValue,
  setListTranNoValue,
  listTransNoValue,
  nameDateCategory,
  currencySymbol
}: any) {
  const { setIdTransaction} =
    useContext(UserCtx);
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const [addTransValue] = useMutation(ADD_TRANS_VALUE);
  const [showFrequency, setShowFrequency] = useState<boolean>(false);
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });


  const [transValue, setTranValue] = useState<typeTransValue>({
    id: '',
    value: null,
    estimatedValue: null,
    frequency: '',
    frequencyStopAt: '',
    description: '',
  });
  const [startDate, setStartDate] = useState<any>(new Date());

  const handleChangeTransValue = (e: any): void => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTranValue({
      ...transValue,
      [e.target.name]: value,
    });
  };
  const handleShowPopupTransDetail = () => {
    setIdTransaction('');
    setShowAddTransDetail(false);
    setShowListTrans(true);
  };

  const handleChangeCurrency = (value: any, nameInput: any) => {
    if (nameInput === 'value') setTranValue({ ...transValue, value: value });
    else if (nameInput === 'estimate')
      setTranValue({ ...transValue, estimatedValue: value });
  };
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (showFrequency === false) {
      setTranValue({
        ...transValue,
        frequency: '',
        frequencyStopAt: '',
      });
      // setStartDate('')
    }
  }, [showFrequency]);

  const handleSubmitTran = (e: any) => {
    e.preventDefault()
    const idTran: any = uuidv4();
    const newData: any = {
      id: idTran,
      value: parseInt(transValue.value as any) || 0,
      estimatedValue: parseInt(transValue.estimatedValue as any) || 0,
      frequency: transValue.frequency,
      frequencyStopAt: transValue.frequencyStopAt,
      description: transValue.description,
    };
    if (transWithNoValue) {
      // setListTranDetail([...newListTranDetail, newData]);
      setListTranNoValue([...listTransNoValue, newData]);
    } else {
      setListTranDetail([...listTranDetail, newData]);
    }
    addTransValue({
      variables: {
        upsertTransactionArgs: {
          projectId: param?.projectId,
          transactions: AddTransDetailFactory.renderFrequencyTrans(newData, transWithNoValue?.transactionDate ||
            nameDateCategory?.transactionDate, transWithNoValue.cashEntryRowId || nameDateCategory?.cashEntryRowId)
        }
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
      onCompleted: ({ createOrUpdateCashEntry: { result } }) => {
        if (result === 'Transaction was inserted') {
          refetch({ projectId: param?.projectId })
          setShowAddTransDetail(false);
          setShowListTrans(true);
          toast.success("Transaction has been created", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setStartDate('');
          setTranValue(Object(null));
          // setTransWithNoValue('')
        } else {
          setShowAddTransDetail(false);
          setShowListTrans(true);
          toast.error("Transaction has not been created", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setStartDate('');
          setTranValue(Object(null));
          // setTransWithNoValue('')
        }
      }
    });

  };




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

  useEffect(() => {
    if (showFrequency && transValue.frequency === '') {
      setTranValue({
        ...transValue,
        frequency: 'DAILY',
        frequencyStopAt: `${startDate?.getFullYear()}-${startDate?.getMonth() < 9
          ? `0${startDate?.getMonth() + 1}`
          : startDate?.getMonth() + 1
          }-${startDate?.getDate() < 9
            ? `0${startDate?.getDate()}`
            : startDate?.getDate()
          }`
      }
      )
    } else {
      setTranValue({ ...transValue, frequency: '', frequencyStopAt: '' })
    }
  }, [showFrequency])

  HandleCloseModal(modalRef, setShowAddTransDetail);
  return (
    <>
      <div id="addTrans-detail-container">
        <form onSubmit={handleSubmitTran}>
          <div className="addTrans-detail" ref={modalRef}>
            <div className="addTrans-detail-header">
              <h4>Add transaction</h4>
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
                  <h4>Actual</h4>
                  <div>
                    <CurrencyInput
                      ref={inputRef}
                      name="value"
                      maxLength={15}
                      decimalsLimit={2}
                      value={transValue.value?.toString()}
                      autoComplete="off"
                      onValueChange={(value, name) =>
                        handleChangeCurrency(value, name)
                      }>
                    </CurrencyInput>
                    <span>
                      {(transValue.value as number) > 999999999999999
                        ? 'Transaction is too high'
                        : ''}
                    </span>
                  </div>

                  <h5 className="moneyIcon"> {currencySymbol}</h5>
                </div>
                <div>
                  <h4>Estimated</h4>
                  <div>

                    <CurrencyInput
                      name="estimate"
                      decimalsLimit={2}
                      maxLength={15}
                      value={transValue.estimatedValue?.toString()}
                      autoComplete="off"
                      onValueChange={(value, name) =>
                        handleChangeCurrency(value, name)
                      }></CurrencyInput>
                    <span>
                      {(transValue.estimatedValue as number) > 999999999999999
                        ? 'Estimated is too high'
                        : ''}
                    </span>
                  </div>

                  <h5 className="moneyIcon-estimated"> {currencySymbol}</h5>
                </div>
              </div>
              <div className="addTrans-input-checkbox">
                <label key="frequency-transaction">
                  <input
                    onChange={e => setShowFrequency(e.target.checked as any)}
                    checked={showFrequency as any}
                    value={showFrequency as any}
                    type="checkbox"
                    name="showFrequency"
                  />
                  <span>Frequency transaction</span>
                </label>
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
                          value="ANNUALLY"
                          checked={transValue.frequency === 'ANNUALLY'}
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
                      minDate={new Date(transWithNoValue?.transactionDate ||
                        nameDateCategory?.transactionDate)}
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
                Add
              </button>
            </div>
          </div>
        </form>

      </div>
    </>
  );
}

export default AddTransDetail;
