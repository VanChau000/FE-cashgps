import { useContext, useEffect, useRef, useState } from 'react';
import { GETSINGLEPROJECT, GETUSERINFOR } from '../../../../../graphql/Query';
import { useMutation, useQuery } from '@apollo/client';
import {
  UPDATETIMEZONE,
  UPDATE_PROJECT_TIMEZONE,
} from '../../../../../graphql/Mutation';
import './TimeZone.scss';
import { UserCtx } from '../../../../../context/user/state';
import { HandleCloseModal } from '../../../../../utils/ModalClose';
import { timeZones } from '../../../../../constants/constantsTimezone';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


function TimeZone({
  setShowTimeZone,
  setShowProfile,
  editInforForject,
  setEditInforProject,
  setShowProjectSetting,
  setEditAccount
}: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const { profile } = useContext(UserCtx);
  const [infoProject, setInforProject] = useState<any>();
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  const [updateTimeZone] = useMutation(UPDATETIMEZONE);
  const [updateProjectTimezone] = useMutation(UPDATE_PROJECT_TIMEZONE);
  const [showTimeList, setShowTimeList] = useState(false);
  const [timeZone, setTimeZone] = useState('');
  const initTimeZone = [...timeZones]
  const [listTimeZone, setListTimeZone] = useState(initTimeZone);
  const [searchTime, setSearchTime] = useState('');
  useEffect(() => {
    setTimeZone(profile.timezone);
  }, [profile]);

  const handleShowProfile = () => {
    if (setEditAccount) {
      setEditAccount(true)
      setShowTimeZone(false);
    } else if (editInforForject === true) {
      setShowTimeZone(false);
      setShowProjectSetting(true)
    } else {
      setEditInforProject(false);
      setShowTimeZone(false);
      setShowProfile(true);
    }

  };
  const filterTimexone = listTimeZone.filter(t => {
    if (searchTime === '') {
      return t;
    } else {
      return t.toLowerCase().includes(searchTime.toLowerCase());
    }
  })
  const toggleTimeList = () => {
    setShowTimeList(!showTimeList)
  };
  const handleTimeZone = (time: any) => {
    setInforProject({ ...infoProject, timezone: time });
    setTimeZone(time);
    setShowTimeList(false);
  };
  const handleUpdateTimeZone = () => {
    if (editInforForject === true) {
      updateProjectTimezone({
        variables: {
          upsertProjectArgs: {
            projectId: param?.projectId,
            upsertArgs: {
              timezone: timeZone,
            },
          },
        },
        refetchQueries: [{ query: GETSINGLEPROJECT }],
        onCompleted: ({ createOrUpdateCashProject: { result } }) => {
          if (result === 'Project was updated') {
            refetch({ projectId: param?.projectId })
            setEditInforProject(false)
            toast.success("Timezone has been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowTimeZone(false);
            setShowProjectSetting(true);
            if (setEditAccount) {
              setEditAccount(true)
              setShowTimeZone(false);
            }
          } else {
            setEditInforProject(false)
            toast.error("Currency has not been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowTimeZone(false);
            setShowProjectSetting(true);
            if (setEditAccount) {
              setEditAccount(true)
              setShowTimeZone(false);
            }
            return
          }
        }
      });

    } else {
      updateTimeZone({
        variables: {
          timezone: timeZone,
        },
        refetchQueries: [{ query: GETUSERINFOR }],
      });
      if (setEditAccount) {
        setEditAccount(true)
        setShowTimeZone(false);
      }
      toast.success("Timezone has been updated'", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowTimeZone(false);
      setShowProfile(true);

    }
  };
  useEffect(() => {
    setInforProject(dataSingleProject?.fetchProject?.infoProject);
  }, [dataSingleProject]);
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [showTimeList])

  HandleCloseModal(modalRef, setShowTimeZone);
  return (
    <>
      <div id="timeZone-container">
        <div className="timeZone-main" ref={modalRef}>
          <div className="timeZone-header">
            <h3>Change time zone</h3>
            <img
              onClick={handleShowProfile}
              src={process.env.REACT_APP_CLIENT_URL + 'img/X.svg'}
              alt="logo"
            />
          </div>
          <div className="timeZone-content">
            <div onClick={toggleTimeList}>
              {editInforForject === true ? infoProject?.timezone : timeZone}

              <img
                onClick={toggleTimeList}
                src={process.env.REACT_APP_CLIENT_URL + 'img/signDown.svg'}
                alt="logo"
              />
            </div>
            <button className="timeZone-btn" onClick={handleUpdateTimeZone}>
              Save
            </button>
          </div>
          <ul className={showTimeList ? 'timeZone-list' : 'hide-timeZone '}>
            <div className="timeZone-list-input">
              <input
                ref={inputRef}
                onChange={e => setSearchTime(e.target.value)}
                type="text"
                placeholder="Search"
              />
              <img
                src={process.env.REACT_APP_CLIENT_URL + 'img/searchIcon.svg'}
                alt="logo"
              />
            </div>
            {filterTimexone.length == 0 ? <li className='no-result'>No result found</li> :
              filterTimexone.map(time => (
                <li onClick={() => handleTimeZone(time)}>{time}</li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default TimeZone;
