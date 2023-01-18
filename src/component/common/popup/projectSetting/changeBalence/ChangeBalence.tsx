import { useMutation, useQuery } from '@apollo/client';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserCtx } from '../../../../../context/user/state';
import { CHANGE_NAME_PROJECT } from '../../../../../graphql/Mutation';
import { GETSINGLEPROJECT } from '../../../../../graphql/Query';
import { HandleCloseModal } from '../../../../../utils/ModalClose'
import CurrencyInput from 'react-currency-input-field';
import { toast } from 'react-toastify';
import './ChangeBalence.scss'
import { useParams } from 'react-router-dom';

function ChangeBalence({ setShowChangeBalence, setShowProjectSetting }: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const { inforProject } = useContext(UserCtx);
  const [startBalence, setStartBalence]: any = useState()
  const [changeBalence] = useMutation(CHANGE_NAME_PROJECT)
  const handleToggleProjectSetting = () => {
    setShowChangeBalence(false)
    setShowProjectSetting(true)
  }
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const [currencySymbol, setCurrencySymbol] = useState('')
  const handleChangeBalence = () => {
    if ((startBalence as number) < 999999999999999) {
      changeBalence({
        variables: {
          upsertProjectArgs: {
            projectId: param?.projectId,
            upsertArgs: {
              startingBalance: Number(startBalence),
            },
          },
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted: ({ createOrUpdateCashProject: { result } }) => {
          if (result === 'Project was updated') {
            refetch({ projectId: param?.projectId })
            toast.success("Balance has been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowChangeBalence(false);
            setShowProjectSetting(true);
          } else {
            toast.error("Balance has not been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowChangeBalence(false);
            setShowProjectSetting(true);
          }
        }
      });

    } else {
      return;
    }
  };
  useEffect(() => {
    setStartBalence(inforProject?.startingBalance);
  }, [inforProject]);
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
    setCurrencySymbol(inforProject?.currency)
  }, [])

  HandleCloseModal(modalRef, setShowChangeBalence);
  return (
    <>
      <div id="changeStartBalence-container">
        <div className="changeStartBalence-content" ref={modalRef}>
          <div className="changeStartBalence-header">
            <h4>Change start balance</h4>
            <img
              onClick={handleToggleProjectSetting}
              src={process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'}
              alt="closeNewTrans"
            />
          </div>
          <div className='changeStartBalence-main'>
            <div className='changeStartBalence-input'>
              <label htmlFor='changeStartBalence-input-filed'>Start balance</label>
              <div className='wrap-input-currency'>
                <CurrencyInput
                  ref={inputRef}
                  id='changeStartBalence-input-filed'
                  name="value"
                  maxLength={9}
                  decimalsLimit={2}
                  value={startBalence}
                  onValueChange={(value) => setStartBalence(value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleChangeBalence()
                    }
                  }}
                />
                <span>{currencySymbol}</span>
              </div>
              <span>{startBalence as number > 999999999999999 ? "Start balance is too high" : ""}</span>

            </div>
            <button
              disabled={!startBalence?.toString()}
              onClick={handleChangeBalence}
              className={startBalence as number < 999999999999999 ? 'changeStartBalence-btn-save-active' : 'changeStartBalence-btn-save'}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeBalence;
