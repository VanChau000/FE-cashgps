import { useMutation } from '@apollo/client';
import React, { useContext, useRef, useState } from 'react'
import { UserCtx } from '../../../../context/user/state';
import { DELETE_PROJECT } from '../../../../graphql/Mutation';
import { GET_LIST_PROJECT } from '../../../../graphql/Query';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import { toast } from 'react-toastify';
import './DeleteProject.scss'

function DeleteProject({
    setShowDeleteProject,
    selectedProject
}: any) {
    let modalRef: any = useRef()
    const [deleteProject] = useMutation(DELETE_PROJECT)
    const [confirmName, setConfirmName] = useState<any>()
    const handleDeleteProject = () => {
        if (confirmName === selectedProject.name) {
            deleteProject({
                variables: {
                    projectId: selectedProject.id
                }, onCompleted: ({ deleteCashProject: { messageOfDeletion } }) => {
                    if (messageOfDeletion === 'Cash project has been removed!') {
                        setShowDeleteProject(false)
                        toast.success("Cash project has been removed!", {
                            position: toast.POSITION.TOP_RIGHT,
                          });
                    }
                }, refetchQueries: [{ query: GET_LIST_PROJECT }],
            })
        }
    }
    HandleCloseModal(modalRef, setShowDeleteProject);
    return (
        <div id='delete-project-container'>
            <div className='delete-content' ref={modalRef}>
                <div className='delete-header'>
                    <h3>Delete <span>{selectedProject.name}</span> ?</h3>
                    <img
                        onClick={() => setShowDeleteProject(false)}
                        src={
                            process.env.REACT_APP_CLIENT_URL +
                            'img/closeNewtransaction.svg'
                        }
                        alt="close"
                    />
                </div>
                <div className='delete-main'>
                    <div className='warning'>
                        <img
                            src={
                                process.env.REACT_APP_CLIENT_URL +
                                'img/protection_grey_icon.svg'
                            }
                            alt="close"
                        />
                        <h4>Unexpected bad things will happen if you don’t read this!</h4>
                    </div>
                    <h3 className='text-recommend'>
                        This action cannot be undone. This will permanently delete the ONMO project, cash groups, transactions, and remove all editors associations.
                    </h3>
                    <div className='input-container-email'>
                        <label htmlFor="input-delete-project">Please type <span >"{selectedProject.name}"</span> to confirm.</label>
                        <input
                            type="text"
                            id='input-delete-project'
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                        />
                    </div>
                    <button className={confirmName ? 'btn-delete-project' : 'btn-bg-grey'} onClick={() => handleDeleteProject()}>
                        I understand the consequence, delete this repository
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteProject