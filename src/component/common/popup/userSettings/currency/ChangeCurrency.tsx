import React, { useContext, useEffect, useRef, useState } from 'react';
import { GETSINGLEPROJECT, GETUSERINFOR } from '../../../../../graphql/Query';
import { useMutation, useQuery } from '@apollo/client';
import {
  UPDATETCURRENCY,
  UPDATE_PROJECT_CURRENCY,
} from '../../../../../graphql/Mutation';
import './ChangeCurrency.scss';
import { UserCtx } from '../../../../../context/user/state';
import { HandleCloseModal } from '../../../../../utils/ModalClose';
import { currencies } from '../../../../../constants/constantsCurrency';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ChangeCurrency({
  setShowProfile,
  setShowCurrency,
  editInforForject,
  setEditInforProject,
  setShowProjectSetting,
  setEditAccount
}: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const {profile } = useContext(UserCtx);
  const [infoProject, setInforProject] = useState<any>();
  const [updateCurrency, { data, loading, error }] = useMutation(UPDATE_PROJECT_CURRENCY);
  const [updateCurrencyAccount] = useMutation(UPDATETCURRENCY);
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const [currency, setCurrency] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [showCurrencyList, setShowCurrencyList] = useState(false);
  const currencyList = [...currencies]
  const filterCurrency = currencyList
    .filter(cur => {
      if (searchTime === '') {
        return cur;
      } else {
        return cur.toLowerCase().includes(searchTime.toLowerCase());
      }
    })
  const toggleTimeList = () => {
    setShowCurrencyList(!showCurrencyList);
  };
  const handleChangeCurrecy = (cur: any) => {
    setInforProject({ ...infoProject, currency: cur });
    setCurrency(cur);
    setShowCurrencyList(false);
  };


  const handleShowProfile = () => {
    if (setEditAccount) {
      setEditAccount(true)
      setShowCurrency(false);
    } else if (editInforForject === true) {
      setShowCurrency(false);
      setShowProjectSetting(true)
    } else {
      setShowCurrency(false);
      setShowProfile(true);
    }
  };
  const handleUpdateCurrency = () => {
    if (editInforForject === true) {
      updateCurrency({
        variables: {
          upsertProjectArgs: {
            projectId: param?.projectId,
            upsertArgs: {
              currency
            }
          }
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted: ({ createOrUpdateCashProject: { result } }) => {
          if (result === 'Project was updated') {
            refetch({ projectId: param?.projectId })
            setEditInforProject(false);
            toast.success("Currency has been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowCurrency(false);
            setShowProjectSetting(true);
            if (setEditAccount) {
              setEditAccount(true)
              setShowCurrency(false);
            }
          } else {
            setEditInforProject(false);
            toast.error("Currency has not been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowCurrency(false);
            setShowProjectSetting(true);
            if (setEditAccount) {
              setEditAccount(true)
              setShowCurrency(false);
            }
            return
          }
        }
      });

    } else {
      updateCurrencyAccount({
        variables: {
          currency: currency
        },
        refetchQueries: [{ query: GETUSERINFOR }],
        onCompleted: (data: any) => {
        }
      });
      if (setEditAccount) {
        setEditAccount(true)
        setShowCurrency(false);
      }
      toast.success("Currency has been updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowCurrency(false);
      setShowProfile(true);
    }
  };
  useEffect(() => {
    setInforProject(dataSingleProject?.fetchProject?.infoProject);
  }, [dataSingleProject]);
  useEffect(() => {
    setCurrency(profile.currency);
  }, [profile]);
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [showCurrencyList])
  HandleCloseModal(modalRef, setShowCurrency);
  return (
    <>
      <div id="currency-container">
        <div className="currency-content" ref={modalRef}>
          <div className="currency-header">
            <h3>Change currency</h3>
            <img
              onClick={handleShowProfile}
              src={process.env.REACT_APP_CLIENT_URL + 'img/X.svg'}
              alt="close icon"
            />
          </div>
          <div className="currency-input">
            <div onClick={toggleTimeList}>
              {editInforForject ? infoProject?.currency : currency}
              <img
                onClick={toggleTimeList}
                src={process.env.REACT_APP_CLIENT_URL + 'img/signDown.svg'}
                alt="signDown"
              />
            </div>
            <button className="currency-btn" onClick={handleUpdateCurrency}>
              Save
            </button>
          </div>
          <ul className={showCurrencyList ? 'currency-list' : 'hide-currency '}>
            <div className="currency-list-input">
              <div className="search-box">
                <input
                  ref={inputRef}
                  onChange={e => setSearchTime(e.target.value)}
                  type="text"
                  placeholder="Search"
                />
                <img
                  src={process.env.REACT_APP_CLIENT_URL + 'img/searchIcon.svg'}
                  alt="searchIcon"
                />
              </div>
            </div>
            {
              filterCurrency.length == 0 ? <li className='no-result'>No result found</li> :
                filterCurrency.map(cur => (
                  <li onClick={() => handleChangeCurrecy(cur)}>{cur}</li>
                ))
            }
          </ul>
        </div>
      </div>
    </>
  );
}

export default ChangeCurrency;
