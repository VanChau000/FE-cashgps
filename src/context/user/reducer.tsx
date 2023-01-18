import { ACTIONS } from './actions';

/* eslint-disable import/no-anonymous-default-export */
export default (state: any, action: any) => {
  const {
    user,
    profile,
    idTransaction,
    activeToast,
    contentToast,
    category,
    nameCashGroup,
    cashPerDayIn,
    cashPerDayOut,
    gainAndLoss,
    cashPosition,
    inforProject,
    weekSchedule,
    listCashGroup,
    cashGroup,
    idCash,
    listNameCategory,
    toggleEditGroup,
    isExistedProject,
    toast
  } = action;

  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        user,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user,
      };
    case ACTIONS.SET_PROFILE:
      return {
        ...state,
        profile,
      };
    case ACTIONS.SET_IDTRANSACTION:
      return {
        ...state,
        idTransaction,
      };
    case ACTIONS.SET_ACTIVETOAST:
      return {
        ...state,
        activeToast,
      };
    case ACTIONS.SET_CONTENTTOAST:
      return {
        ...state,
        contentToast,
      };
    case ACTIONS.SET_CATEGORY:
      return {
        ...state,
        category,
      };
    case ACTIONS.SET_NAMECASHGROUP:
      return {
        ...state,
        nameCashGroup,
      };
    case ACTIONS.SET_CASHPERDAYIN:
      return {
        ...state,
        cashPerDayIn,
      };
    case ACTIONS.SET_CASHPERDAYOUT:
      return {
        ...state,
        cashPerDayOut,
      };
    case ACTIONS.SET_GAINANDLOSS:
      return {
        ...state,
        gainAndLoss,
      };
    case ACTIONS.SET_CASHPOSITION:
      return {
        ...state,
        cashPosition,
      };
    case ACTIONS.SET_INFORPROJECT:
      return {
        ...state,
        inforProject,
      };
    case ACTIONS.SET_WEEKSCHEDULE:
      return {
        ...state,
        weekSchedule,
      };
    case ACTIONS.SET_LISTCASHGROUP:
      return {
        ...state,
        listCashGroup,
      };
    case ACTIONS.SET_CASHGROUP:
      return {
        ...state,
        cashGroup,
      };
    case ACTIONS.SET_IDCASH:
      return {
        ...state,
        idCash,
      };
    case ACTIONS.SET_LISTNAMECATEGORY:
      return {
        ...state,
        listNameCategory,
      };
    case ACTIONS.SET_TOGGLE_EDIT_GROUP:
      return {
        ...state,
        toggleEditGroup,
      };
    case ACTIONS.SET_IS_EXISTED_PROJECT:
      return {
        ...state, isExistedProject,
      };
    case ACTIONS.SET_TOAST:
      return {
        ...state, 
        toast,
      }
    default:
      return state;
  }
};
