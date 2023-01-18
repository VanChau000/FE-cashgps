import React, { useContext, useEffect, useRef, useState } from 'react';
import './ChangeName.scss';
import { GETUSERINFOR } from '../../../../../graphql/Query';
import { useMutation } from '@apollo/client';
import { UPDATENAME } from '../../../../../graphql/Mutation';
import { UserCtx } from '../../../../../context/user/state';
import { HandleCloseModal } from '../../../../../utils/ModalClose';
import { toast } from 'react-toastify';

function ChangeName({ setShowProfile, setShowChangeName, setEditAccount }: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const { profile } = useContext(UserCtx);
  const [updateName, { data, loading, error }] = useMutation(UPDATENAME);
  const [name, setName] = useState({
    firstName: '',
    lastName: '',
  });
  const [errorName, setErrorName] = useState({
    errorFirstName: '',
    errorLastName: '',
  });
  useEffect(() => {
    setName(profile);
  }, [profile]);
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName({
      ...name,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdateName = (e: any) => {
    e.preventDefault()
    if (!name.firstName.trim()) {
      setErrorName({
        ...errorName,
        errorFirstName: 'First name is required',
      });
    }
    if (!name.lastName.trim()) {
      setErrorName({
        ...errorName,
        errorLastName: 'Last name is required',
      });
    }
    if (name.firstName.trim()) {
      setErrorName({
        ...errorName,
        errorFirstName: '',
      });
    }
    if (name.lastName.trim()) {
      setErrorName({
        ...errorName,
        errorLastName: '',
      });
    }
    if (name.firstName.match(/\d/) !== null) {
      setErrorName({
        ...errorName,
        errorFirstName: 'First name can not have a number',
      });
    }
    if (name.lastName.match(/\d/) !== null) {
      setErrorName({
        ...errorName,
        errorLastName: 'Last name can not have a number',
      });
    }

    if (
      name.firstName.length > 0 &&
      name.lastName.length > 0 &&
      name.firstName.match(/\d/) === null &&
      name.lastName.match(/\d/) === null
    ) {
      updateName({
        variables: {
          firstName: name.firstName,
          lastName: name.lastName,
        },
        refetchQueries: [{ query: GETUSERINFOR }],
      });
      toast.success("Your name has been updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowProfile(true);
      setShowChangeName(false);
      if (setEditAccount) {
        setEditAccount(true)
        setShowChangeName(false);
      }
    } else {
      return;
    }
  };

  const handleShowProfile = () => {
    if (setEditAccount) {
      setEditAccount(true)
      setShowChangeName(false);
    } else {
      setShowProfile(true);
      setShowChangeName(false);
    }
  };
  HandleCloseModal(modalRef, setShowChangeName);
  return (
    <>
      <div id="changeName-container">
        <form onSubmit={handleUpdateName}>
          <div className="changeName-content" ref={modalRef}>
            <div className="changeName-title">
              <h3>Change name</h3>
              <img
                onClick={handleShowProfile}
                src={process.env.REACT_APP_CLIENT_URL + 'img/X.svg'}
                alt="logo"
              />
            </div>
            <div className="changeName-input-container">
              <div className="changeName-content-input">
                <div className="changeName-input">
                  <h5>First name</h5>
                  <input
                    ref={inputRef}
                    maxLength={25}
                    className={
                      errorName.errorFirstName ? 'errorFirstName' : 'inputName'
                    }
                    type="text"
                    value={name.firstName}
                    onChange={handleChange}
                    name="firstName"
                  />
                  {/* <span className='changeName-recomment'>{name.firstName.length}/25</span> */}
                  <span>{errorName.errorFirstName}</span>
                </div>
                <div className="changeName-input">
                  <h5>Last name</h5>
                  <input
                    maxLength={25}
                    className={
                      errorName.errorLastName ? 'errorLastName' : 'inputName'
                    }
                    type="text"
                    value={name.lastName}
                    onChange={handleChange}
                    name="lastName"
                  />
                  <span>{errorName.errorLastName}</span>
                </div>
              </div>
              <button
                className={
                  name.firstName && name.lastName
                    ? 'changeName-btn active-changeName '
                    : 'changeName-btn '
                }
                disabled={!name.firstName || !name.lastName}
                onClick={handleUpdateName}>
                Save
              </button>
            </div>
          </div>
        </form>

      </div>
    </>
  );
}

export default ChangeName;
