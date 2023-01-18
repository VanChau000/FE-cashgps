import React, { useContext, useState } from 'react'
import { UserCtx } from '../../../context/user/state';
import AddCashGroup from '../popup/addCashGroup/AddCashGroup';
import AddCategory from '../popup/addCategory/AddCategory';
import AddTransDetail from '../popup/addTransDetail/AddTransDetail';
import CategorySetting from '../popup/categorySetting/CategorySetting';
import ChangeGroupName from '../popup/changeGroupName/ChangeGroupName';
import DeleteCategory from '../popup/deleteCategory/DeleteCategory';
import ListTransaction from '../popup/listTransaction/ListTransaction';
import UpDateTranDetail from '../popup/upDateTranDetail/UpDateTranDetail';

export const Table = (props: any) => {
  const { totalCashPerDay, listCashPerBasedOnWeeksOfMonth, useFor, startDate, currencySymbol, estimatePresentCash, handleSelectTransaction, dateSplit } = props
  const [showRow, setShowRow] = useState<any[]>([]);
  const {
    setNameCashGroup,
  } = useContext(UserCtx);
  const [showListTrans, setShowListTrans] = useState<any>(false);
  const [showAddTransDetail, setShowAddTransDetail] = useState<any>(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState<any>(false);
  const [showCategoryGroupPopup, setShowCategoryGroupPopup] = useState<any>(false);
  const [showAddCategory, setShowAddCategoryPopup] = useState<any>(false);
  const [showChangeGroupNamePopup, setShowChangeGroupNamePopup] = useState<any>();
  const [showDeletePopup, setShowDeletePopup] = useState<any>(false);
  const [listTranDetail, setListTranDetail] = useState<any>([]);
  const [listNameCategoryEdit, setListNameCategoryEdit] = useState<any>([]);
  const [nameCategory, setNameCategory] = useState<any>();
  const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
  const [listTransNoValue, setListTranNoValue] = useState<any>([]);
  const [nameDateCategory, setNameDateCategory] = useState<any>({
    name: '',
    transactionDate: '',
    cashEntryRowId: '',
  });
  const [transWithNoValue, setTransWithNoValue] = useState<any>({
    name: '',
    transactionDate: '',
    cashEntryRowId: '',
  });
  // filter show
  const toggleHide = ((data: any) => {
    const filterTransaction = showRow.filter((item: any) => item !== data?.id);
    setShowRow(filterTransaction);
  });
  const toggleShow = ((data: any) => {
    setShowRow([...(showRow as any), data?.id as any]);
  });

  const showCategoryGroup = (nameCashCategory: any, categoryGroup: any) => {
    setShowCategoryGroupPopup(true);
    setListNameCategoryEdit(categoryGroup?.cashEntryRow);
    setNameCategory(nameCashCategory);
    setNameCashGroup({
      groupType: categoryGroup?.groupType,
      id: categoryGroup?.id,
      name: categoryGroup?.name,
    });
  };

  return (
    <>
      <tbody className="tbody-table">
        <div className="line-margin-cash">
        </div>
        <tr>
          <td>
            <div className='cash-title'>
              <span>Cash {useFor === 'cash in' ? `in` : `out`}</span>
            </div>
          </td>
        </tr>

        {listCashPerBasedOnWeeksOfMonth && listCashPerBasedOnWeeksOfMonth?.map((cashPerTrans: any, i: number) => {

          return <>
            <tr key={cashPerTrans.id} className='font-size-14 font-weight-700 text-title-category'><td>
              <div>
                <div>
                  {cashPerTrans?.listTransactionPerProject?.length > 0 ?
                    <>
                      <img
                        data-testid="img-toggle"
                        onClick={() => showRow?.includes(cashPerTrans.id) ? toggleHide(cashPerTrans) : toggleShow(cashPerTrans)}
                        src={
                          showRow?.includes(cashPerTrans.id) ? process.env.REACT_APP_CLIENT_URL + 'img/showMore.svg' : process.env.REACT_APP_CLIENT_URL + 'img/hide.svg'
                        }
                        alt="logo"
                      />
                      <span style={{ "cursor": "pointer" }} onClick={() => showRow?.includes(cashPerTrans.id) ? toggleHide(cashPerTrans) : toggleShow(cashPerTrans)}>{cashPerTrans.name}</span>
                    </> :
                    <>
                      <img
                        data-testid="img-toggle"
                        className='toggle-show-hide-img'
                        src={
                          showRow?.includes(cashPerTrans.id) ? process.env.REACT_APP_CLIENT_URL + 'img/showMore.svg' : process.env.REACT_APP_CLIENT_URL + 'img/hide.svg'
                        }
                        alt="logo"
                      />
                      <span style={{ "cursor": "default" }} >{cashPerTrans.name}</span>
                    </>
                  }

                </div>
                <div>
                  <img
                    onClick={() => showCategoryGroup(cashPerTrans.name, cashPerTrans)}
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEzLjEyNUMxMi42MjEzIDEzLjEyNSAxMy4xMjUgMTIuNjIxMyAxMy4xMjUgMTJDMTMuMTI1IDExLjM3ODcgMTIuNjIxMyAxMC44NzUgMTIgMTAuODc1QzExLjM3ODcgMTAuODc1IDEwLjg3NSAxMS4zNzg3IDEwLjg3NSAxMkMxMC44NzUgMTIuNjIxMyAxMS4zNzg3IDEzLjEyNSAxMiAxMy4xMjVaIiBmaWxsPSIjQkFCRUMzIiBzdHJva2U9IiNCQUJFQzMiLz4KPHBhdGggZD0iTTEyIDcuMTI1QzEyLjYyMTMgNy4xMjUgMTMuMTI1IDYuNjIxMzIgMTMuMTI1IDZDMTMuMTI1IDUuMzc4NjggMTIuNjIxMyA0Ljg3NSAxMiA0Ljg3NUMxMS4zNzg3IDQuODc1IDEwLjg3NSA1LjM3ODY4IDEwLjg3NSA2QzEwLjg3NSA2LjYyMTMyIDExLjM3ODcgNy4xMjUgMTIgNy4xMjVaIiBmaWxsPSIjQkFCRUMzIiBzdHJva2U9IiNCQUJFQzMiLz4KPHBhdGggZD0iTTEyIDE5LjEyNUMxMi42MjEzIDE5LjEyNSAxMy4xMjUgMTguNjIxMyAxMy4xMjUgMThDMTMuMTI1IDE3LjM3ODcgMTIuNjIxMyAxNi44NzUgMTIgMTYuODc1QzExLjM3ODcgMTYuODc1IDEwLjg3NSAxNy4zNzg3IDEwLjg3NSAxOEMxMC44NzUgMTguNjIxMyAxMS4zNzg3IDE5LjEyNSAxMiAxOS4xMjVaIiBmaWxsPSIjQkFCRUMzIiBzdHJva2U9IiNCQUJFQzMiLz4KPC9zdmc+Cg=="
                    alt="logo"
                  />
                </div>
              </div>
            </td>
              {cashPerTrans?.result?.map((total: any, index: number) => {
                return (
                  <td key={index} className={`${new Date(total.transaction) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}`}
                    onClick={() => handleSelectTransaction(index, total.transaction)}
                  >
                    {Number(total.totalValue).toLocaleString()}&nbsp;{currencySymbol}
                  </td>
                )
              })}
            </tr>
            {showRow?.includes(cashPerTrans.id) && cashPerTrans && cashPerTrans?.listTransactionPerProject?.map((item: any, idx: number) => {
              return (
                item.displayMode === "USED" ? <tr key={idx} className='text-color-default font-weight-400'>
                  <td ><div className='sub-category'>{item?.name}</div></td>
                  {item?.resTotal?.map((element: any, index: number) => {
                    return (
                      <td key={index} onClick={() => handleSelectTransaction(index, element.transaction)} className={new Date(element.transaction) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}>{Number(element.valuePerTrans).toLocaleString()}&nbsp;{currencySymbol}
                        <span className={estimatePresentCash[i][idx][index] > 0 ? `td-percen-tran-red` : `td-percen-tran-blue`}>
                          <div className='percent'>
                            {item?.resTotal[index]?.estimatePerTrans > 0 && (
                              estimatePresentCash[i][idx][index] > 0 ? <img
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/negativeIcon.svg'
                                }
                                alt="negativeIcon"
                              /> : <img
                                src={
                                  process.env.REACT_APP_CLIENT_URL +
                                  'img/positiveIcon.svg'
                                }
                                alt="positiveIcon"
                              />
                            )}
                            {item?.resTotal[index]?.estimatePerTrans > 0 &&
                              `${estimatePresentCash[i][idx][index] < 0 ? estimatePresentCash[i][idx][index] * -1 : estimatePresentCash[i][idx][index]}%`
                            }
                          </div>
                        </span>
                        {new Date(element.transaction) > new Date(startDate) &&
                          <span className="td-estimated-tran">
                            {Number(element.estimatePerTrans).toLocaleString()}&nbsp;{currencySymbol}
                          </span>
                        }
                      </td>
                    )
                  })}
                </tr > : <tr key={idx}></tr>
              )
            })}
          </>
        })}
        <tr >
          <td><div className='total-cash font-weight-600'>Total {useFor}</div></td>
          {totalCashPerDay.length !== 0 ? totalCashPerDay?.map((total: any, index: number) => {
            return (
              <td key={index}
                className={`${useFor === 'cash in' ? 'total-cash-in' : 'total-cash-out'} ${new Date(total?.transaction) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}`} onClick={() => handleSelectTransaction(index, total?.transaction)}
              >
                {Number(total.data).toLocaleString() || 0}&nbsp;{currencySymbol}
              </td>
            )
          })
            : dateSplit?.map((item: any, index: number) => {
              return (
                <td key={index}
                  className={`${useFor === 'cash in' ? 'total-cash-in' : 'total-cash-out'} ${new Date(item.end ? item.end : item[item.length - 1]) < new Date(startDate) ? 'bg-grey color-bg-grey' : ''}`} onClick={() => handleSelectTransaction(index, item.end ? item.end : item[item.length - 1])}
                >
                  0&nbsp;{currencySymbol}
                </td>
              )
            })
          }
        </tr>
      </tbody>
      {showListTrans ? (
        <ListTransaction
          setShowListTrans={setShowListTrans}
          setShowAddTransDetail={setShowAddTransDetail}
          listTranDetail={listTranDetail}
          setShowUpdatePopup={setShowUpdatePopup}
          setListTranDetail={setListTranDetail}
          nameDateCategory={nameDateCategory}
          transWithNoValue={transWithNoValue}
          listTransNoValue={listTransNoValue}
          setListTranNoValue={setListTranNoValue}
          setTransWithNoValue={setTransWithNoValue}
          setNameDateCategory={setNameDateCategory}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {showAddTransDetail ? (
        <AddTransDetail
          setShowListTrans={setShowListTrans}
          setShowAddTransDetail={setShowAddTransDetail}
          listTranDetail={listTranDetail}
          setListTranDetail={setListTranDetail}
          transWithNoValue={transWithNoValue}
          listTransNoValue={listTransNoValue}
          setListTranNoValue={setListTranNoValue}
          nameDateCategory={nameDateCategory}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {showUpdatePopup ? (
        <UpDateTranDetail
          setShowListTrans={setShowListTrans}
          setShowUpdatePopup={setShowUpdatePopup}
          listTransNoValue={listTransNoValue}
          setListTranNoValue={setListTranNoValue}
          listTranDetail={listTranDetail}
          setListTranDetail={setListTranDetail}
          currencySymbol={currencySymbol}
        />
      ) : null}
      {showCategoryGroupPopup ? (
        <CategorySetting
          listNameCategoryEdit={listNameCategoryEdit}
          setListNameCategoryEdit={setListNameCategoryEdit}
          nameCategory={nameCategory}
          setShowChangeGroupNamePopup={setShowChangeGroupNamePopup}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
          setShowDeletePopup={setShowDeletePopup}
          setShowAddCategoryPopup={setShowAddCategoryPopup}
        />
      ) : null}
      {showAddGroupPopup ? (
        <AddCashGroup
          typeCashGroup={null}
          setShowAddGroupPopup={setShowAddGroupPopup}
        />
      ) : null}
      {showAddCategory ? (
        <AddCategory
          listNameCategoryEdit={listNameCategoryEdit}
          setListNameCategoryEdit={setListNameCategoryEdit}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
          setShowAddCategoryPopup={setShowAddCategoryPopup}
          valueCategory={null}
        />
      ) : null}
      {showChangeGroupNamePopup ? (
        <ChangeGroupName
          setNameCategory={setNameCategory}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
          setShowChangeGroupNamePopup={setShowChangeGroupNamePopup}
        />
      ) : null}
      {showDeletePopup ? (
        <DeleteCategory
          listNameCategoryEdit={listNameCategoryEdit}
          setListNameCategoryEdit={setListNameCategoryEdit}
          setShowDeletePopup={setShowDeletePopup}
          setShowCategoryGroupPopup={setShowCategoryGroupPopup}
        />
      ) : null}
    </>
  )
}

export default Table;