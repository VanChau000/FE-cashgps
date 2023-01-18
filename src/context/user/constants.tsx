import jwtDecode from 'jwt-decode';

let userDecoded: any = null;
const urlParams = new URLSearchParams(window.location.search);
const userTokenParam = urlParams.get('token');
userTokenParam && localStorage.setItem('token', userTokenParam);
const userToken = localStorage.getItem('token');
if (userToken) {
  const decoded: any = jwtDecode(userToken);
  userDecoded = decoded.user;
  if (decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
  } else {
    userDecoded = decoded;
  }
}
const existedProject = localStorage.getItem("isExistedProject")

export const INITIAL_STATE = {
  user: userDecoded,
  profile: {
    firstName: '',
    lastName: '',
    currency: '',
    timezone: '',
    projectId: '',
    hasProject: '',
  },
  toast: { activeToast: null,setActiveToast:null, bgToast: null, contentToast: null },
  idTransaction: null,
  activeToast: null,
  contentToast: null,
  category: { id: '', name: '', displayMode: '', cashGroupId: '' },
  nameCashGroup: { id: '', name: '', groupType: '' },
  cashPerDayIn: null,
  cashPerDayOut: null,
  gainAndLoss: null,
  cashPosition: null,
  weekSchedule: null,
  listCashGroup: null,
  existedProejct: null,
  cashGroup: { cashId: '', cashName: '', groupType: '' },
  idCash: { name: '' },
  listNameCategory: { name: '' },
  inforProject: { projectName: '', startingBalance: 0, startDate: '', timezone: '', currency: '' },
  toggleEditGroup: { group: false, general: true },
  isExistedProject: existedProject,
  login: (user: any) => {
    return new Promise<any>(function (resolve, reject) {
      user = userToken;
      reject({});
    });
  },
  logout: () => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  getUserData: () => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setProfile: (profile: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setIdTransaction: (idTransaction: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setActiveToast: (actionToast: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setContentToast: (contentToast: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setCategory: (category: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setNameCashGroup: (nameCashGroup: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setCashPerDayIn: (cashPerDayIn: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setCashPerDayOut: (cashPerDayOut: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setGainAndLoss: (gainAndLoss: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setCashPosition: (cashPosition: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setInforProject: (inforProject: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setWeekSchedule: (inforProject: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setListCashGroup: (listCashGroup: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setCashGroup: (cashGroup: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setIdCash: (idCash: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setListNameCategory: (listNameCategory: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setToggleEditGroup: (toggleEditGroup: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setIsExistedProject: (isExistedProject: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  },
  setToast: (toast: any) => {
    return new Promise<any>(function (resolve, reject) {
      reject({});
    });
  }
};
