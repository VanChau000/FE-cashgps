import React, { useContext, useEffect, useRef, useState } from 'react';
import './ChangeNameProject.scss';
import { CHANGE_NAME_PROJECT } from '../../../../../graphql/Mutation';
import { GETSINGLEPROJECT, GET_LIST_PROJECT } from '../../../../../graphql/Query';
import { useMutation, useQuery } from '@apollo/client';
import { UserCtx } from '../../../../../context/user/state';
import { HandleCloseModal } from '../../../../../utils/ModalClose';
import { useParams } from "react-router-dom"
import { toast } from 'react-toastify';

function ChangeNameProject({
  setShowProjectSetting,
  setShowChangeNameProject,
  setShowChangeNamePopup,
  setNameEditProject,
  nameEditProject
}: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const param = useParams()
  const [editNameCoppy, setEditNameCoppy] = useState<any>(nameEditProject?.name)
  const { inforProject } = useContext(UserCtx);
  const [nameProject, setNameProject] = useState<any>();
  const { data } = useQuery(GET_LIST_PROJECT)
  const [changeNameProject] = useMutation(CHANGE_NAME_PROJECT);
  const { data: dataSingleProject, refetch } = useQuery(GETSINGLEPROJECT, {
    variables: {
      projectId: param?.projectId
    }
  });
  useEffect(() => {
    setNameProject(inforProject?.projectName);
  }, [inforProject]);
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (nameEditProject?.name) {
      setEditNameCoppy(e.target.value.replace(/[^\x00-\x7F]/gi, ''))
    }
    else {
      setNameProject(e.target.value.replace(/[^\x00-\x7F]/gi, ''))
    }
  };

  const handleToggleProjectSetting = () => {
    if (setShowChangeNamePopup) {
      setShowChangeNamePopup(false)
      setNameEditProject('')
    } else {
      setShowChangeNameProject(false);
      setShowProjectSetting(true);
      setNameProject('')
    }
  };
  const handleChangeNameProject: any = () => {

    changeNameProject({
      variables: {
        upsertProjectArgs: {
          projectId: nameEditProject?.id ? nameEditProject?.id : param?.projectId,
          upsertArgs: {
            name: editNameCoppy ? editNameCoppy : nameProject,
          },
        },
      },
      refetchQueries: [{ query: GETSINGLEPROJECT && GET_LIST_PROJECT }],
      onCompleted: (data: any) => {
        const result = data?.createOrUpdateCashProject?.result
        if (result === 'Project was updated') {
          refetch({ projectId: param?.projectId })
          toast.success("Name project has been updated'", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowChangeNameProject(false);
          setShowProjectSetting(true);
          if (setShowChangeNamePopup) {
            setShowChangeNamePopup(false)
            setNameProject('')
          }
        } else {
          toast.error("Name project has not been updated", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowChangeNameProject(false);
          setShowProjectSetting(true);
          if (setShowChangeNamePopup) {
            setShowChangeNamePopup(false)
            setNameProject('')
          }
        }
      }
    });
  };
  HandleCloseModal(modalRef, setShowChangeNameProject);
  HandleCloseModal(modalRef, setShowChangeNamePopup);
  return (
    <>
      <div id="changeNameProject-container">
        <div className="changeNameProject-content" ref={modalRef}>
          <div className="changeNameProject-header">
            <h4>Change project name</h4>
            <img
              onClick={handleToggleProjectSetting}
              src={process.env.PUBLIC_URL + 'img/closeNewtransaction.svg'}
              alt="logo"
            />
          </div>
          <div className="changeNameProject-main">
            <div className="changeNameProject-input">
              <h4>Project name</h4>
              <div className="inputText-changeName">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={20}
                  onChange={e =>
                    handleChange(e)
                  }
                  value={editNameCoppy ? editNameCoppy : nameProject}
                  name="nameProject"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleChangeNameProject()
                  }}
                />
                <span>{nameProject?.length}/20</span>
              </div>
            </div>
            <button
              disabled={editNameCoppy ? !editNameCoppy : !nameProject}
              onClick={handleChangeNameProject}
              className={
                nameProject?.length || editNameCoppy?.length > 0
                  ? 'changeNameProject-btn-save-active'
                  : 'changeNameProject-btn-save'
              }>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeNameProject;
