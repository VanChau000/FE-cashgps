import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATEPASSWORD } from '../../../../../graphql/Mutation';
import './ChangePassWord.scss';
import { UserCtx } from '../../../../../context/user/state';
import { HandleCloseModal } from '../../../../../utils/ModalClose';
import LoadingData from '../../../loadingData/LoadingData';
import { toast } from 'react-toastify';

function ChangePassWord({ setShowChangePassword, setShowProfile, setEditAccount }: any) {
  let modalRef: any = useRef();
  let inputRef: any = useRef()
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<any>({
    currentPassword: false,
    password: false,
    confirmPassword: false
  })
  const [updatePassWord, { data, loading, error }] =
    useMutation(UPDATEPASSWORD);
  const [changePassWord, setChangePassWord] = useState({
    currentPassword: '',
    passWord: '',
    confirmPassword: '',
  });
  const [errorChangePassWord, setErrorChangePassWord] = useState<any>({
    errorCurrentPassWord: '',
    errorPassWord: '',
    errorConfirmPassWord: '',
    errorEqualPassWord: '',
  });
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setChangePassWord({
      ...changePassWord,
      [e.target.name]: e.target.value,
    });
  };
  const handleShowProfile = () => {
    if (setEditAccount) {
      setEditAccount(true)
      setShowChangePassword(false);
    } else {
      setShowProfile(true);
      setShowChangePassword(false);
    }
  };
  const handleUpdatePassWord = (e: any) => {
    e.preventDefault()
    if (!changePassWord.currentPassword.length) {
      setErrorChangePassWord({
        errorCurrentPassWord: 'current password is required',
        errorPassWord: '',
        errorConfirmPassWord: '',
        errorEqualPassWord: '',
      });
      return;
    } else if (!changePassWord.passWord.length || changePassWord.passWord.length <= 5) {
      setErrorChangePassWord({
        errorCurrentPassWord: '',
        errorPassWord: 'password is required and loger than five characters',
        errorConfirmPassWord: '',
        errorEqualPassWord: '',
      });
      return;
    } else if (!changePassWord.confirmPassword.length) {
      setErrorChangePassWord({
        errorCurrentPassWord: '',
        errorPassWord: '',
        errorConfirmPassWord: 'confirm password is required',
        errorEqualPassWord: '',
      });
      return;
    } else if (
      changePassWord.passWord.length !== changePassWord.confirmPassword.length
    ) {
      setErrorChangePassWord({
        errorCurrentPassWord: '',
        errorPassWord: '',
        errorConfirmPassWord: '',
        errorEqualPassWord: 'password must match and no more than 5 characters',
      });
      return;
    } else if (
      // changePassWord.currentPassword.length > 7 &&
      changePassWord.passWord === changePassWord.confirmPassword &&
      changePassWord.passWord.length >= 5
    ) {
      setErrorChangePassWord('');
      setIsLoading(true);
      updatePassWord({
        variables: {
          updatePasswordArgs: {
            currentPassword: changePassWord.currentPassword,
            newPassword: changePassWord.passWord,
            newPasswordConfirm: changePassWord.confirmPassword,
          },
        },
        // refetchQueries: [{ query: GETUSERINFOR }],
        onCompleted: dataPassword => {
          if (
            dataPassword?.changePassword?.message ===
            'Change password successfully'
          ) {
            setErrorChangePassWord({
              errorCurrentPassWord: '',
              errorPassWord: '',
              errorConfirmPassWord: '',
              errorEqualPassWord: '',
            });
            if (setEditAccount) {
              setEditAccount(true)
              setShowChangePassword(false);
            }
            toast.success("Your password has been updated", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowProfile(true);
            setShowChangePassword(false);
          } else {
            setErrorChangePassWord({
              errorCurrentPassWord: '',
              errorPassWord: '',
              errorConfirmPassWord: '',
              errorEqualPassWord: '',
            });
            return;
          }
        },
      });
      setIsLoading(false);
    }
  };
  const handleShowCurrentPassword = () => {
    setShowPassword({
      ...showPassword,
      currentPassword: !showPassword.currentPassword
    })
  }
  const handleShowPassword = () => {
    setShowPassword({
      ...showPassword,
      password: !showPassword.password
    })
  }
  const handleShowConfirmPassword = () => {
    setShowPassword({
      ...showPassword,
      confirmPassword: !showPassword.confirmPassword
    })
  }


  // if(error as any) return
  HandleCloseModal(modalRef, setShowChangePassword);

  return (
    <>
      <div id="changePassword-container">

        {
          isLoading ? <LoadingData /> :
            <form onSubmit={handleUpdatePassWord}>
              <div className="changePassword-content" ref={modalRef}>
                <div className="changePassword-title">
                  <h3>Change password</h3>
                  <img
                    onClick={handleShowProfile}
                    src={process.env.REACT_APP_CLIENT_URL + 'img/X.svg'}
                    alt="logo"
                  />
                </div>
                <div className="changePassword-input-container">
                  {/* <h3>{errorChangePassWord.errorEqualPassWord}</h3> */}
                  <div className="changePassword-input">
                    <h4>Current password</h4>
                    <div>
                      <input
                        maxLength={30}
                        ref={inputRef}
                        type={showPassword.currentPassword ? "text" : "password"}
                        value={changePassWord.currentPassword}
                        name="currentPassword"
                        onChange={handleChange}
                      />
                      <span onClick={handleShowCurrentPassword}>{showPassword.currentPassword ? "Hide" : "Show"}</span>
                    </div>
                    <span>
                      {(error?.message as any) ||
                        errorChangePassWord?.errorCurrentPassWord}
                    </span>
                  </div>
                  <div className="changePassword-input">
                    <h4>New password</h4>
                    <div>
                      <input
                        maxLength={30}
                        type={showPassword.password ? "text" : "password"}
                        value={changePassWord.passWord}
                        name="passWord"
                        onChange={handleChange}
                      />
                      <span onClick={handleShowPassword}>{showPassword.password ? "Hide" : "Show"}</span>
                    </div>
                    <span>{errorChangePassWord.errorPassWord}</span>
                  </div>
                  <div className="changePassword-input">
                    <h4>Confirm new password</h4>
                    <div>
                      <input
                        maxLength={30}
                        type={showPassword.confirmPassword ? "text" : "password"}
                        value={changePassWord.confirmPassword}
                        name="confirmPassword"
                        onChange={handleChange}
                      />
                      <span onClick={handleShowConfirmPassword}>{showPassword.confirmPassword ? "Hide" : "Show"}</span>
                    </div>
                    <span>
                      {errorChangePassWord.errorConfirmPassWord ||
                        errorChangePassWord.errorEqualPassWord}
                    </span>
                  </div>
                  <button disabled={isLoading} onClick={handleUpdatePassWord}>Save</button>
                </div>
              </div>
            </form>
        }
      </div>
    </>
  );
}

export default ChangePassWord;
