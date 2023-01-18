import './CategorySetting.scss';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DISPLAY_MODE_CATEGORY } from '../../../../graphql/Mutation';
import { UP_DOWN_CATEGORY } from '../../../../graphql/Mutation';
import { DRAG_CATEGORY } from '../../../../graphql/Mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GETSINGLEPROJECT } from '../../../../graphql/Query';
import { UserCtx } from '../../../../context/user/state';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import { useParams } from 'react-router-dom';

function CategorySetting({
  setShowCategoryGroupPopup,
  listNameCategoryEdit,
  setListNameCategoryEdit,
  nameCategory,
  setShowChangeGroupNamePopup,
  setShowDeletePopup,
  setShowAddCategoryPopup,
}: any) {
  let modalRef: any = useRef();
  const param = useParams()
  const { setCategory, setListNameCategory, setCashGroup, setIdCash, cashPerDayIn, setCashPerDayIn, cashPerDayOut, setCashPerDayOut } =
    useContext(UserCtx);
  const [dataCoppy, setDataCoppy] = useState<any>();
  const [selectedRow, setSelectedRow] = useState<any>();
  const [showDrag, setShowDrag] = useState<boolean>(true);
  const [showEye, setShowEye] = useState<boolean>(false);
  const [displayMode, setDisPlayMode] = useState<any>("USED");
  const [displayCategory] = useMutation(DISPLAY_MODE_CATEGORY);
  const [upDownCategory] = useMutation(UP_DOWN_CATEGORY);
  const [dragCategory] = useMutation(DRAG_CATEGORY);
  const nameListCategory = dataCoppy?.map((name: any) => {
    return name?.name;
  });
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  useEffect(() => {
    setDataCoppy(listNameCategoryEdit);
    // setDataCoppy(listNameCategoryEdit?.listEntryRowsInGroup)
  }, [listNameCategoryEdit])

  const tonggleShowEye =
    (category: any) => {
      setDataCoppy(listNameCategoryEdit);
      setShowEye(!showEye);
      let dataEdit = [];
      const newDataCoppy = [...dataCoppy];
      const newOne: any = newDataCoppy?.map(item => {
        if (item?.id === category?.id) {
          if (item?.displayMode === 'USED') {
            item = {
              cashGroupId: item?.cashGroupId,
              displayMode: 'ARCHIVED',
              id: item?.id,
              name: item?.name,
              ownerId: item?.ownerId,
              projectId: item?.projectId,
              rankOrder: item?.rankOrder,
              transactions: item?.transactions,
            };
          } else if (item?.displayMode === 'ARCHIVED') {
            item = {
              cashGroupId: item?.cashGroupId,
              displayMode: 'USED',
              id: item?.id,
              name: item?.name,
              ownerId: item?.ownerId,
              projectId: item?.projectId,
              rankOrder: item?.rankOrder,
              transactions: item?.transactions,
            };
          }
        }
        return item;
      });
      dataEdit = [...newOne];
      setListNameCategoryEdit([...dataEdit]);
      if (category?.displayMode === 'ARCHIVED') {
        setDisPlayMode('USED');
        displayCategory({
          variables: {
            upsertEntryRowArgs: {
              projectId: param?.projectId,
              cashEntryRowId: category?.id,
              upsertArgs: {
                displayMode: 'USED',
              },
            },
          },
          refetchQueries: [{ query: GETSINGLEPROJECT }],
          onCompleted: ({ createOrUpdateCashEntryRow: { result } }) => {
            if (result === 'Entry row was updated') {
              refetch({ projectId: param?.projectId })
              const indexTransactionIn = cashPerDayIn.findIndex((c: any) => c.id === category?.cashGroupId)
              const idxCashRowIn = cashPerDayIn[indexTransactionIn]?.cashEntryRow.findIndex((cPerDay: any) => cPerDay.id === category?.id)
              if (idxCashRowIn > -1) {
                cashPerDayIn[indexTransactionIn].cashEntryRow[idxCashRowIn] = { ...cashPerDayIn[indexTransactionIn].cashEntryRow[idxCashRowIn], displayMode: "USED" }
              }
              const indexTransactionOut = cashPerDayOut.findIndex((c: any) => c.id === category?.cashGroupId)
              const idxCashRowOut = cashPerDayOut[indexTransactionOut]?.cashEntryRow.findIndex((cPerDay: any) => cPerDay.id === category?.id)
              if (idxCashRowOut > -1) {
                cashPerDayOut[indexTransactionOut].cashEntryRow[idxCashRowOut] = { ...cashPerDayOut[indexTransactionOut].cashEntryRow[idxCashRowOut], displayMode: "USED" }
              }
            } else {
              return
            }
          }
        });
      } else if (category?.displayMode === 'USED') {
        setDisPlayMode('ARCHIVED');
        displayCategory({
          variables: {
            upsertEntryRowArgs: {
              projectId: param?.projectId,
              cashEntryRowId: category?.id,
              upsertArgs: {
                displayMode: 'ARCHIVED',
              },
            },
          },
          refetchQueries: [{ query: GETSINGLEPROJECT }],
          onCompleted: ({ createOrUpdateCashEntryRow: { result } }) => {
            if (result === 'Entry row was updated') {
              refetch({ projectId: param?.projectId })
              const indexTransactionIn = cashPerDayIn.findIndex((c: any) => c.id === category?.cashGroupId)
              const idxCashRowIn = cashPerDayIn[indexTransactionIn]?.cashEntryRow.findIndex((cPerDay: any) => cPerDay.id === category?.id)
              if (idxCashRowIn > -1) {
                cashPerDayIn[indexTransactionIn].cashEntryRow[idxCashRowIn] = { ...cashPerDayIn[indexTransactionIn].cashEntryRow[idxCashRowIn], displayMode: "ARCHIVED" }
              }
              const indexTransactionOut = cashPerDayOut.findIndex((c: any) => c.id === category?.cashGroupId)
              const idxCashRowOut = cashPerDayOut[indexTransactionOut]?.cashEntryRow.findIndex((cPerDay: any) => cPerDay.id === category?.id)
              if (idxCashRowOut > -1) {
                cashPerDayOut[indexTransactionOut].cashEntryRow[idxCashRowOut] = { ...cashPerDayOut[indexTransactionOut].cashEntryRow[idxCashRowOut], displayMode: "ARCHIVED" }
              }
            } else {
              return
            }
          }
        });
      }
    }


  const handleUpRow = React.useCallback(
    (index: any, id: any, type: any) => {
      if (index > 0) {
        let previousItems = [...dataCoppy];
        let temp = previousItems[index - 1];
        previousItems[index - 1] = previousItems[index];
        previousItems[index] = temp;
        setDataCoppy(previousItems);
        setSelectedRow(index - 1);
        setSelectedRow(null);
      }
      upDownCategory({
        variables: {
          upsertEntryRowArgs: {
            projectId: param?.projectId,
            orderType: type,
            cashEntryRowId: id,
          },
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted:({createOrUpdateCashEntryRow:{result}}) => {
          if(result === 'Entry row was updated'){
            refetch({ projectId: param?.projectId })
            const ind = cashPerDayIn.findIndex((c: any) => c.id === listNameCategoryEdit[0].cashGroupId)
            let previousItemsIn = [...cashPerDayIn[ind].cashEntryRow];
            let tempIn = previousItemsIn[index - 1];
            previousItemsIn[index - 1] = previousItemsIn[index];
            previousItemsIn[index] = tempIn;
            const newCashIn = cashPerDayIn.map((c: any) => {
              if (c.id === listNameCategoryEdit[0].cashGroupId)
                return {
                  ...c,
                  cashEntryRow: previousItemsIn
                }
              return c
            })
            setCashPerDayIn(newCashIn)
            const indOut = cashPerDayOut.findIndex((c: any) => c.id === listNameCategoryEdit[0].cashGroupId)
            let previousItems = [...cashPerDayOut[indOut].cashEntryRow];
            let temp = previousItems[index - 1];
            previousItems[index - 1] = previousItems[index];
            previousItems[index] = temp;
            const newCashOut = cashPerDayOut.map((c: any) => {
              if (c.id === listNameCategoryEdit[0].cashGroupId)
                return {
                  ...c,
                  cashEntryRow: previousItems
                }
              return c
            })
            setCashPerDayOut(newCashOut)
          }else{
           return
          }
        }
      });
    },
    [setSelectedRow, dataCoppy, cashPerDayIn, cashPerDayOut],
  );

  const handleDownRow = React.useCallback(
    (index: any, id: any, type: any) => {
      if (index < dataCoppy.length - 1) {
        let previousItems = [...dataCoppy];
        let temp = previousItems[index + 1];
        previousItems[index + 1] = previousItems[index];
        previousItems[index] = temp;
        setDataCoppy(previousItems);
        setSelectedRow(index + 1);
        setSelectedRow(null);
      }
      upDownCategory({
        variables: {
          upsertEntryRowArgs: {
            projectId: param?.projectId,
            orderType: type,
            cashEntryRowId: id,
          },
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted:({createOrUpdateCashEntryRow:{result}}) => {
          if(result === 'Entry row was updated'){
            refetch({ projectId: param?.projectId })
            const ind = cashPerDayIn?.findIndex((c: any) => c.id === listNameCategoryEdit[0].cashGroupId)
            let previousItemsIn = [...cashPerDayIn[ind]?.cashEntryRow];
            let tempIn = previousItemsIn[index + 1];
            previousItemsIn[index + 1] = previousItemsIn[index];
            previousItemsIn[index] = tempIn;
            const newCashIn = cashPerDayIn?.map((c: any) => {
              if (c.id === listNameCategoryEdit[0].cashGroupId)
                return {
                  ...c,
                  cashEntryRow: previousItemsIn
                }
              return c
            })
            setCashPerDayIn(newCashIn)
            const indOut = cashPerDayOut?.findIndex((c: any) => c.id === listNameCategoryEdit[0].cashGroupId)
            let previousItems = [...cashPerDayOut[indOut]?.cashEntryRow];
            let temp = previousItems[index + 1];
            previousItems[index + 1] = previousItems[index];
            previousItems[index] = temp;
            const newCashOut = cashPerDayOut?.map((c: any) => {
              if (c.id === listNameCategoryEdit[0].cashGroupId)
                return {
                  ...c,
                  cashEntryRow: previousItems
                }
              return c
            })
            setCashPerDayOut(newCashOut)
          }else{
           return
          }
        }
      });
    },
    [setSelectedRow, dataCoppy, cashPerDayIn, cashPerDayOut],
  );
  //save reference for dragItem and dragOver
  const dragItem = useRef<any>(null);
  const dragItemOver = useRef<any>(null);

  // handle drag sorting
  const handleSoft = () => {
    let _DataCoppy = [...dataCoppy];
    // remove and save the raged item content
    const dragItemContent = _DataCoppy.splice(dragItem.current, 1)[0];
    // switch the position
    _DataCoppy.splice(dragItemOver.current, 0, dragItemContent);
    // reset the position
    dragItem.current = null;
    dragItemOver.current = null;
    //update list
    setDataCoppy(_DataCoppy);
    const listDataDrag = _DataCoppy?.map((item: any) => {
      return item?.id;
    });

    dragCategory({
      variables: {
        listRowIds: listDataDrag,
      },
      refetchQueries: [{ query: GETSINGLEPROJECT }],
      onCompleted: ({ storeRankAfterDragDrop: { resultOfDragDrop } }) => {
        if (resultOfDragDrop === 'Successful drag-and-drop') {
          refetch({ projectId: param?.projectId })
        } else {
          return
        }
      }
    });
  };
  const handleToggleDrag = () => {
    setShowDrag(!showDrag);
  };

  const handleShowChangeGroupNamePopup = () => {
    setIdCash(listNameCategoryEdit?.id);
    setCashGroup({
      cashId: listNameCategoryEdit?.id,
      cashName: listNameCategoryEdit?.name,
      groupType: listNameCategoryEdit?.groupType,
    });
    setShowCategoryGroupPopup(false);
    setShowChangeGroupNamePopup(true);
  };
  const handleDeleteCategory = (category: any) => {
    setCategory(category);
    setShowCategoryGroupPopup(false);
    setShowDeletePopup(true);
  };
  const handleEditCategory = (category: any) => {
    setShowCategoryGroupPopup(false);
    setShowAddCategoryPopup(true);
    setCategory(category);
    setListNameCategory(nameListCategory);
  };

  HandleCloseModal(modalRef, setShowCategoryGroupPopup);
  return (
    <>
      <div id="category-setting-container">
        <div className="category-content" ref={modalRef}>
          <div className="category-header">
            <div className="category-title">
              <div>{nameCategory}</div>
              <div
                className="category-edit-name"
                onClick={() => handleShowChangeGroupNamePopup()}>
                <img
                  src={process.env.REACT_APP_CLIENT_URL + 'img/pen.svg'}
                  alt="logo"
                />
                <div>Edit</div>
              </div>
            </div>
            <div className="category-option">
              {showDrag ? (
                <img
                  onClick={handleToggleDrag}
                  src={
                    process.env.REACT_APP_CLIENT_URL +
                    'img/slide_horizontal2.svg'
                  }
                  alt="logo"
                />
              ) : (
                <img
                  onClick={handleToggleDrag}
                  src={
                    process.env.REACT_APP_CLIENT_URL +
                    'img/slide_horizontal.svg'
                  }
                  alt="logo"
                />
              )}
              <img
                onClick={() => setShowCategoryGroupPopup(false)}
                src={
                  process.env.REACT_APP_CLIENT_URL +
                  'img/closeNewtransaction.svg'
                }
                alt="logo"
              />
            </div>
          </div>
          <div className="category-main">
            <div className="category-main-item">
              {dataCoppy?.map((item: any, index: any) => {
                return (
                  <>
                    {!showDrag ? (
                      <div
                        draggable
                        onDragStart={e => (dragItem.current = index)}
                        onDragEnter={e => (dragItemOver.current = index)}
                        onDragEnd={handleSoft}
                        onDragOver={e => e.preventDefault()}
                        className="category-item-container">
                        {index === index ? (
                          <div className="category-item">
                            <img
                              src={
                                process.env.REACT_APP_CLIENT_URL +
                                'img/DotsSixVertical.svg'
                              }
                              alt="logo"
                            />
                            <div> {item?.name}</div>
                          </div>
                        ) : (
                          <div className="category-item ">
                            <img
                              src={
                                process.env.REACT_APP_CLIENT_URL +
                                'img/DotsSixVertical.svg'
                              }
                              alt="logo"
                            />
                            <div> {item?.name}</div>
                          </div>
                        )}
                        {index + 1 === dataCoppy?.length && index === index ? (
                          <div className="category-position">
                            <span
                              onClick={() =>
                                handleUpRow(index, item?.id, 'UP')
                              }>
                              Up{' '}
                            </span>
                          </div>
                        ) : (
                          <>
                            {index === 0 && index === index ? (
                              <div className="category-position">
                                <span
                                  onClick={() =>
                                    handleDownRow(index, item?.id, 'DOWN')
                                  }>
                                  Down{' '}
                                </span>
                              </div>
                            ) : (
                              <>
                                {index === index ? (
                                  <div className="category-position">
                                    <span
                                      onClick={() =>
                                        handleUpRow(index, item?.id, 'UP')
                                      }>
                                      Up{' '}
                                    </span>
                                    <span className="line-category-position"></span>
                                    <span
                                      onClick={() =>
                                        handleDownRow(index, item?.id, 'DOWN')
                                      }>
                                      {' '}
                                      Down
                                    </span>
                                  </div>
                                ) : null}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="category-item-container-edit">
                        {item?.displayMode === 'USED' ? (
                          <div className="category-item-edit">
                            <span>{item?.name}</span>
                            <div className="category-item-hover-edit">
                              <img
                                  onClick={() => tonggleShowEye(item)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/eye.svg'
                                }
                                alt="logo"
                              />
                              <img
                                onClick={() => handleEditCategory(item)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/penEdit.svg'
                                }
                                alt="logo"
                              />
                              <img
                                onClick={() => handleDeleteCategory(item)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/Trash.svg'
                                }
                                alt="logo"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="category-item-edit displayMode">
                            <span>{item?.name}</span>
                            <div className="category-item-hover-edit">
                              <img
                                onClick={() => tonggleShowEye(item)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/eyeSlash.svg'
                                }
                                alt="logo"
                              />
                              <img
                                onClick={() => handleEditCategory(item)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/penEdit.svg'
                                }
                                alt="logo"
                              />
                              <img
                                onClick={() => handleDeleteCategory(item)}
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/Trash.svg'
                                }
                                alt="logo"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })}
            </div>
            {/* <button className="category-btn-save">Save</button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default CategorySetting;
