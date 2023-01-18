import React, { useEffect, useState } from 'react';
import './CreateProject.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { CREATE_NEW_PROJECT } from '../../graphql/Mutation';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import CurrencyInput from 'react-currency-input-field';
import { currencies } from '../../constants/constantsCurrency';
import { toast } from 'react-toastify';


function CreateProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState<any>(1);
  const [startDate, setStartDate] = useState<any>(new Date());
  const [symbol, setSymbol] = useState('');

  const [createNewProject, { error }] = useMutation(CREATE_NEW_PROJECT, {
    onCompleted: data => {
      const result = data?.createOrUpdateCashProject?.result;
      if (result === 'Project was inserted') {
        localStorage.setItem("isExistedProject", "true")
        window.location.href = "/"
      }
      else {
        return
      }
    },
  });

  const [newProject, setNewProject] = useState<any>({
    name: '',
    startingBalance: 0,
    startDate: startDate.toISOString().split('T')[0],
    saturday: true,
    sunday: true,
    currency: 'USD',
  })
  


  const handleOnChangeCurrency = (value: any) => {
    setNewProject({
      ...newProject,
      startingBalance: value,
    });
  };
  function getCurrencySymbol(locale: string, currency: string) {
    return (0).toLocaleString(
      locale,
      {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    ).replace(/\d/g, '').trim()
  }

  const handleOnChange = (e: any): void => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewProject({
      ...newProject,
      [e.target.name]: value,
    })
  };

  const hanldeCreateProject = () => {
    if (parseFloat(newProject?.startingBalance) < 999999999999999) {
      createNewProject({
        variables: {
          upsertProjectArgs: {
            upsertArgs: {
              name: newProject?.name,
              startingBalance: parseFloat(newProject?.startingBalance),
              currency: newProject?.currency,
              startDate: startDate.toISOString().split('T')[0]
            },
            saturdayOrSunday: [newProject?.saturday, newProject?.sunday],
          },
        },
        onCompleted:(data:any) => {
          console.log("data...result...", data);
          
        }
      });
    } else {
      return;
    }
  };

  useEffect(() => {
    setSymbol(newProject.currency)
  }, [newProject])

  useEffect(() => {
    setNewProject({ ...newProject, [newProject.startDate]: startDate });
  }, [startDate]);
  ///note t7 63, cn 95, t7 + cn 127, none 31
  useEffect(() => {
    if (error?.message === "Upgrade your subscription to perform this action.") {
      toast.error(error?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [error?.message === "Upgrade your subscription to perform this action."])
  return (
    <>
      <div id="newProject-container">
        {step === 1 ? (
          <div className="newProject-content">
            <div className="newProject-logo">
              <img
                onClick={() => navigate('/login')}
                src={process.env.REACT_APP_CLIENT_URL + 'img/logoCashgps.svg'}
                alt="logo"
              />
            </div>
            <div className="newProject-main">
              <h4>Step {step} of 2</h4>
              <div className="newProject-subMain-stepOne">
                <h3>What’s your project name?</h3>
                <h5>
                  This will be the name of your CashGPS project — choose
                  something that easily to recognize.
                </h5>
                <div className="newProject-input">
                  <h5>Project name</h5>
                  <input
                    data-testid='name-project'
                    onChange={handleOnChange}
                    name="name"
                    value={newProject?.name}
                    type="text"
                  />
                </div>
                <button
                  data-testid='btn-next-step'
                  className={
                    newProject?.name.length > 0 && newProject?.name.length < 20
                      ? 'newProject-btn-next'
                      : 'newProject-btn-next-disabled'
                  }
                  disabled={!newProject?.name || newProject?.name.length > 20}
                  onClick={() => setStep(2)}>
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="newProject-logo">
              <img
                src={process.env.PUBLIC_URL + 'img/logoCashgps.svg'}
                alt="logo"
              />
            </div>
            <div className="newProject-subContent">
              <h4>Step {step} of 2</h4>
              <div className="newProject-subMain-stepTwo">
                <h3>Welcome to CashGPS</h3>
                <h5>
                  Before your begin tracking your cashflow, we need to know 3
                  things
                </h5>
                <div className="newProject-input-date">
                  <h3>Start date</h3>
                  <h5>
                    This is the date you want to start tracking your available
                    cash.{' '}
                  </h5>
                    <input
                    id="createTransaction"
                    type="date"
                    value={`${startDate.getFullYear()}-${startDate.getMonth() < 9
                      ? `0${startDate.getMonth() + 1}`
                      : startDate.getMonth() + 1
                      }-${startDate.getDate() <= 9
                        ? `0${startDate.getDate()}`
                        : startDate.getDate()
                      }`}
                    name="frequencyStopAt"
                    readOnly
                  />
                  <DatePicker
                    todayButton="Today"
                    id="datePickerTransaction"
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    closeOnScroll={true}
                  />
                  <label
                    className="calender-btn-transaction"
                    htmlFor="datePickerTransaction">
                    <img
                      src={process.env.PUBLIC_URL + 'img/calender.svg'}
                      alt="calender"
                    />
                  </label>
                </div>
                <div className="newProject-input-balence">
                  <h3>Start balance</h3>
                  <h5>
                    This is the starting balance of your cash tracking and the
                    balance from your bank of your starting date.
                  </h5>
                  <div className="input-balence-selection">
                      <select
                        data-testid='select-currency'
                      onChange={handleOnChange}
                      name="currency"
                      value={newProject?.currency}>
                      {
                        currencies?.map((cur: any) => {
                          return (
                            <option key={cur} value={cur}>{cur}</option>
                          )
                        })
                      }
                    </select>
                      <span data-testid='currency-symbol' className='currencySymbol'>{`${getCurrencySymbol('en-US', symbol)}`}</span>
                    <CurrencyInput
                      name="startingBalance"
                      defaultValue={0}
                      decimalsLimit={2}
                      // onChange={handleOnChange}
                      onValueChange={value =>
                        handleOnChangeCurrency(value)
                      }></CurrencyInput>
                  </div>
                </div>
                <div className="newProject-input-tracking">
                  <h3>Weekend tracking</h3>
                  <h5>
                    Not all banks post transactions on weekends. Please let us
                    know if you would like to track Saturday and/or Sunday.{' '}
                  </h5>
                  <div className="input-tracking-checkbox">
                    <div>
                      <input
                        name="saturday"
                        checked={newProject?.saturday as any}
                        value={newProject?.saturday}
                        onChange={handleOnChange}
                        type="checkbox"
                      />
                      <span>Saturday</span>
                    </div>
                    <div>
                      <input
                        name="sunday"
                        value={newProject?.sunday}
                        checked={newProject?.sunday as any}
                        onChange={handleOnChange}
                        type="checkbox"
                      />
                      <span>Sunday</span>
                    </div>
                  </div>
                </div>
                <div className="newProject-btn-container">
                  <button
                    className="newProject-btn-back"
                    onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    // disabled={!newProject?.startingBalance}
                    className={
                      newProject?.startingBalance < 999999999999999
                        ? 'newProject-btn-done'
                        : 'newProject-btn-done-disabled'
                    }
                    onClick={hanldeCreateProject}>
                    Done
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CreateProject;
