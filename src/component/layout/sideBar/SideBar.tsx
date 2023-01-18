import './SideBar.scss';
import Table from '../table/weeklyTable/Table';
import { useState, useEffect, useContext } from 'react';
import UserSettings from '../../common/popup/userSettings/UserSettings';
import ChangeName from '../../common/popup/userSettings/changeName/ChangeName';
import TimeZone from '../../common/popup/userSettings/timeZone/TimeZone';
import ChangeCurrency from '../../common/popup/userSettings/currency/ChangeCurrency';
import ChangePassWord from '../../common/popup/userSettings/changePassword/ChangePassWord';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MonthlyTable from '../table/monthlyTable/MonthlyTable';
import ProjectSetting from '../../common/popup/projectSetting/ProjectSetting';
import ChangeNameProject from '../../common/popup/projectSetting/changeNameProject/ChangeNameProject';
import ChangeBalence from '../../common/popup/projectSetting/changeBalence/ChangeBalence';
import { UserCtx } from '../../../context/user/state';
import { QuarterlyTable } from '../table/quarterlyTable/QuarterlyTable';
import AddCashGroup from '../../common/popup/addCashGroup/AddCashGroup';
import DeleteCategory from '../../common/popup/deleteCategory/DeleteCategory';
import ChangeGroupName from '../../common/popup/changeGroupName/ChangeGroupName';
import Sharing from '../../common/popup/sharing/Sharing';
import { useNavigate, useParams } from 'react-router-dom';
import Ripples from 'react-ripples'
import Avatar from 'react-avatar';
import { GETUSERINFOR, GET_LIST_PROJECT } from '../../../graphql/Query';
import { useQuery } from '@apollo/client';
import UserSetting from '../../common/popup/userSettings/userSetting/UserSetting';
import Billing from '../../common/popup/billing/Billing';


const dayjs = require('dayjs');
var weekOfYear = require('dayjs/plugin/weekOfYear');



