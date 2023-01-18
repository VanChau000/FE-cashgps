import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserCtx } from '../../../../context/user/state';
import './ProjectSetting.scss';
import { CREATE_NEW_PROJECT } from '../../../../graphql/Mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GETSINGLEPROJECT, GET_CUURENCY_SYMBOL } from '../../../../graphql/Query';
import { DELETE_CASH_GROUP } from '../../../../graphql/Mutation';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import { useParams } from 'react-router-dom';

function ProjectSetting({
  setShowProjectSetting,
  setShowChangeNameProject,
  setShowChangeBalence,
  setShowAddGroupPopup,
  setShowDeletePopup,
  setShowChangeGroupNamePopup,
  setShowTimeZone,
  setShowCurrency,
  setEditInforProject,
}: any) {
  let modalRef: any = useRef();
  const {
    inforProject,
    weekSchedule,
    listCashGroup,
    setCashGroup,
    setToggleEditGroup,
    toggleEditGroup,
    cashPerDayIn, 
    cashPerDayOut
  } = useContext(UserCtx);
  const param = useParams()
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const [editTracking, setEditTracking] = useState<any>(false);
  const [updateWeekSchedule] = useMutation(CREATE_NEW_PROJECT);
  const [detleteCashGroup, { data, loading, error }] =
    useMutation(DELETE_CASH_GROUP);
  const { data: moneySymbol } = useQuery(GET_CUURENCY_SYMBOL);
  const currencySymbol = moneySymbol?.fetchProject?.infoProject?.currencySymbol
  const [avatarProject, setAvatarProject] = useState<any>();
  const [weekChecking, setWeekChecking] = useState<any>({
    saturday: weekSchedule === '63' || weekSchedule === '127' ? true : false,
    sunday: weekSchedule === '95' || weekSchedule === '127' ? true : false,
  });
  const [showEdit, setShowEdit] = useState({
    general: true,
    group: false,
  });
  const date = new Date(inforProject?.startDate).toString().split(' ');
  const dateFormat = date[1] + ' ' + date[2] + ', ' + date[3];

  const handleChangeTransValue = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setWeekChecking({
      ...weekChecking,
      [e.target.name]: value,
    });
  };

  const handleToggleGeneral = () => {
    setToggleEditGroup({
      general: true,
      group: false,
    });
  };
  const handleToogleGroup = () => {
    setToggleEditGroup({
      general: false,
      group: true,
    });
  };
  const handleImageUpdate = (e: any) => {
    const [file] = e.target.files;
    setAvatarProject(URL.createObjectURL(e.target.files[0]));
  };
  const toggleChangeProjectName = () => {
    setShowProjectSetting(false);
    setShowChangeNameProject(true);
  };
  const toggleChangeBalence = () => {
    setShowProjectSetting(false);
    setShowChangeBalence(true);
  };
  const toogleEditTracking = () => {
    setEditTracking(!editTracking);
    if (editTracking) {
      updateWeekSchedule({
        variables: {
          upsertProjectArgs: {
            projectId: param?.projectId,
            saturdayOrSunday: [weekChecking?.saturday, weekChecking?.sunday],
          },
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted:({createOrUpdateCashProject:{result}}) => {
          if(result === 'Project was updated'){
            refetch({ projectId: param?.projectId })
          } else{
            return
          }
        }
      });
    } else {
      return;
    }
  };
  const hanldeAddGroup = () => {
    setShowProjectSetting(false);
    setShowAddGroupPopup(true);
  };
  const handleDeleteGroup = (cash: any) => {
    const newObj = {
      cashId:cash?.id,
      cashName:cash?.name,
      groupType:cash?.groupType
    }
    setCashGroup(newObj);
    setShowProjectSetting(false);
    setShowDeletePopup(true);
  };
  const handleEditNameGroup = (cash: any) => {

    const newObj = {
      cashId: cash?.id,
      cashName: cash?.name,
      groupType: cash?.groupType
    }
    setCashGroup(newObj);
    setShowProjectSetting(false);
    setShowChangeGroupNamePopup(true);
  };
  const handleChangTimezone = () => {
    setEditInforProject(true);
    setShowProjectSetting(false);
    setShowTimeZone(true);
  };
  const handleChangCurrency = () => {
    setEditInforProject(true);
    setShowProjectSetting(false);
    setShowCurrency(true);
  };

  HandleCloseModal(modalRef, setShowProjectSetting);
  return (
    <>
      <div id="projectSetting-container">
        <div className="projectSetting-main" ref={modalRef}>
          <div className="projectSetting-header">
            <h4>Project settings</h4>
            <img
              onClick={() => setShowProjectSetting(false)}
              src={
                process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'
              }
              alt="logo"
            />
          </div>
          <div className="projectSetting-content-container">
            <div className="projectSetting-option">
              <button
                className={
                  toggleEditGroup?.general ? 'projectSetting-btn-active' : ''
                }
                onClick={handleToggleGeneral}>
                General
              </button>
              <button
                className={
                  toggleEditGroup?.group ? 'projectSetting-btn-active' : ''
                }
                onClick={handleToogleGroup}>
                Groups
              </button>
            </div>
            {toggleEditGroup?.general ? (
              <div className="projectSetting-content">
                <div className="projectSetting-edit">
                  <div className="projectSetting-edit-name">
                    <div>
                      <h4>Project name</h4>
                      <h5>{inforProject?.projectName}</h5>
                    </div>
                    <button onClick={toggleChangeProjectName}>
                      Change project name
                    </button>
                  </div>
                  <div className="projectSetting-edit-name">
                    <div>
                      <h4>Balance</h4>
                      <h5>
                        <img
                          src={
                            process.env.REACT_APP_CLIENT_URL +
                            'img/moneyBalence.svg'
                          }
                          alt="logo"
                        />
                        <span>
                          {' '}
                          &nbsp;{currencySymbol}
                          {Number(
                            inforProject?.startingBalance,
                          ).toLocaleString()}
                        </span>
                      </h5>
                    </div>
                    <button onClick={toggleChangeBalence}>
                      Change balance
                    </button>
                  </div>
                  <div className="projectSetting-startDate">
                    <h4>Start date</h4>
                    <h5>{dateFormat}</h5>
                  </div>
                  {/* <div onClick={() => handleChangeTimeZone()}>time currency</div> */}
                  <div className="projectSetting-edit-dateTracking">
                    <div>
                      <h3>Weekend tracking</h3>
                      <div>
                        <input
                          disabled={editTracking ? false : true}
                          onChange={handleChangeTransValue}
                          type="checkbox"
                          name="saturday"
                          value={weekChecking?.saturday}
                          checked={weekChecking?.saturday as any}
                        />

                        <span>Saturday</span>
                      </div>
                      <div>
                        <input
                          disabled={editTracking ? false : true}
                          onChange={handleChangeTransValue}
                          type="checkbox"
                          name="sunday"
                          value={weekChecking?.sunday}
                          checked={weekChecking?.sunday as any}
                        />
                        <span>Sunday</span>
                      </div>
                    </div>
                    {!editTracking ? (
                      <button
                        className="btn-projectSetting"
                        onClick={toogleEditTracking}>
                        Edit
                      </button>
                    ) : (
                      <button
                        className="btn-projectSetting-save"
                        onClick={toogleEditTracking}>
                        Save
                      </button>
                    )}
                  </div>
                  <div className="projectSetting-edit-timeZone">
                    <div>
                      <h4>Time zone</h4>
                      <h5>{inforProject?.timezone}</h5>
                    </div>
                    <button onClick={handleChangTimezone}>
                      Change time zone
                    </button>
                  </div>
                  <div className="projectSetting-edit-currency">
                    <div>
                      <h4>Currency</h4>
                      <h5>{inforProject?.currency}</h5>
                    </div>
                    <button onClick={handleChangCurrency}>
                      Change currency
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            {toggleEditGroup?.group ? (
              <div className="projectSetting-subContent">
                <div className="project-cashGorup-setting">
                  <div className="gorup-cashIn-setting">
                    <h3>Cash In</h3>
                    {cashPerDayIn &&
                      cashPerDayIn?.map((cash: any) => {
                        return (
                          <div className="cashGroup-item">
                            <span>{cash?.name}</span>
                            <div className="cashGroup-edit">
                              <img
                                onClick={() => handleEditNameGroup(cash)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/penEdit.svg'
                                }
                                alt="logo"
                              />
                              <img
                                onClick={() => handleDeleteGroup(cash)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/Trash.svg'
                                }
                                alt="logo"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="gorup-cashIn-setting">
                    <h3>Cash Out</h3>
                    {cashPerDayIn &&
                      cashPerDayOut?.map((cash: any) => {
                        return (
                          <div className="cashGroup-item">
                            <span>{cash?.name}</span>
                            <div className="cashGroup-edit">
                              <img
                                onClick={() => handleEditNameGroup(cash)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/penEdit.svg'
                                }
                                alt="logo"
                              />
                              <img
                                onClick={() => handleDeleteGroup(cash)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/Trash.svg'
                                }
                                alt="logo"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <button
                  className="btn-cashGourp-setting"
                  onClick={hanldeAddGroup}>
                  <img
                    src={process.env.REACT_APP_CLIENT_URL + 'img/addGroup.svg'}
                    alt="logo"
                  />
                  <span>Add group</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectSetting;
