import { useContext, useEffect, useRef, useState } from 'react';
import './AddCategory.scss';
import { useMutation, useQuery } from '@apollo/client';
import { UserCtx } from '../../../../context/user/state';
import { HandleCloseModalAndDeleteValue } from '../../../../utils/ModalClose';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CREATE_CASH_ENTRY_ROW,
  UPDATE_CATEGORY_NAME,
  MUTATION_LIST_CASH_ENTRYROW,
} from '../../../../graphql/Mutation';
import {
  GETSINGLEPROJECT,
} from '../../../../graphql/Query';

function AddCategory({
  setShowAddCategoryPopup,
  valueCategory,
  setShowCategoryGroupPopup,
  setListNameCategoryEdit,
  listNameCategoryEdit,
}: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const {
    category,
    setCategory,
    idCash,
    cashPerDayIn,
    cashPerDayOut,
    cashGroup,
  } = useContext(UserCtx);
  const [categoryName, setCategoryName] = useState<any>();
  const [updateCategoryName] = useMutation(UPDATE_CATEGORY_NAME);
  const [errCashGroupName, setErrCashGroupName] = useState('');
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const [createCashEntryRow, { data, loading, error }] = useMutation(
    CREATE_CASH_ENTRY_ROW,
  );
  const [getListCategory, { data: listNameCategoryUpdate }] = useMutation(
    MUTATION_LIST_CASH_ENTRYROW,
    {
      variables: {
        listEntryRowInGroupArgs: {
          cashGroupId: idCash,
        },
      },
    },
  );
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])
  useEffect(() => {
    getListCategory();
  }, [idCash]);


  const handleAddCategory = (e: any) => {
    e.preventDefault()
    // const newList = nameCategory?.includes(categoryName.trim());
    // if (newList) {
    //   setErrCashGroupName('Category name already exists. Please try with another.');
    //   return;
    // } else
    if (categoryName && categoryName?.length < 21) {
      createCashEntryRow({
        variables: {
          upsertEntryRowArgs: {
            projectId: param?.projectId,
            upsertArgs: {
              cashGroupId: valueCategory?.id,
              name: categoryName,
              displayMode: 'USED',
            },
          },
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted: ({ createOrUpdateCashEntryRow: { result } }) => {
          if (result === 'Entry row was inserted') {
            refetch({ projectId: param?.projectId })
            setCategoryName('');
            toast.success("Category has been created", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowAddCategoryPopup(false);
          } else {
            setCategoryName('');
            setErrCashGroupName('Category name already exists. Please try with another.');
          }
        }
      });
    } else {
      setErrCashGroupName(
        'Cash name must be required and not longer than 20 characters',
      );
      return;
    }
  };
  const handleUpdateCategoryName = (e: any) => {
    e.preventDefault()
    if (category?.name && category?.name?.length < 21) {
      updateCategoryName({
        variables: {
          upsertEntryRowArgs: {
            projectId: param?.projectId,
            cashEntryRowId: category?.id,
            upsertArgs: {
              name: category?.name
            }
          }
        },
        onCompleted: ({ createOrUpdateCashEntryRow: { result } }) => {
          if (result === 'Entry row was updated') {
            const dataCoppy = [...listNameCategoryEdit];
            const a = [...dataCoppy]
            const newDataEdit = a && a.map(item => {
              if (item.id === category.id) {
                item = {
                  ...item,
                  name: category?.name,
                };
              }
              return item;
            });
            refetch({ projectId: param?.projectId })
            setListNameCategoryEdit([...newDataEdit])
            setCategory('')
            toast.success("Category has been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowAddCategoryPopup(false)
            setShowCategoryGroupPopup(true)
            const indexTransactionIn = cashPerDayIn.findIndex((c: any) => c.id === category.cashGroupId)
            const idxCashRowIn = cashPerDayIn[indexTransactionIn]?.cashEntryRow.findIndex((cPerDay: any) => cPerDay.id === category.id)
            if (idxCashRowIn > -1) cashPerDayIn[indexTransactionIn].cashEntryRow[idxCashRowIn] = { ...cashPerDayIn[indexTransactionIn].cashEntryRow[idxCashRowIn], name: category.name }
            const indexTransactionOut = cashPerDayOut.findIndex((c: any) => c.id === category.cashGroupId)
            const idxCashRowOut = cashPerDayOut[indexTransactionOut]?.cashEntryRow.findIndex((cPerDay: any) => cPerDay.id === category.id)
            if (idxCashRowOut > -1) cashPerDayOut[indexTransactionOut].cashEntryRow[idxCashRowOut] = { ...cashPerDayOut[indexTransactionOut].cashEntryRow[idxCashRowOut], name: category.name }
          } else if (result === "Category name already exists. Please try with another.")
            setErrCashGroupName("Category name already exists. Please try with another.")
          return
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
      })
    }
    else {
      setErrCashGroupName('Cash name must be requied and not longer than 20 characters')
      return
    }
  }
  const handleCloseCategoryPopupUpdate = () => {
    setCategory('')
    setShowAddCategoryPopup(false)
    setShowCategoryGroupPopup(true)
  }
  const handleCloseCategoryPopup = () => {
    setCategory('')
    setShowAddCategoryPopup(false)
  }
  useEffect(() => {
    if (error?.message === "Upgrade your subscription to perform this action.") {
      toast.error("Upgrade your subscription to perform this action.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [error?.message])
  HandleCloseModalAndDeleteValue(modalRef, setShowAddCategoryPopup, setCategory)
  return (
    <>
      {
        !category?.id ?
          (<div id='addCategory-container'>
            <form onSubmit={handleAddCategory}>
              <div className='addCategory-main' ref={modalRef}>
                <div className='addCategory-header'>
                  <h4>Category name</h4>
                  <img
                    onClick={handleCloseCategoryPopup}
                    src={process.env.PUBLIC_URL + 'img/closeNewtransaction.svg'}
                    alt="logo"
                  />
                </div>
                <div className='addCategory-content'>
                  <h5>Category name</h5>
                  <input ref={inputRef} maxLength={20} type="text" value={categoryName || category?.name} name="categoryName" onChange={(e) => setCategoryName(e.target.value)} autoComplete="off"
                  />
                  <span>
                    {
                      errCashGroupName ? errCashGroupName : null
                    }
                  </span>
                  <span className='categoryName-length-recomment'>{category?.name?.length || categoryName?.length || 0}/20</span>
                  <button className={categoryName ? 'addCategory-btn-add' : "addCategory-btn-add-disabled"} disabled={!categoryName} onClick={handleAddCategory}>Add</button>
                </div>
              </div>
            </form>
          </div>)
          :
          (<div id='addCategory-container'>
            <form onSubmit={handleUpdateCategoryName}>
              <div className='addCategory-main' ref={modalRef}>
                <div className='addCategory-header'>
                  <h4>Category name</h4>
                  <img
                    onClick={handleCloseCategoryPopupUpdate}
                    src={process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'}
                    alt="logo"
                  />
                </div>
                <div className='addCategory-content'>
                  <h5>Category name</h5>
                  <input ref={inputRef} maxLength={20} type="text" value={category?.name} name="category" onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  />
                  <span>{errCashGroupName ? errCashGroupName : null}</span>
                  <span className='categoryName-length-recomment'>{category?.name?.length || 0}/20</span>
                  <button className={category?.name ? 'addCategory-btn-add' : "addCategory-btn-add-disabled"} disabled={!category?.name} onClick={handleUpdateCategoryName}>Update</button>
                </div>
              </div>
            </form>
          </div>)
      }
    </>
  )
}

export default AddCategory;
