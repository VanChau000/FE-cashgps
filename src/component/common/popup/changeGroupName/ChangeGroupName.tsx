import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserCtx } from '../../../../context/user/state';
import { UPDATE_GROUP_NAME } from '../../../../graphql/Mutation';
import {
  GETSINGLEPROJECT,
  GET_LIST_NAME_GROUP,
  GET_CASH_GROUP_BY_TYPE,
} from '../../../../graphql/Query';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import './ChangeGroupName.scss';

function ChangeGroupName({
  setShowChangeGroupNamePopup,
  setShowCategoryGroupPopup,
  setShowProjectSetting,
  setNameCategory,
}: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const {
    nameCashGroup,
    setNameCashGroup,
    cashGroup,
    setCashGroup,
    cashPerDayIn,
    cashPerDayOut,
  } = useContext(UserCtx);
  const [updateGroupName] = useMutation(UPDATE_GROUP_NAME);
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });

  const [err, setErr] = useState<any>();
  const { data: listNameGroup } = useQuery(GET_LIST_NAME_GROUP);
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])
  const { data: listNameCategoryUpdate } = useQuery(GET_CASH_GROUP_BY_TYPE, {
    variables: {
      groupType: cashGroup?.groupType,
    },
  });

  const closeUpdateGroupName = () => {
    setShowChangeGroupNamePopup(false);
    setShowCategoryGroupPopup(true);
  };
  const handleUpdateGroupName = (e: any) => {
    e.preventDefault()
    updateGroupName({
      variables: {
        upsertGroupArgs: {
          upsertArgs: {
            name: nameCashGroup?.name || cashGroup?.cashName,
          },
          groupId: nameCashGroup?.id || cashGroup?.cashId,
          projectId: param?.projectId
        },
      },
      onCompleted: (result) => {
        const message = result?.createOrUpdateCashGroup?.result
        if (message === "Group was updated") {
          refetch({ projectId: param?.projectId })
          setNameCategory(nameCashGroup?.name);
          toast.success("Group name has been updated", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowChangeGroupNamePopup(false);
          setShowCategoryGroupPopup(true);
          const idx = nameCashGroup?.groupType === 'IN' ? cashPerDayIn.findIndex((c: any) => c.id === nameCashGroup.id) : cashPerDayOut.findIndex((c: any) => c.id === nameCashGroup.id)
          if (idx > -1) nameCashGroup?.groupType === 'IN' ? cashPerDayIn[idx] = { ...cashPerDayIn[idx], name: nameCashGroup.name } : cashPerDayOut[idx] = { ...cashPerDayOut[idx], name: nameCashGroup.name }
        } else if (message === "Group name already exists. Please try with another.")
          setErr("Group name already exists. Please try with another.")
        return
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
    });
  };

  const handleUpdateCashGroupName = (e: any) => {
    e.preventDefault()
    updateGroupName({
      variables: {
        upsertGroupArgs: {
          upsertArgs: {
            name: cashGroup?.cashName,
          },
          groupId: cashGroup?.cashId,
          projectId: param?.projectId
        }
      },
      onCompleted: result => {
        const message = result?.createOrUpdateCashGroup?.result
        if (message === 'Group was updated') {
          refetch({ projectId: param?.projectId })
          toast.success("Group name has been updated", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowChangeGroupNamePopup(false);
          setShowProjectSetting(true);
          setCashGroup(null);
        } else if (message === "Group name already exists. Please try with another.")
          setErr("Group name already exists. Please try with another.")
        return
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
    });
  };

  const closeUpdateCashGroupName = () => {
    setShowChangeGroupNamePopup(false);
    setShowProjectSetting(true);
  };
  HandleCloseModal(modalRef, setShowChangeGroupNamePopup);
  return (
    <>
      {nameCashGroup && cashGroup?.cashId === undefined ? (
        <div id="changeGroupName-container">
          <form onSubmit={handleUpdateGroupName}>
            <div className="changeGroupName-content" ref={modalRef}>
              <div className="changeGroupName-header">
                <h4>Change group name</h4>
                <img
                  onClick={closeUpdateGroupName}
                  src={
                    process.env.REACT_APP_CLIENT_URL +
                    'img/closeNewtransaction.svg'
                  }
                  alt="logo"
                />
              </div>
              <div className="changeGroupName-main">
                <div className="changeGroupName-input">
                  <h4>Group name</h4>
                  <div>
                    <input
                      ref={inputRef}
                      maxLength={20}
                      value={nameCashGroup?.name}
                      onChange={e =>
                        setNameCashGroup({ ...nameCashGroup, name: e.target.value })
                      }
                    />
                    <span>  {nameCashGroup?.name?.length}/20</span>
                  </div>
                  <span>{err}</span>
                </div>
                <button
                  onClick={handleUpdateGroupName}
                  disabled={!nameCashGroup}
                  className={
                    nameCashGroup?.name?.length > 0
                      ? 'changeGroupName-btn-save-active'
                      : 'changeGroupName-btn-save'
                  }>
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div id="changeGroupName-container">
          <form onSubmit={handleUpdateCashGroupName}>
            <div className="changeGroupName-content" ref={modalRef}>
              <div className="changeGroupName-header">
                <h4>Change group name</h4>
                <img
                  onClick={closeUpdateCashGroupName}
                  src={
                    process.env.REACT_APP_CLIENT_URL +
                    'img/closeNewtransaction.svg'
                  }
                  alt="logo"
                />
              </div>
              <div className="changeGroupName-main">
                <div className="changeGroupName-input">
                  <h4>Group name</h4>
                  <div>
                    <input
                      ref={inputRef}
                      maxLength={20}
                      value={cashGroup?.cashName}
                      onChange={e =>
                        setCashGroup({ ...cashGroup, cashName: e.target.value })
                      }
                    />
                    <span>  {cashGroup?.cashName?.length}/20</span>
                  </div>
                  <span>{err}</span>
                </div>
                <button
                  onClick={handleUpdateCashGroupName}
                  disabled={!cashGroup}
                  className={
                    cashGroup?.cashName?.length > 0
                      ? 'changeGroupName-btn-save-active'
                      : 'changeGroupName-btn-save'
                  }>
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ChangeGroupName;