function SideBar() {
  const navigate = useNavigate()
  const param = useParams()
  const { inforProject }: any = useContext(UserCtx);
  const { data: inforUser } = useQuery(GETUSERINFOR);
  const { data: listProject } = useQuery(GET_LIST_PROJECT);
  const [myProject, setMyProject] = useState('');
  const [userName, setUserName] = useState('');
  const [isOpenBilling, setIsOpenBilling] = useState(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showChangeName, setShowChangeName] = useState<boolean>(false);
  const [showTimeZone, setShowTimeZone] = useState<boolean>(false);
  const [showCurrency, setShowCurrency] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showProjectSetting, setShowProjectSetting] = useState<boolean>(false);
  const [showChangeNameProject, setShowChangeNameProject] =
    useState<boolean>(false);
  const [showChangeBalence, setShowChangeBalence] = useState<boolean>(false);
  const [showAddGroupPopup, setShowAddGrouppPopup] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState<any>(false);
  const [showChangeGroupNamePopup, setShowChangeGroupNamePopup] =
    useState<any>();
  const [showSharingPopup, setShowSharingPopup] = useState<any>(false);
  const [editInforForject, setEditInforProject] = useState<any>(false);

  const [showWeek, setShowWeek] = useState(true);
  const [showMonth, setShowMonth] = useState(false);
  const [showQuater, setShowQuater] = useState(false);
  // Calender
  const [startDate, setStartDate] = useState<any>(new Date());
  const [formatStartDate, setFormatStartDate] = useState<any>();
  const [numberWeek, setNumberWeek] = useState<any>();
  const [nameMonth, setNameMonth] = useState<any>();
  const [nameQuater, setNameQuater] = useState<any>();
  const [dateRange, setDateRange] = useState<any>();
  const [openAccountSetting, setOpenAccountSetting] = useState<any>(false)
  const [billsHistory, setBillsHistory] = useState(null);

  const [loading,setLoading] = useState<any>(false)
  //funcion get next and prev Week
  const handleNextWeek = () => {
    if (showWeek) {
      const today = new Date(formatStartDate);
      const nextweek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7,
      );
      setStartDate(nextweek);
    } else if (showMonth) {
      const today = new Date(formatStartDate);
      const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      );
      setStartDate(nextMonth);
    } else if (showQuater) {
      const today = new Date(startDate);
      const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 3,
        today.getDate(),
      );
      setStartDate(nextMonth);
    }
  };
  const handlePrevWeek = () => {
    if (showWeek) {
      const today = new Date(formatStartDate);
      const lastweek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7,
      );
      setStartDate(lastweek);
    } else if (showMonth) {
      const today = new Date(startDate);
      const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
      );
      setStartDate(nextMonth);
    } else if (showQuater) {
      const today = new Date(startDate);
      const nextQuarterly = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        today.getDate(),
      );
      setStartDate(nextQuarterly);
    }
  };

  // toogle filter
  const toggleWeek = () => {
    setStartDate(new Date());
    setShowWeek(true);
    setShowMonth(false);
    setShowQuater(false);
  };

  const toggleMonth = () => {
    const date = new Date(startDate);
    const month = `${date.getFullYear()}-${date.getMonth() + 1}-01`;
    setStartDate(new Date(month));
    setShowWeek(false);
    setShowMonth(true);
    setShowQuater(false);
  };
  const toggleQuater = () => {
    const date = new Date(startDate);
    const month = `${date.getFullYear()}-${date.getMonth() + 1}-01`;
    setStartDate(new Date(month));
    setShowWeek(false);
    setShowMonth(false);
    setShowQuater(true);
  };

  const selectedDateFromMonthToWeek = (date: string) => {
    setStartDate(new Date(date));
    setShowWeek(true);
    setShowMonth(false);
    setShowQuater(false);
  }

  const selectedDateFromQuaterlyToMonth = (date: string) => {
    setStartDate(new Date(date));
    setShowWeek(false);
    setShowMonth(true);
    setShowQuater(false);
  }

  const toggleShowSettingProject = () => {
    if (param?.permission === "VIEW") {
      return
    } else {
      setShowProjectSetting(true);
    }
  };

  const handleAciveShare = () => {
    if (!myProject) return
    setShowSharingPopup(true)
  }

  useEffect(() => {
    const getRangeDays = (currentDay: any) => {
      let choseDay = currentDay
      const dayOfWeekName = new Date(currentDay).toLocaleString(
        'default', { weekday: 'long' }
      );
      if (dayOfWeekName === "Sunday") {
        const dateNow = new Date(currentDay)
        const timeOfDay = dateNow.getTime()
        choseDay = new Date(timeOfDay - 86400000)
      }
      var week = new Array();
      // Starting Monday not Sunday
      choseDay.setDate(choseDay.getDate() - choseDay.getDay() + 1);
      for (var i = 0; i < 7; i++) {
        week.push(new Date(choseDay));
        choseDay.setDate(choseDay.getDate() + 1);
      }
      return week;
    };
    const input = new Date(startDate);
    const resultRangeDay = getRangeDays(input);
    setDateRange(resultRangeDay);
  }, [startDate]);


  //get weeknumber
  useEffect(() => {
    function weekNumber(dateWeek: any) {
      // make multil-click on next and prev week button going smoothly
      let choseDay = startDate
      const dayOfWeekName = new Date(startDate).toLocaleString(
        'default', { weekday: 'long' }
      );
      if (dayOfWeekName === "Sunday") {
        const dateNow = new Date(startDate)
        choseDay = choseDay.setDate(dateNow.getDate())
      }
      dayjs.extend(weekOfYear);
      const numberWeek = dayjs(startDate.toISOString().split('T')[0]).week();
      setNumberWeek(numberWeek);
    }
    weekNumber(startDate);
  }, [startDate]);
  // format date to get next and prev week
  useEffect(() => {
    setFormatStartDate(startDate.toISOString().split('T')[0]);
  }, [startDate]);

  //get name of month and quater
  useEffect(() => {
    const today = new Date(startDate);
    const month = today.toLocaleString('default', { month: 'short' });
    const quater = Math.floor(today.getMonth() / 3 + 1);
    setNameMonth(month);
    setNameQuater(quater);
  }, [startDate]);

  useEffect(() => {
    if (!inforUser) return
    setUserName(inforUser?.getUser.user.firstName + " " + inforUser?.getUser.user.lastName)
  }, [inforUser])

  useEffect(() => {
    listProject?.listProjects?.projects?.map((item: any) => {
      if (item.id === param.projectId) {
        setMyProject(item.name)
      } 
    })
  }, [listProject])
 
  

  return (
    <>
      <div id="mainLayout-container">
        <div id="mainLayout-content">
          <div id="header">
            <div className="sideBar-logo" onClick={() => navigate('/')}>
              <img
                className="sideBar-top-logo"
                src={process.env.REACT_APP_CLIENT_URL + 'img/goHomePage_icon.svg'}
                alt="logo"
              />
            </div>
            <Ripples className='ripples-header-left' onClick={toggleShowSettingProject}>
              <div className="header-left" style={{ "cursor": param?.permission === "VIEW" ? "default" : "pointer" }} >
                {
                  param?.permission === "VIEW" ?
                    <div
                      style={{ "cursor": "default" }}
                      className="header-left-name"
                    >
                      <h4>{inforProject?.projectName}</h4>
                      <img
                        style={{ "cursor": "default" }}
                        src={process.env.REACT_APP_CLIENT_URL + 'img/setting-outline.svg'}
                        alt="logo"
                      />
                    </div>
                    :
                    <div
                      className="header-left-name"
                      onClick={toggleShowSettingProject}>
                      <h4>{inforProject?.projectName}</h4>
                      <img
                        src={process.env.REACT_APP_CLIENT_URL + 'img/setting-outline.svg'}
                        alt="logo"
                      />
                    </div>
                }
              </div>
            </Ripples>
            <div className="header-right">
              <div className="header-right-filter">
                <span className={showWeek ? 'btn-show option1' : showMonth ? 'btn-show option2' : 'btn-show option3'}>{showWeek ? 'Weekly' : showMonth ? 'Monthly' : 'Quarterly'}</span>
                <span
                  className={
                    'weekly-btn'}
                  onClick={toggleWeek}>
                  Weekly
                </span>
                <span
                  className={
                    'monthly-btn'}
                  onClick={toggleMonth}>
                  Monthly
                </span>
                <span className={
                  'quaterly-btn'
                }
                  onClick={toggleQuater}>
                  Quarterly
                </span>
              </div>
              <div className='right-calender'>
                <div className="header-right-calender">
                  <div className='btn-leftArrow'>
                    <Ripples>
                      <img
                        onClick={handlePrevWeek}
                        src={process.env.REACT_APP_CLIENT_URL + 'img/leftArrow.svg'}
                        alt="leftArrow"
                      />
                    </Ripples>
                  </div>
                  {showWeek ? (
                    <DatePicker
                      todayButton="Today"
                      id="datePicker"
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      closeOnScroll={true}
                    />
                  ) : null}
                  {showMonth ? (
                    <DatePicker
                      todayButton="Today"
                      id="datePicker"
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      showMonthYearPicker
                      closeOnScroll={true}
                    />
                  ) : null}
                  {showQuater ? (
                    <DatePicker
                      todayButton="Today"
                      id="datePicker"
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      showQuarterYearPicker
                      closeOnScroll={true}
                    />
                  ) : null}
                  <label className="calender-btn" htmlFor="datePicker">
                    <img
                      src={process.env.REACT_APP_CLIENT_URL + 'img/calender.svg'}
                      alt="calender"
                    />
                    <h4>
                      {/* {startDate.getFullYear()} - Week {numberWeek} */}
                      {showWeek ? (
                        <>
                          {startDate.getFullYear()} - Week {numberWeek}{' '}
                        </>
                      ) : null}
                      {showMonth ? (
                        <>
                          {startDate.getFullYear()} - {nameMonth}{' '}
                        </>
                      ) : null}
                      {showQuater ? (
                        <>
                          {startDate.getFullYear()} - Q{nameQuater}{' '}
                        </>
                      ) : null}
                    </h4>
                  </label>
                  <div className='btn-rightArrow'>
                    <Ripples>
                      <img
                        onClick={handleNextWeek}
                        src={
                          process.env.REACT_APP_CLIENT_URL + 'img/rightArrow.svg'
                        }
                        alt="rightArrow"
                      />
                    </Ripples>
                  </div>

                </div>
                {myProject ? <Ripples className="btn-share" onClick={handleAciveShare}>
                  Share
                </Ripples> : null}
              </div>
            </div>
            <div className="avatarUser">
              <Ripples>
                <div>
                  <Avatar name={userName} className='avatar-name' onClick={() => setOpenAccountSetting(true)} />
                </div>
              </Ripples>
            </div>
          </div>
          <div id="table-content">
            <div className="table-left">
              {showWeek ? <Table dateRange={dateRange} /> : null}
              {showMonth ? <MonthlyTable monthSelected={startDate} selectedDateFromMonthToWeek={selectedDateFromMonthToWeek} /> : null}
              {showQuater ?
                <QuarterlyTable quarterlySelected={startDate} selectedDateFromQuaterlyToMonth={selectedDateFromQuaterlyToMonth} />
                : null}
            </div>
          </div>
        </div>
      </div>
      {openAccountSetting ? <UserSetting setOpenAccountSetting={setOpenAccountSetting} setEditAccount={setShowProfile} setIsOpenBilling={setIsOpenBilling} setBillsHistory={setBillsHistory} setLoading={setLoading} /> : null}
      {isOpenBilling ? <Billing setIsOpenBilling={setIsOpenBilling} loading={loading} billsHistory={billsHistory} /> : null}

      {showProfile ? (
        <UserSettings
          setShowProfile={setShowProfile}
          setShowChangeName={setShowChangeName}
          setShowTimeZone={setShowTimeZone}
          setShowCurrency={setShowCurrency}
          setShowChangePassword={setShowChangePassword}
          setEditInforProject={setEditInforProject}
        />
      ) : null}
      {showChangeName ? (
        <ChangeName
          setShowProfile={setShowProfile}
          setShowChangeName={setShowChangeName}
        />
      ) : null}
      {showTimeZone ? (
        <TimeZone
          setShowProjectSetting={setShowProjectSetting}
          setShowTimeZone={setShowTimeZone}
          setShowProfile={setShowProfile}
          editInforForject={editInforForject}
          setEditInforProject={setEditInforProject}
        />
      ) : null}
      {showCurrency ? (
        <ChangeCurrency
          setShowProfile={setShowProfile}
          setShowCurrency={setShowCurrency}
          editInforForject={editInforForject}
          setEditInforProject={setEditInforProject}
          setShowProjectSetting={setShowProjectSetting}
        />
      ) : null}
      {showChangePassword ? (
        <ChangePassWord
          setShowProfile={setShowProfile}
          setShowChangePassword={setShowChangePassword}
        />
      ) : null}
      {showProjectSetting ? (
        <ProjectSetting
          setShowProjectSetting={setShowProjectSetting}
          setShowChangeNameProject={setShowChangeNameProject}
          setShowChangeBalence={setShowChangeBalence}
          setShowAddGroupPopup={setShowAddGrouppPopup}
          setShowDeletePopup={setShowDeletePopup}
          setShowChangeGroupNamePopup={setShowChangeGroupNamePopup}
          setShowTimeZone={setShowTimeZone}
          setShowCurrency={setShowCurrency}
          setShowProfile={setShowProfile}
          setEditInforProject={setEditInforProject}
        />
      ) : null}
      {showChangeNameProject ? (
        <ChangeNameProject
          setShowProjectSetting={setShowProjectSetting}
          setShowChangeNameProject={setShowChangeNameProject}
        />
      ) : null}
      {showChangeBalence ? (
        <ChangeBalence
          setShowProjectSetting={setShowProjectSetting}
          setShowChangeBalence={setShowChangeBalence}
        />
      ) : null}
      {showAddGroupPopup ? (
        <AddCashGroup setShowAddGroupPopup={setShowAddGrouppPopup} />
      ) : null}
      {showDeletePopup ? (
        <DeleteCategory
          setShowProjectSetting={setShowProjectSetting}
          setShowDeletePopup={setShowDeletePopup}
        />
      ) : null}
      {showChangeGroupNamePopup ? (
        <ChangeGroupName
          setShowChangeGroupNamePopup={setShowChangeGroupNamePopup}
          setShowProjectSetting={setShowProjectSetting}
        />
      ) : null}
      {showSharingPopup ? (
        <Sharing
          nameEditProject={myProject} idProject={param.projectId}
          setShowSharingPopup={setShowSharingPopup} />
      ) : null}

    </>
  );
}

export default SideBar;
