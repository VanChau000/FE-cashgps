import React, { useReducer } from 'react';
import Toast from '../../component/common/popup/toast/Toast';
import { INITIAL_STATE } from './constants';
import {
  login,
  logout,
  setProfile,
  setIdTransaction,
  setActiveToast,
  setContentToast,
  setCategory,
  setNameCashGroup,
  setCashPerDayIn,
  setCashPerDayOut,
  setGainAndLoss,
  setCashPosition,
  setIdCash,
  setInforProject,
  setWeekSchedule,
  setListCashGroup,
  setCashGroup,
  setListNameCategory,
  setToggleEditGroup,
  setIsExistedProject,
  setToast
} from './dispatchers';
import Reducer from './reducer';
import IUserCtx from './types';

export const UserCtx = React.createContext<IUserCtx>(INITIAL_STATE);

export default function UserProvider({ children }: any) {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  const setters = {
    login: (user: any) => login(dispatch, user),
    logout: () => logout(dispatch),
    setProfile: (profile: any) => setProfile(dispatch, profile),
    setIdTransaction: (idTransaction: any) =>
      setIdTransaction(dispatch, idTransaction),
    setActiveToast: (activeToast: any) => setActiveToast(dispatch, activeToast),
    setContentToast: (contentToast: any) =>
      setContentToast(dispatch, contentToast),
    setCategory: (category: any) => setCategory(dispatch, category),
    setNameCashGroup: (nameCashGroup: any) =>
      setNameCashGroup(dispatch, nameCashGroup),
    setCashPerDayIn: (cashPerDayIn: any) =>
      setCashPerDayIn(dispatch, cashPerDayIn),
    setCashPerDayOut: (cashPerDayOut: any) =>
      setCashPerDayOut(dispatch, cashPerDayOut),
    setGainAndLoss: (gainAndLoss: any) => setGainAndLoss(dispatch, gainAndLoss),
    setCashPosition: (cashPosition: any) =>
      setCashPosition(dispatch, cashPosition),
    setInforProject: (inforProject: any) =>
      setInforProject(dispatch, inforProject),
    setWeekSchedule: (weekSchedule: any) =>
      setWeekSchedule(dispatch, weekSchedule),
    setListCashGroup: (listCashGroup: any) =>
      setListCashGroup(dispatch, listCashGroup),
    setCashGroup: (cashGroup: any) => setCashGroup(dispatch, cashGroup),
    setIdCash: (idCash: any) => setIdCash(dispatch, idCash),
    setListNameCategory: (listNameCategory: any) =>
      setListNameCategory(dispatch, listNameCategory),
    setToggleEditGroup: (toggleEditGroup: any) =>
      setToggleEditGroup(dispatch, toggleEditGroup),
      // setIsExistedProject(dispatch, isExistedProject),
    setIsExistedProject: (isExistedProject: any) => setIsExistedProject(dispatch, isExistedProject),
    setToast: (toast: any) => setToast(dispatch, toast),
  };
  return (
    <UserCtx.Provider value={{ ...state, ...setters }}>
      {children}
    </UserCtx.Provider>
  );
}
