import React, { useContext, useRef } from 'react';
import './DeleteCategory.scss';
import { useMutation, useQuery } from '@apollo/client';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { UserCtx } from '../../../../context/user/state';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import { toast } from 'react-toastify';
import {
  DELETE_CASH_GROUP,
  DELETE_CATEGORY,
} from '../../../../graphql/Mutation';
import { useParams } from 'react-router-dom';

function DeleteCategory({
  setShowCategoryGroupPopup,
  setShowDeletePopup,
  setShowProjectSetting,
  listNameCategoryEdit,
  setListNameCategoryEdit,
}: any) {
  let modalRef: any = useRef();
  const [deleteCategory, { data }] =
    useMutation(DELETE_CATEGORY);
  const {
    category,
    setCategory,
    cashGroup,
    setCashGroup,
    cashPerDayIn,
    setCashPerDayIn,
    cashPerDayOut,
    setCashPerDayOut,
  } = useContext(UserCtx);
  const param = useParams()
  const [detleteCashGroup] = useMutation(DELETE_CASH_GROUP);
  const { refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });

  const handleShowCategoryGorup = () => {
    setCashGroup('');
    setCategory('');
    setShowDeletePopup(false);
    setShowCategoryGroupPopup(true);
  };

  const handleShowProjectSetting = () => {
    setCashGroup('')
    setCategory('')
    setShowDeletePopup(false)
    setShowProjectSetting(true)
  }

  const handleDeleteCategory = () => {


    const dataCoppy = [...listNameCategoryEdit]
    const newListData = dataCoppy?.filter((item: any) => item?.id !== category?.id)
    setListNameCategoryEdit(newListData)
    deleteCategory({
      variables: {
        deleteRowArgs: {
          id: category?.id
        }
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
      onCompleted: ({ deleteCashEntryRow: { messageOfDeletion } }) => {
        if (messageOfDeletion === 'Entry row was removed') {
          refetch({ projectId: param?.projectId })
          setCategory('')
          setShowDeletePopup(false)
          toast.success("Category has been deleted", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowCategoryGroupPopup(true)
          const newTransactionIn = cashPerDayIn.map((cashPerDay: any) => {
            return {
              ...cashPerDay,
              cashEntryRow: cashPerDay.cashEntryRow.filter((entryRow: any) => entryRow.id !== category.id)
            }
          })
          setCashPerDayIn(newTransactionIn)
          const newTransactionOut = cashPerDayOut.map((cashPerDay: any) => {
            return {
              ...cashPerDay,
              cashEntryRow: cashPerDay.cashEntryRow.filter((entryRow: any) => entryRow.id !== category.id)
            }
          })
          setCashPerDayOut(newTransactionOut)
        }
      }
    })
  }

  const handleDeleteCashGroup = () => {
    if (cashGroup) {
      detleteCashGroup({
        variables: {
          deleteGroupArgs: {
            id: cashGroup?.cashId,
          },
        },
        onCompleted: ({ deleteCashGroup: { messageOfDeletion } }) => {
          if (messageOfDeletion === 'Cash group was removed') {
            refetch({ projectId: param?.projectId })
            setShowDeletePopup(false);
            setShowProjectSetting(true);
            toast.success("Cash group  has been deleted", {
              position: toast.POSITION.TOP_RIGHT,
            });
            if (cashGroup?.groupType === "IN") {
              const perrArr = Object.entries(cashPerDayIn as any)
              const arr = perrArr?.map((item: any) => {
                return {
                  ...item[1]
                }
              })
              const cashPer: any = arr?.filter((cashin: any) => cashin?.id !== cashGroup?.cashId)
              setCashPerDayIn(cashPer)
            } else {
              const perrArr = Object.entries(cashPerDayOut as any)
              const arr = perrArr?.map((item: any) => {
                return {
                  ...item[1]
                }
              })
              const cashPer: any = arr?.filter((cashin: any) => cashin?.id !== cashGroup?.cashId)
              setCashPerDayOut(cashPer)
            }

          } else {
            return
          }
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
      });
    }
  };
  HandleCloseModal(modalRef, setShowDeletePopup);
  return (
    <>
      {category &&
        (cashGroup?.cashId === '' || cashGroup?.cashId === undefined) ? (
        <div id="deleteCategory-container">
          <div className="deleteCategory-content" ref={modalRef}>
            <div className="deleteCategory-header">
              <h4>Delete category</h4>
              <img
                onClick={handleShowCategoryGorup}
                src={
                  process.env.REACT_APP_CLIENT_URL +
                  'img/closeNewtransaction.svg'
                }
                alt="logo"
              />
            </div>
            <div className="deleteCategory-main">
              <h4>
                {/* Are you ensure to delete this "{category?.name}" category? */}
                Are you ensure to delete this “{category?.name}” category? All transaction data will be removed. This can’t be undone.
              </h4>
              <div className="deleteCategory-group-btn">
                <button
                  onClick={handleShowCategoryGorup}
                  className="deleteCategory-btn-cancel">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="deleteCategory-btn-delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="deleteCategory-container">
          <div className="deleteCategory-content" ref={modalRef}>
            <div className="deleteCategory-header">
              <h4>Delete category</h4>
              <img
                onClick={handleShowCategoryGorup}
                src={
                  process.env.REACT_APP_CLIENT_URL +
                  'img/closeNewtransaction.svg'
                }
                alt="logo"
              />
            </div>
            <div className="deleteCategory-main">
              <h4>
                Are you ensure to delete this "{cashGroup?.cashName}" cash
                group?
              </h4>
              <div className="deleteCategory-group-btn">
                <button
                  onClick={handleShowProjectSetting}
                  className="deleteCategory-btn-cancel">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCashGroup}
                  className="deleteCategory-btn-delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteCategory;