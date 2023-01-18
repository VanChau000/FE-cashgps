import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import './Sharing.scss';
import { DELETE_EMAIL_SHARING, SET_ROLE_EMAIL_SHARING, INVITED } from '../../../../graphql/Mutation';
import { useMutation, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { GET_LIST_SHARE_USER } from '../../../../graphql/Query';
import { toast } from 'react-toastify';

function Sharing({ setShowSharingPopup, setSharingPopup, idProject, nameEditProject }: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  let inputRefTwo: any = useRef()
  let listEmailRef: any = useRef()
  const [invited, { data, loading: inviteLoding, error: inviteError },] = useMutation(INVITED);
  const [deleteRoleSharing] = useMutation(DELETE_EMAIL_SHARING);
  const [setRoleEmailSharing] = useMutation(SET_ROLE_EMAIL_SHARING);
  const [email, setEmail] = useState<any>('');
  const [emailCoppy, setEmailCoppy] = useState<any>('')
  const [errRegistedEmail, setErrRegistedEmail] = useState<any>('')
  const [listErrorEmail, setListErrorEmail] = useState<any>([])
  const [checkExsitEmail, setCheckExsitEmail] = useState<any>(false)
  const { data: listShareUser, refetch }: any = useQuery(GET_LIST_SHARE_USER, {
    variables: {
      projectId: idProject
    }
  });
  const [listEmail, setListEmail] = useState<any>([])
  const getRandomColorBackGround = () => {
    function randomInteger(max: any) {
      return Math.floor(Math.random() * (max + 1));
    }
    function randomRgbColor() {
      let r = randomInteger(255);
      let g = randomInteger(255);
      let b = randomInteger(255);
      return [r, g, b];
    }
    function randomHexColor() {
      let [r, g, b] = randomRgbColor();

      let hr = r.toString(16).padStart(2, '0');
      let hg = g.toString(16).padStart(2, '0');
      let hb = b.toString(16).padStart(2, '0');

      return "#" + hr + hg + hb;
    }
    return randomHexColor()
  }

  useEffect(() => {
    if (listEmail?.length === 0 && !emailCoppy) {
      inputRef && inputRef?.current?.focus()
      setListErrorEmail([])
      setErrRegistedEmail('')
      setCheckExsitEmail(false)
    }
    if (listErrorEmail?.length === 0) {
      setCheckExsitEmail(false)
    }
    inputRefTwo && inputRefTwo?.current?.focus()
    inputRef && inputRef?.current?.focus()
  }, [listEmail, checkExsitEmail, emailCoppy])

  const handleSetRole = () => {
    setErrRegistedEmail('')
    // setListErrorEmail([])
    const isEmail = (email: any) =>
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    if (emailCoppy && !isEmail(emailCoppy)) {
      setErrRegistedEmail('invalid email')
      return
    }
    // else if (listErrorEmail?.length > 0 || (listEmail?.length === 0 && emailCoppy?.length === 0)) {
    //   return
    // } 
    else {
      const singleEmail = {
        id: uuidv4(),
        email: emailCoppy
      }
      invited({
        variables: {
          invitationArgs: {
            projectId: idProject,
            emails: emailCoppy ? [singleEmail] : listEmail,
            permission: 'VIEW',
          },
        },
        onCompleted: ({ invite, email }) => {
          if (invite?.length === 0) {
            refetch()
            setEmailCoppy('')
            setListEmail([])
            setListErrorEmail([])
            setCheckExsitEmail(false)
            toast.success("shared emails successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            setCheckExsitEmail(true)
            setListErrorEmail(invite)
            setErrRegistedEmail('This email is not registered.')
          }
        }
      });
    }
  };
  const handleClsoeModal = () => {
    if (setSharingPopup) {
      setSharingPopup(false)
    }
    setShowSharingPopup(false)
  }

  const handleKeydown = (e: any) => {
    if (e.key === 'Backspace' && email === '') {
      const listEmailCoppy = [...listEmail]
      listEmailCoppy.splice(-1)
      setListEmail(listEmailCoppy)
      inputRef && inputRef.current.focus()
      inputRefTwo && inputRefTwo.current.foucus()
    } else if (e.key === 'Enter') {
      if (emailCoppy?.length > 0 || email?.length > 0) {
        const isEmail = (email: any) =>
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailCoppy ? emailCoppy : email);
        const newEmail = {
          id: uuidv4(),
          email: emailCoppy ? emailCoppy : email
        }
        if (!isEmail(emailCoppy ? emailCoppy : email)) {
          setListErrorEmail([
            ...listErrorEmail,
            newEmail
          ])
        }
        setListEmail([
          ...listEmail,
          newEmail
        ])
        setEmail('')
        setEmailCoppy('')
        inputRef && inputRef.current.focus()
        inputRefTwo && inputRefTwo.current.focus()
      }
    }
  }

  const hanldeAddEmail = (e: any) => {
    if (e.key === 'Enter') {
      if (emailCoppy?.length > 0 || email?.length > 0) {
        setErrRegistedEmail('')
        const isEmail = (email: any) =>
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailCoppy ? emailCoppy : email);
        const newEmail: any = {
          id: uuidv4(),
          email: emailCoppy
        }
        if (!isEmail(newEmail?.emailCoppy)) {
          setListErrorEmail([
            ...listErrorEmail,
            newEmail
          ])
        }
        setListEmail([
          ...listEmail,
          newEmail
        ])
        setEmail('')
        setEmailCoppy('')
        inputRef && inputRef.current.focus()
        inputRefTwo && inputRefTwo.current.focus()
      }
    }
  }

  const handleDeleteEmail = (id: any) => {

    const filterEmail = listEmail?.filter((email: any) => email?.id?.toString() !== id?.toString())
    const filterEmailError = listErrorEmail?.filter((email: any) => email?.id?.toString() !== id?.toString())
    setListEmail([...filterEmail])
    setListErrorEmail([...filterEmailError])
    if (emailCoppy) {
      setEmailCoppy(emailCoppy)
    }
    inputRefTwo && inputRefTwo.current.focus()
  }
  const handleOnChange = (e: any, userId: any, idProject: any) => {
    if (e.target.value === "view") {
      setRoleEmailSharing({
        variables: {
          sharingArgs: {
            permission: "VIEW",
            projectId: idProject,
            userId: userId
          }
        },
        onCompleted: ({ updatePermission: { result } }) => {
          if (result === "Change permission successfully!") {
            refetch()
          }
        }
      })

    } else if (e.target.value === "edit") {
      setRoleEmailSharing({
        variables: {
          sharingArgs: {
            permission: "EDIT",
            projectId: idProject,
            userId: userId
          }
        },
        onCompleted: ({ updatePermission: { result } }) => {
          if (result === "Change permission successfully!") {
            refetch()
          }
        }
      })
    } else if (e.target.value === "remove") {
      deleteRoleSharing({
        variables: {
          userIdAndProjectId: {
            authorizedUserId: userId,
            projectId: idProject
          }
        },
        onCompleted: ({ deleteRecord: { messageOfDeletion } }) => {
          if (messageOfDeletion === "Removed account from project successfully!") {
            refetch()
          } else { return }
        }
      })
    }
  }
  // useEffect(() => {
  //   setListErrorEmail([])
  // }, [emailCoppy])
  useEffect(() => {
    if (inviteError?.message === "Upgrade your subscription to perform this action.") {
      toast.error(inviteError?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [inviteError?.message === "Upgrade your subscription to perform this action."])
  HandleCloseModal(modalRef, setShowSharingPopup);
  HandleCloseModal(modalRef, setSharingPopup);
  const renderSharer: any = React.useMemo(() => {
    return (
      listShareUser?.listInfoOfAuthorizedUsersWithProject[1]?.map((viewer: any, index: any) => {
        return (
          <div className="viewer">
            <div className="viewer-detail">
              <div className='circle-avatar' style={{ backgroundColor: `${getRandomColorBackGround()}` }}>
                <h3>{viewer?.firstName?.charAt(0)}{viewer?.lastName?.charAt(0)}</h3>
              </div>
              <div>
                <h3>{viewer?.firstName} {viewer?.lastName}</h3>
                <h4>{viewer?.email}</h4>
              </div>
            </div>
            {
              viewer?.permission === "PENDING" ?
                <select className='custom-select' onChange={(e) => handleOnChange(e, viewer?.userId, idProject)} value={viewer?.permission}>
                  <option value="pendding">{viewer?.permission}</option>
                  <option value="remove">Remove</option>
                </select>
                :
                viewer?.permission === "Can View" ?
                  <div>
                    <select className='custom-select' onChange={(e) => handleOnChange(e, viewer?.userId, idProject)} value={viewer?.permission}>
                      <option value="view">{viewer?.permission}</option>
                      <option value="edit">Can Edit</option>
                      <option value="remove">Remove</option>
                    </select>
                  </div>
                  :
                  <div>
                    <select className='custom-select' onChange={(e) => handleOnChange(e, viewer?.userId, idProject)} value={viewer?.permission}>
                      <option value="edit">{viewer?.permission}</option>
                      <option value="view">Can View</option>
                      <option value="remove">Remove</option>
                    </select>
                  </div>
            }
          </div>
        );
      })
    )

  }, [listShareUser])

  const renderOwner = useMemo(() => {
    return (
      listShareUser?.listInfoOfAuthorizedUsersWithProject[0]?.map((owner: any, index: any) => {
        return (
          <div className="viewer owner">
            <div className="viewer-detail">
              <div className='circle-avatar' style={{ backgroundColor: `${getRandomColorBackGround()}` }}>
                <h3>{owner?.firstName?.charAt(0)}{owner?.lastName?.charAt(0)}</h3>
              </div>
              <div>
                <h3>{owner?.firstName} {owner?.lastName}</h3>
                <h4>{owner?.email}</h4>
              </div>
            </div>
            <span>Owner</span>
          </div>
        )
      })
    )

  }, [listShareUser])

  return (
    <>
      <div id="sharing-container" >
        <div className="sharing-content" ref={modalRef}>
          <div className="sharing-header">
            <h4>Share {nameEditProject}</h4>
            <img
              onClick={() => handleClsoeModal()}
              src={
                process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'
              }
              alt="logo"
            />

          </div>
          <div className="sharing-main" >
            <div className="sharing-input">
              <h4>Only people who invited can view this project</h4>
              <div className='input-container'>
                {
                  listEmail?.length > 0 ?
                    <div className='listEmail-container' ref={listEmailRef}>
                      <div className='list-email'>
                        {listEmail?.map((element: any) => {
                          const errorEmails: any = listErrorEmail?.some((element1: any) =>
                            element1.email?.includes(element.email)
                          );
                          return (
                            <>
                              <div className={errorEmails && checkExsitEmail ? "bg-red-color" : errorEmails && !checkExsitEmail ? "red-color" : 'email-item'}>{element?.email}
                                {
                                  errorEmails && checkExsitEmail ?
                                    <img
                                      onClick={() => handleDeleteEmail(element.id)}
                                      src={
                                        process.env.REACT_APP_CLIENT_URL + 'img/closex_white_icon.svg'
                                      }
                                      alt="logo"
                                    /> :
                                    errorEmails && !checkExsitEmail ?
                                      <img
                                        onClick={() => handleDeleteEmail(element.id)}
                                        src={
                                          process.env.REACT_APP_CLIENT_URL + 'img/closex_red_icon.svg'
                                        }
                                        alt="logo"
                                      />
                                      :
                                      <img
                                        onClick={() => handleDeleteEmail(element.id)}
                                        src={
                                          process.env.REACT_APP_CLIENT_URL + 'img/closex_icon.svg'
                                        }
                                        alt="logo"
                                      />
                                }
                              </div>
                            </>
                          )
                        })}
                        <input
                          ref={inputRefTwo}
                          type="email"
                          placeholder=""
                          value={email}
                          disabled={checkExsitEmail}
                          onChange={e => setEmail(e.target.value)}
                          onKeyDown={e => handleKeydown(e)}
                        />
                      </div>

                    </div>
                    :
                    <input
                      className='input-email'
                      ref={inputRef}
                      type="email"
                      value={emailCoppy}
                      onChange={e => setEmailCoppy(e.target.value)}
                      onKeyDown={e => hanldeAddEmail(e)}
                    />
                }
                <button
                  // disabled={listErrorEmail?.length > 0 || !listEmail || !emailCoppy}
                  className={listErrorEmail?.length === 0 && listEmail?.length > 0 || emailCoppy ? "btn-hightLight " : "btn-sendEmail"}
                  onClick={() => handleSetRole()}>
                  Send invite
                </button>
              </div>
            </div>
            {
              errRegistedEmail ? <div className='text-err-email'>{errRegistedEmail}</div> : null
            }
            <div className="sharing-list-guest">
              <h4 className="max-member">Member: {listShareUser?.listInfoOfAuthorizedUsersWithProject[1]?.length}</h4>
              <div className="list-viewer">
                {renderOwner}
                {renderSharer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sharing;
