import React from 'react';
import { ACTIONS } from './actions';
import jwt from 'jwt-decode';

export const login = async (dispatch: React.Dispatch<any>, user: any) => {
  try {
    // const userObj: any = jwt(user);
    const userObj = localStorage.setItem('token', user);
    dispatch({ type: ACTIONS.LOGIN, user: userObj });
    return user;
  } catch (e) {
    console.error('Fail to login ', e);
  }
};

export const logout = async (dispatch: React.Dispatch<any>) => {
  try {
    dispatch({ type: ACTIONS.LOGOUT });
  } catch (e) {
    console.error('Fail to logout ', e);
  }
};

export const setProfile = async (
  dispatch: React.Dispatch<any>,
  profile: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_PROFILE, profile });
  } catch (e) {
    console.error('Fail to setProfile ', e);
  }
};

export const setIdTransaction = async (
  dispatch: React.Dispatch<any>,
  idTransaction: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_IDTRANSACTION, idTransaction });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};

export const setActiveToast = async (
  dispatch: React.Dispatch<any>,
  activeToast: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_ACTIVETOAST, activeToast });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setContentToast = async (
  dispatch: React.Dispatch<any>,
  contentToast: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_CONTENTTOAST, contentToast });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setCategory = async (
  dispatch: React.Dispatch<any>,
  category: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_CATEGORY, category });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setNameCashGroup = async (
  dispatch: React.Dispatch<any>,
  nameCashGroup: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_NAMECASHGROUP, nameCashGroup });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setCashPerDayIn = async (
  dispatch: React.Dispatch<any>,
  cashPerDayIn: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_CASHPERDAYIN, cashPerDayIn });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setCashPerDayOut = async (
  dispatch: React.Dispatch<any>,
  cashPerDayOut: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_CASHPERDAYOUT, cashPerDayOut });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setGainAndLoss = async (
  dispatch: React.Dispatch<any>,
  gainAndLoss: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_GAINANDLOSS, gainAndLoss });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setCashPosition = async (
  dispatch: React.Dispatch<any>,
  cashPosition: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_CASHPOSITION, cashPosition });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setInforProject = async (
  dispatch: React.Dispatch<any>,
  inforProject: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_INFORPROJECT, inforProject });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};

export const setWeekSchedule = async (
  dispatch: React.Dispatch<any>,
  weekSchedule: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_WEEKSCHEDULE, weekSchedule });
  } catch (e) {
    console.error('Fail to setIdTransaction ', e);
  }
};
export const setListCashGroup = async (
  dispatch: React.Dispatch<any>,
  listCashGroup: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_LISTCASHGROUP, listCashGroup });
  } catch (e) {
    console.error('Fail to setListCashGroup ', e);
  }
};
export const setCashGroup = async (
  dispatch: React.Dispatch<any>,
  cashGroup: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_CASHGROUP, cashGroup });
  } catch (e) {
    console.error('Fail to setcashGroup ', e);
  }
};
export const setIdCash = async (dispatch: React.Dispatch<any>, idCash: any) => {
  try {
    dispatch({ type: ACTIONS.SET_IDCASH, idCash });
  } catch (e) {
    console.error('Fail to setlistCategorySingleCash ', e);
  }
};
export const setListNameCategory = async (
  dispatch: React.Dispatch<any>,
  listNameCategory: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_LISTNAMECATEGORY, listNameCategory });
  } catch (e) {
    console.error('Fail to setListNameCategory ', e);
  }
};

export const setToggleEditGroup = async (
  dispatch: React.Dispatch<any>,
  toggleEditGroup: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_TOGGLE_EDIT_GROUP, toggleEditGroup });
  } catch (e) {
    console.error('Fail to setToggleEditGroup ', e);
  }
};
export const setToast = async (
  dispatch: React.Dispatch<any>,
  toast: any,
) => {
  try {
    dispatch({ type: ACTIONS.SET_TOAST, toast });
  } catch (e) {
    console.error('Fail to setToggleEditGroup ', e);
  }
};

export const setIsExistedProject = async (
  dispatch: React.Dispatch<any>,
  isExistedProject: any,
) => {
  try {
    const existedProject = localStorage.setItem("isExistedProject", isExistedProject)
    dispatch({ type: ACTIONS.SET_IS_EXISTED_PROJECT, existedProject });
    return isExistedProject
  } catch (e) {
    console.error('Fail to setIsExistedProject ', e);
  }
};

