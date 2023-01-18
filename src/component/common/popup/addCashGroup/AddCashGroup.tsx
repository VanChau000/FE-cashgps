import React, { useContext, useEffect, useRef, useState } from 'react';
import './AddCashGroup.scss';
import { CREATE_CASH_GROUP } from '../../../../graphql/Mutation';
import { useMutation, useQuery } from '@apollo/client';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import { UserCtx } from '../../../../context/user/state';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  GETSINGLEPROJECT,
  GET_LIST_NAME_GROUP,
} from '../../../../graphql/Query';

function AddCashGroup({ setShowAddGroupPopup, typeCashGroup }: any) {
  let modalRef: any = useRef()
  let inputRef: any = useRef()
  const param = useParams()
  const [errCashGroupName, setErrCashGroupName] = useState('')
  const [createCashGroup, { data, loading, error }] = useMutation(CREATE_CASH_GROUP)
  const { data: listNameGroup } = useQuery(GET_LIST_NAME_GROUP)
  const [err, setErr] = useState<any>();
  // let cashPerDayLength = cashPerDayIn?.length();

  const [nameGroupCashIn, setNameGroupCashIn] = useState<any>();
  const [nameGroupCashOut, setNameGroupCashOut] = useState<any>();
  const [cashGroupName, setCashGroupName] = useState({
    cashGroup: typeCashGroup === "IN" ? "IN" : "OUT",
    cashName: ''
  })
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });

  useEffect(() => {
    inputRef.current && inputRef.current.focus()

  }, [])
  useEffect(() => {
    setNameGroupCashIn(listNameGroup?.listGroups?.filteredGroups?.in);
    setNameGroupCashOut(listNameGroup?.listGroups?.filteredGroups?.out);
  }, [listNameGroup]);
  const handleChangeTransValue = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCashGroupName({
      ...cashGroupName,
      [e.target.name]: value,
    });
  };
  const listGorupIn = nameGroupCashIn?.map((name: any) => {
    return name.name;
  });
  const listGorupOut = nameGroupCashOut?.map((name: any) => {
    return name.name;
  });

  const handeAddGroupName = (e: any) => {
    e.preventDefault()
    createCashGroup({
      variables: {
        upsertGroupArgs: {
          projectId: param?.projectId,
          upsertArgs: {
            name: cashGroupName?.cashName,
            groupType: cashGroupName?.cashGroup,
            displayMode: 'USED',
          },
        },
      },
      onCompleted: ({ createOrUpdateCashGroup: { result } }) => {
        if (result === 'Group was inserted') {
          refetch({ projectId: param?.projectId })
          toast.success("Cash group has been created", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowAddGroupPopup(false);
        } else if (result === "Group name already exists. Please try with another.") {
          setErr("Group name already exists. Please try with another.")
        }
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
    });
  };
  useEffect(() => {
    if (error?.message === "Upgrade your subscription to perform this action.") {
      toast.error("Upgrade your subscription to perform this action.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (error?.message === "You are not authorized to perform this action") {
      toast.error("Upgrade your subscription to perform this action.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [error?.message])

  HandleCloseModal(modalRef, setShowAddGroupPopup);
  return (
    <>
      <div id="addCashGroup-container">
        <form onSubmit={handeAddGroupName}>
          <div className="addCashGroup-content" ref={modalRef}>
            <div className="addCashGroup-header">
              <h4>Add group</h4>
              <img
                onClick={() => setShowAddGroupPopup(false)}
                src={
                  process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'
                }
                alt="logo"
              />
            </div>
            <div className="addCashGroup-main">
              <div className="addCashGroup-main-input">
                <h5>Group name</h5>
                <div>
                  <input
                    maxLength={20}
                    ref={inputRef}
                    type="text"
                    name="cashName"
                    value={cashGroupName.cashName}
                    onChange={handleChangeTransValue}
                    autoComplete="off"
                  />
                  <span>{cashGroupName.cashName.length}/20</span>
                </div>
                <span>{errCashGroupName ? errCashGroupName : err}</span>
              </div>
              <div className="addCashGroup-main-selection">
                <h5>Mark the group as</h5>
                <div className="addCashGroup-input-radio">
                  <label>
                    <input
                      type="radio"
                      name="cashGroup"
                      value="IN"
                      checked={cashGroupName.cashGroup === 'IN'}
                      onChange={handleChangeTransValue}
                    />
                    <span>Cash in</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="cashGroup"
                      value="OUT"
                      checked={cashGroupName.cashGroup === 'OUT'}
                      onChange={handleChangeTransValue}
                    />{' '}
                    <span>Cash out</span>
                  </label>
                </div>
              </div>
              <button
                className={
                  cashGroupName.cashName
                    ? 'addCashGroup-btn'
                    : 'addCashGroup-btn-disabled'
                }
                disabled={!cashGroupName.cashName}
                onClick={handeAddGroupName}>
                Save
              </button>
            </div>
          </div>
        </form>

      </div>
    </>
  );
}
export default AddCashGroup;
