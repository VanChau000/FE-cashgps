import { useQuery } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { GETUSERINFOR, GET_LIST_PROJECT } from '../../graphql/Query'
import { useNavigate } from "react-router-dom";
import './ListProject.scss'
import Sharing from '../../component/common/popup/sharing/Sharing';
import DeleteProject from '../../component/common/popup/deleteProject/DeleteProject';
import { SubscriptionFactory } from '../../models/SubscriptionFactory';
import Ripples from 'react-ripples'
import Avatar from 'react-avatar';
import UserSetting from '../../component/common/popup/userSettings/userSetting/UserSetting';
import ChangeNameProject from '../../component/common/popup/projectSetting/changeNameProject/ChangeNameProject';
import UserSettings from '../../component/common/popup/userSettings/UserSettings';
import ChangeName from '../../component/common/popup/userSettings/changeName/ChangeName';
import TimeZone from '../../component/common/popup/userSettings/timeZone/TimeZone';
import ChangeCurrency from '../../component/common/popup/userSettings/currency/ChangeCurrency';
import ChangePassWord from '../../component/common/popup/userSettings/changePassword/ChangePassWord';
import Billing from '../../component/common/popup/billing/Billing';
import LoadingData from '../../component/common/loadingData/LoadingData';




function ListProject() {
  const navigate = useNavigate()
  const bottomRef: any = useRef()
  const [showChangeNamePopup, setShowChangeNamePopup] = useState<any>(false)
  const [openAccountSetting, setOpenAccountSetting] = useState<any>(false)
  const [showDeleteProject, setShowDeleteProject] = useState<any>(false)
  const [nameEditProject, setNameEditProject] = useState<any>({})
  const { data } = useQuery(GET_LIST_PROJECT);
  const { data: inforUser } = useQuery(GETUSERINFOR);
  const [userName, setUserName] = useState('');
  const [currentPlan, setCurrentPlan] = useState<any>({
    ownerActiveSubscription: '',
    ownerSubscriptionExpiresAt: ''
  })
  const [listProject, setListProject] = useState<any>()
  const [listShareProject, setListShareProject] = useState<any>()
  const [listMyProject, setListMyProject] = useState<any>()
  const [isEdit, setIdEdit] = useState<any>()
  const [togglePopup, setTooglePopup] = useState<any>(false)
  const [seacrhProject, setSearchProject] = useState('')
  const [showSharingPopup, setSharingPopup] = useState<any>(false)
  const [idProject, setIdProject] = useState<any>()
  const [selectedProject, setSelectedProject] = useState<any>({
    id: '',
    name: ''
  })
  const [highlightBtn, setHightLightBtn] = useState<any>({
    btnMyproject: true,
    btnShare: false
  })
  const [togglePage, setTogglePage] = useState<any>({
    home: true,
    myProject: false,
    sharingProject: false
  })
  const [activeId, setActiveId] = useState<string>("")
  const [editAccount, setEditAccount] = useState<any>(false)
  const [showChangeName, setShowChangeName] = useState<any>()
  const [showTimeZone, setShowTimeZone] = useState<any>()
  const [showCurrency, setShowCurrency] = useState<any>()
  const [showChangePassword, setShowChangePassword] = useState<any>()
  const [isOpenBilling, setIsOpenBilling] = useState(false);
  const [billsHistory, setBillsHistory] = useState(null);
  const [loading, setLoading] = useState<any>(false)

  const filterProject = listProject
    ?.filter((name: any) => {
      if (seacrhProject === '') {
        return name;
      } else {
        return name?.name?.toLowerCase()?.includes(seacrhProject?.toLowerCase());
      }
    })
  const filterMyproject = listMyProject
    ?.filter((name: any) => {
      if (seacrhProject === '') {
        return name;
      } else {
        return name?.name?.toLowerCase()?.includes(seacrhProject?.toLowerCase());
      }
    })
  const filterSharingproject = listShareProject
    ?.filter((name: any) => {
      if (seacrhProject === '') {
        return name;
      } else {
        return name?.name?.toLowerCase()?.includes(seacrhProject?.toLowerCase());
      }
    })
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
  const handleTogglePopup = (id: any) => {
    setIdEdit(id);
    setTooglePopup(!togglePopup);
  };
  const activeHomePage = () => {
    setSearchProject('')
    setTogglePage({
      home: true,
      myProject: false,
      sharingProject: false
    })
    setHightLightBtn({
      btnMyproject: false,
      btnShare: false
    })
  }
  const activeMyproject = () => {
    setSearchProject('')
    setTogglePage({
      home: false,
      myProject: true,
      sharingProject: false
    })
    setHightLightBtn({
      btnMyproject: true,
      btnShare: false
    })
  }
  const activeSharing = () => {
    setSearchProject('')
    setTogglePage({
      home: false,
      myProject: false,
      sharingProject: true
    })
    setHightLightBtn({
      btnMyproject: false,
      btnShare: true
    })
  }
  const toggleActiveBtnMyproject = () => {
    setHightLightBtn({
      btnMyproject: true,
      btnShare: false
    })
    bottomRef.current.offsetLeft = 60
  }
  const toggleActiveBtnShare = () => {
    setHightLightBtn({
      btnMyproject: false,
      btnShare: true
    })
    bottomRef.current.offsetLeft = 0
  }
  const handleCloseModelEdit = () => {
    if (isEdit) {
      setIdEdit('')
      setTooglePopup(false)
    } else { return }
  }
  const handleEditNameProject = (infor: any) => {
    setNameEditProject(infor)
    setShowChangeNamePopup(true)
  }
  const handleSharing = (project: any) => {
    setIdProject(project.id)
    setSharingPopup(true)
    setNameEditProject(project.name)
  }
  const handleDeleteProject = (nameProject: any) => {
    setShowDeleteProject(true)
    setSelectedProject({
      id: nameProject.id,
      name: nameProject.name
    })
  }
  const transformDate = (dayInit: any) => {
    const todayInitialCashFlow = new Date(dayInit)
    const month = todayInitialCashFlow.toLocaleString('en-US', { month: 'short' })
    const day = todayInitialCashFlow.getDate();
    const year = todayInitialCashFlow.getFullYear()
    return {
      month, day, year
    }
  }
  const onHoverIn = (event: any, id: string) => {
    event?.preventDefault();
    if (id === activeId) return
    setActiveId(id)
  }
  const onHoverOut = (event: any) => {
    event?.preventDefault();
    setActiveId('0')
  }
  const currentSubscriptionType = currentPlan?.ownerActiveSubscription?.toString().split(' ')

  useEffect(() => {
    const trialExpired = data?.listProjects?.ownerSubscriptionExpiresAt
    const today = new Date()?.toISOString()?.slice(0, 10)
    if (trialExpired === today || trialExpired < today) {
      navigate('/expiredTrial')
    }
  }, [data])

  useEffect(() => {
    const faltArrProject = data?.listProjects?.projects?.concat(data?.listProjects?.sharingProjects)
    setListMyProject(data?.listProjects?.projects)
    setListShareProject(data?.listProjects?.sharingProjects)
    setListProject(faltArrProject)
    setCurrentPlan({
      ownerActiveSubscription: data?.listProjects?.ownerActiveSubscription,
      ownerSubscriptionExpiresAt: SubscriptionFactory?.getExpiredSubscription(new Date(data?.listProjects?.ownerSubscriptionExpiresAt))
    })
  }, [data])

  useEffect(() => {
    if (seacrhProject?.length > 0) {
      setTogglePage({
        home: true,
        myProject: false,
        sharingProject: false
      })
    }
    if (seacrhProject?.length === 0) {
      setHightLightBtn({
        btnMyproject: true,
        btnShare: false
      })
    }
  }, [seacrhProject])

  useEffect(() => {
    if (!inforUser) return
    setUserName(inforUser?.getUser.user.firstName + " " + inforUser?.getUser.user.lastName)
  }, [inforUser])
  return (
    <>
      <div id='listProject-container'>
        <div className='listProject-header' >
          <div className='listProject-logo'>
            <img
              className="listProject-image"
              src={process.env.REACT_APP_CLIENT_URL + 'img/Logo.svg'}
              alt="logo"
            />
            <span className='listProject-name-logo'>
              CashGPS
            </span>
          </div>
          <div className='listProject-header-right'>
            <div className='listProject-search'>
              <div className='listProject-input'>
                <img
                  src={process.env.REACT_APP_CLIENT_URL + 'img/search_icon.svg'}
                  alt="search"
                />
                <input
                  value={seacrhProject}
                  className='seacrh-input'
                  type='text'
                  onChange={(e) => setSearchProject(e.target.value)}
                  placeholder='Search projects' />
              </div>
              {/* <div className='listProject-upgrade' onClick={() => navigate('/subscription')}>
                              <img
                                  src={process.env.REACT_APP_CLIENT_URL + 'img/star_update_icon.svg'}
                                  alt="star"
                              />
                              <span className='upgrade-text'>Upgrade Now</span>
                          </div> */}
            </div>
            <div className='listProject-account' >
              <Ripples>
                <div >
                  <Avatar className='avatar-name' name={userName} onClick={() => setOpenAccountSetting(true)} />
                </div>
              </Ripples>
            </div>
          </div>

        </div>
        <div className='listProject-body'>
          <div className='menu-container' data-testid='list-project-menu'>
            <div className='listProject-menu'>
              <div data-testid='active-home' onClick={activeHomePage} className={togglePage.home === true && seacrhProject?.length === 0 ? 'bg-hightlight menu-item' : 'menu-item'}>
                {
                  togglePage.home && seacrhProject?.length === 0 ? <img
                    src={process.env.REACT_APP_CLIENT_URL + 'img/home_blue_icon.svg'}
                    alt="home"
                  /> :
                    <img
                      src={process.env.REACT_APP_CLIENT_URL + 'img/home_icon.svg'}
                      alt="home"
                    />
                }
                <span className='bg-gradiant'></span>
                <span className={togglePage.home && seacrhProject?.length === 0 ? 'menu-item-text bg-inherit ' : 'menu-item-text'} >Home</span>
              </div>
              <div data-testid='active-myProject' onClick={activeMyproject} className={togglePage.myProject && seacrhProject?.length === 0 ? 'bg-hightlight menu-item' : 'menu-item'}>
                {
                  togglePage.myProject && seacrhProject?.length === 0 ?
                    <img
                      src={process.env.REACT_APP_CLIENT_URL + 'img/folder_blue_icon.svg'}
                      alt="home"
                    /> :
                    <img
                      src={process.env.REACT_APP_CLIENT_URL + 'img/folder_icon.svg'}
                      alt="home"
                    />
                }
                <span className='bg-gradiant'></span>
                <span className={togglePage.myProject && seacrhProject?.length === 0 ? 'menu-item-text bg-inherit ' : 'menu-item-text'} >My projects</span>
              </div>
              <div data-testid='active-sharing' onClick={activeSharing} className={togglePage.sharingProject && seacrhProject?.length === 0 ? 'bg-hightlight menu-item' : 'menu-item'}>
                {
                  togglePage.sharingProject && seacrhProject?.length === 0 ?
                    <img
                      src={process.env.REACT_APP_CLIENT_URL + 'img/folder_share_blue_icon.svg'}
                      alt="home"
                    /> :
                    <img
                      src={process.env.REACT_APP_CLIENT_URL + 'img/folder_share_icon.svg'}
                      alt="home"
                    />
                }
                <span className='bg-gradiant'></span>
                <span className={togglePage.sharingProject && seacrhProject?.length === 0 ? 'menu-item-text bg-inherit ' : 'menu-item-text'}>Share with me</span>
              </div>
            </div>
            <div className='subscription-page' onClick={() => navigate('/subscription')}>
              <div>
                <p>My current plan:
                  {currentSubscriptionType && <span>{currentSubscriptionType[1] ? ` ${currentSubscriptionType[1]?.toLowerCase()}` : ' Free Trial'}</span>}
                </p>
                <p>{currentPlan?.ownerSubscriptionExpiresAt > 1 ? `${currentPlan?.ownerSubscriptionExpiresAt} days` : `${currentPlan?.ownerSubscriptionExpiresAt} day`} left</p>
              </div>
              <span className='bg-gradiant'></span>
              <div>
                <img
                  src={process.env.REACT_APP_CLIENT_URL + 'img/arrow-right.svg'}
                  alt="home"
                />
              </div>
            </div>
          </div>
          {
            togglePage.home || togglePage.myProject ?
              <div className='listProject-content ' onClick={() => handleCloseModelEdit()}>
                <div className='listProject-addProject'>
                  {
                    seacrhProject?.length > 0 ? null :
                      <>
                        <h3 className='addProject-text-home'>{togglePage.home ? "Home" : togglePage.myProject ? "My project" : "Sharing project"}</h3>
                        <div className='btn-addProject' onClick={() => navigate("/newProject")}>
                          <img
                            src={process.env.REACT_APP_CLIENT_URL + 'img/add_white.svg'}
                            alt="avatar"
                          />
                          <button >
                            New project
                          </button>
                        </div>
                      </>
                  }

                </div>
                <div className='list-container'>
                  {
                    seacrhProject?.length > 0 ? < div className='search-result'>
                      <h3>Search results</h3>
                      <h4>Result for <span>{seacrhProject}</span> in <span>{highlightBtn.btnMyproject === true ? 'My Projects' : 'Share with me'}</span></h4>
                      <div className='category-project'>
                        <span ref={bottomRef} className={highlightBtn.btnMyproject ? 'bottom-category ' : 'bottom-category positionSharing'}></span>
                        <button
                          onClick={toggleActiveBtnMyproject}
                          className={highlightBtn.btnMyproject === true ? 'btn-myProject btn-border-bottom' : 'btn-myProject '} >My projects
                        </button>
                        <button
                          onClick={toggleActiveBtnShare}
                          className={highlightBtn.btnShare === true ? 'btn-sharing btn-border-bottom' : 'btn-sharing '} >Share with me
                        </button>
                      </div>
                    </div> : null
                  }
                  {
                    filterProject?.length === 0 && seacrhProject?.length === 0 || (seacrhProject?.length === 0 && filterSharingproject?.length === 0 && highlightBtn.btnShare === true) || (seacrhProject?.length === 0 && filterMyproject?.length === 0 && highlightBtn.btnMyproject === true) ?
                      // <div className='no-result-container'>
                      //     <img
                      //         src={process.env.REACT_APP_CLIENT_URL + 'img/Noresultsfound.svg'}
                      //         alt="home"
                      //     />
                      //     <h3>No results found</h3>
                      //     <h4>Try adjusting your search or filter to find what you’re looking for.</h4>
                      // </div>
                      <div className='text-nothing'>You don’t have any project</div> :
                      (filterProject?.length === 0 && seacrhProject?.length > 0 || seacrhProject?.length > 0 && filterSharingproject?.length === 0 && highlightBtn.btnShare === true) || (seacrhProject?.length > 0 && filterMyproject?.length === 0 && highlightBtn.btnMyproject === true) ?
                        <div className='no-result-container'>
                          <img
                            src={process.env.REACT_APP_CLIENT_URL + 'img/Noresultsfound.svg'}
                            alt="home"
                          />
                          <h3>No results found</h3>
                          <h4>Try adjusting your search or filter to find what you’re looking for.</h4>
                        </div>
                        :
                        filterSharingproject?.length === 0 && highlightBtn.btnShare === true ?
                          <div className='no-result-container'>
                            <img
                              src={process.env.REACT_APP_CLIENT_URL + 'img/Noresultsfound.svg'}
                              alt="home"
                            />
                            <h3>No results found</h3>
                            <h4>Try adjusting your search or filter to find what you’re looking for.</h4>
                          </div>
                          :
                          (
                            seacrhProject?.length === 0 && togglePage.home ? filterProject :
                              highlightBtn.btnMyproject ? filterMyproject : filterSharingproject
                          )
                            ?.map((project: any) => {
                              const dateInitCashFlow = transformDate(project?.initialCashFlow)
                              const dateCreated = transformDate(project?.startDate)
                              const sameProjectSharing: any = listShareProject?.some((element1: any) =>
                                element1.name?.includes(project.name)
                              );
                              const rolePermission = project.permission === "Can View" ? "VIEW" : "EDIT"
                              return (
                                <div className='project-item-container'>
                                  <div className={`project-item`} onClick={() => sameProjectSharing ? navigate(`/sharing/${rolePermission}/${project.ownerId}/${project.id}`) : navigate(`${project.id}`)}>
                                    <div className='project-name'>
                                      <img src={sameProjectSharing ? process.env.REACT_APP_CLIENT_URL + "img/Folder_Share.svg" : process.env.REACT_APP_CLIENT_URL + 'img/folder_myproject.svg'} alt="folder_myProject" />
                                      < span className='project-name-text'>{project?.name}</span>
                                    </div>
                                    <div className='btn-edit'>
                                      hide
                                    </div>
                                    <div className='project-createAt'>
                                      Created on  {dateInitCashFlow.day} {dateInitCashFlow.month}, {dateInitCashFlow.year}
                                    </div>
                                    <div className='project_sharing'>
                                      {project?.iconShare || ''}
                                    </div>
                                  </div>
                                  <div className='project-detail' onClick={() => sameProjectSharing ? navigate(`/sharing/${rolePermission}/${project.ownerId}/${project.id}`) : navigate(`${project.id}`)} onMouseOver={(e) => onHoverIn(e, project.id)} onMouseLeave={onHoverOut}>
                                    <div className='project-detail-header'>
                                      <div className='infor-project' >
                                        <span>Start date</span>
                                        <span> {dateCreated.day} {dateCreated.month}, {dateCreated.year}</span>
                                      </div>
                                      <div className='infor-project'>
                                        <span>Start balance</span>
                                        <span> {Math.round(project.startingBalance).toLocaleString()} {getCurrencySymbol('en-US', project?.currency)}</span>
                                      </div>
                                      {/* <div className='infor-project'>
                                                                              <span>Created on</span>
                                                                              <span> {dateInitCashFlow.day} {dateInitCashFlow.month}, {dateInitCashFlow.year}</span>
                                                                          </div> */}
                                      <div className='infor-project'>
                                        <span>Created by</span>
                                        <span className='infor-createBy-detail'>
                                          {project.ownerFirstName} {project.ownerLastName}
                                          <img
                                            src={process.env.REACT_APP_CLIENT_URL + 'img/avatar_ico.svg'}
                                            alt="home"
                                          />
                                        </span>
                                      </div>
                                      <div className='infor-shareBy'>
                                        {
                                          project.sharedWith?.length > 0 ? <h3>Shared with</h3> : null
                                        }
                                        <div className='infor-createBy-detail'>
                                          {
                                            project.sharedWith?.map((sharer: any) => {
                                              return (
                                                <h3>
                                                  {sharer.firstName} {sharer.lastName}
                                                  <img
                                                    src={process.env.REACT_APP_CLIENT_URL + 'img/avatar_ico.svg'}
                                                    alt="home"
                                                  />
                                                </h3>
                                              )
                                            })
                                          }

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    sameProjectSharing ? null : <img
                                      onClick={() => handleTogglePopup(project.id)}
                                      className='btn-edit-image'
                                      src={process.env.REACT_APP_CLIENT_URL + 'img/dot_icon.svg'}
                                      alt="home"
                                    />
                                  }
                                  {
                                    isEdit === project.id && togglePopup === true ?
                                      <div className='edit-container'>
                                        <h3 onClick={() => handleEditNameProject(project)}>Edit name</h3>
                                        <h3 onClick={() => handleSharing(project)}>Share project
                                        </h3>
                                        <h3 className='btn-delete' onClick={() => handleDeleteProject(project)}>Delete project</h3>
                                      </div> : null
                                  }
                                </div>
                              )
                            })
                  }
                </div>
              </div> : togglePage.myProject || togglePage.sharingProject === true ?
                <div className='listProject-content' onClick={() => handleCloseModelEdit()}>
                  <div className='list-container'>
                    {
                      filterMyproject?.length === 0 || (listMyProject?.length === 0 && togglePage.myProject) || (listShareProject?.length === 0 && togglePage.sharingProject) ?
                        // <div className='no-result-container'>
                        //     <img
                        //         src={process.env.REACT_APP_CLIENT_URL + 'img/Noresultsfound.svg'}
                        //         alt="home"
                        //     />
                        //     <h3>No results found</h3>
                        //     <h4>Try adjusting your search or filter to find what you’re looking for.</h4>
                        // </div>
                        <div className='text-nothing'>You don’t have any project</div>
                        :
                        (togglePage.myProject ? listMyProject : listShareProject)?.map((project: any) => {
                          const dateInitCashFlow = transformDate(project?.initialCashFlow)
                          const dateCreated = transformDate(project?.startDate)
                          const sameShairngProject: any = listShareProject?.some((element1: any) => element1.name?.includes(project.name));
                          const rolePermission = project.permission === "Can View" ? "VIEW" : "EDIT"
                          return (
                            <div className='project-item-container'>
                              <div
                                className='project-item'

                                onClick={() => sameShairngProject ? navigate(`/sharing/${rolePermission}/${project.ownerId}/${project.id}`) : navigate(`${project.id}`)}>

                                <div className='project-name'>
                                  <img src={listShareProject && !togglePage.myProject ? process.env.REACT_APP_CLIENT_URL + "img/Folder_Share.svg" : process.env.REACT_APP_CLIENT_URL + 'img/folder_myproject.svg'} alt="folder_myProject" />
                                  <span className='project-name-text'>{project?.name}</span>
                                </div>
                                <div className='btn-edit'>
                                  hide
                                </div>
                                <div className='project-createAt'>
                                  Created on {dateInitCashFlow.day} {dateInitCashFlow.month}, {dateInitCashFlow.year}
                                </div>
                                <div className='project_sharing'>
                                  {project?.iconShare || ''}
                                </div>
                              </div>
                              <div className='project-detail' onMouseOver={(e) => onHoverIn(e, project.id)}>
                                <div className='project-detail-header'>
                                  <div className='infor-project' >
                                    <span>Start date</span>
                                    <span> {dateCreated.day} {dateCreated.month}, {dateCreated.year}</span>
                                  </div>
                                  <div className='infor-project'>
                                    <span>Start balance</span>
                                    <span> {Math.round(project.startingBalance).toLocaleString()} {getCurrencySymbol('en-US', project?.currency)}</span>
                                  </div>
                                  {/* <div className='infor-project'>
                                                                      <span>Created on</span>
                                                                      <span> {dateInitCashFlow.day} {dateInitCashFlow.month}, {dateInitCashFlow.year}</span>
                                                                  </div> */}
                                  <div className='infor-project'>
                                    <span>Created by</span>
                                    <span className='infor-createBy-detail'>
                                      {project.ownerFirstName} {project.ownerLastName}
                                      <img
                                        src={process.env.REACT_APP_CLIENT_URL + 'img/avatar_ico.svg'}
                                        alt="home"
                                      />
                                    </span>
                                  </div>
                                  <div className='infor-shareBy'>
                                    {
                                      project.sharedWith?.length > 0 ? <h3>Shared with</h3> : null
                                    }
                                    <div className='infor-createBy-detail'>
                                      {
                                        project.sharedWith?.map((sharer: any) => {
                                          return (
                                            <h3>
                                              {sharer.firstName} {sharer.lastName}
                                              <img
                                                src={process.env.REACT_APP_CLIENT_URL + 'img/avatar_ico.svg'}
                                                alt="home"
                                              />
                                            </h3>
                                          )
                                        })
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {
                                sameShairngProject ? null : <img
                                  onClick={() => handleTogglePopup(project.id)}
                                  className='btn-edit-image'
                                  src={process.env.REACT_APP_CLIENT_URL + 'img/dot_icon.svg'}
                                  alt="home"
                                />
                              }

                              {
                                isEdit === project.id && togglePopup === true ?
                                  <div className='edit-container'>
                                    <h3 onClick={() => handleEditNameProject(project)}>Edit name</h3>
                                    <h3 onClick={() => handleSharing(project)}>Share project</h3>
                                    <h3 className='btn-delete' onClick={() => handleDeleteProject(project)}>Delete project</h3>
                                  </div> : null
                              }
                            </div>
                          )
                        })
                    }
                  </div>
                </div>
                : null
          }
        </div>
      </div>
      {openAccountSetting ?
        <UserSetting
          setLoading={setLoading}
          setOpenAccountSetting={setOpenAccountSetting}
          setEditAccount={setEditAccount}
          setIsOpenBilling={setIsOpenBilling}
          setBillsHistory={setBillsHistory} /> : null}
      {isOpenBilling ? <Billing setIsOpenBilling={setIsOpenBilling} loading={loading} billsHistory={billsHistory} /> : null}
      {
        showChangeNamePopup ? <ChangeNameProject
          setNameEditProject={setNameEditProject}
          setShowProjectSetting={() => { }}
          setShowChangeNameProject={() => { }}
          setShowChangeNamePopup={setShowChangeNamePopup}
          nameEditProject={nameEditProject}
        /> : null
      }
      {
        showSharingPopup ? <Sharing
          nameEditProject={nameEditProject}
          idProject={idProject}
          setSharingPopup={setSharingPopup}
        /> : null

      }
      {
        editAccount ? <UserSettings
          setEditAccount={setEditAccount}
          setShowProfile={() => { }}
          setShowChangeName={setShowChangeName}
          setEditInforProject={() => { }}
          setShowTimeZone={setShowTimeZone}
          setShowCurrency={setShowCurrency}
          setShowChangePassword={setShowChangePassword}
        /> : null
      }{
        showChangeName ? <ChangeName
          setEditAccount={setEditAccount}
          setShowProfile={() => { }}
          setShowChangeName={setShowChangeName} /> : null
      }
      {
        showTimeZone ? <TimeZone
          setEditAccount={setEditAccount}
          setShowTimeZone={setShowTimeZone}
          setEditInforProject={() => { }}
        /> : null
      }
      {
        showCurrency ? <ChangeCurrency
          setEditAccount={setEditAccount}
          setShowCurrency={setShowCurrency}
          setEditInforProject={() => { }}
        /> : null
      }
      {
        showChangePassword ? <ChangePassWord
          setEditAccount={setEditAccount}
          setShowProfile={() => { }}
          setShowChangePassword={setShowChangePassword}
          setEditInforProject={() => { }}
        /> : null
      }
      {
        showDeleteProject ? <DeleteProject
          setShowDeleteProject={setShowDeleteProject}
          selectedProject={selectedProject}
        /> : null
      }
    </>
  )
}

export default ListProject