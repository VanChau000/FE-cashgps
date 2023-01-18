import axios from 'axios';
import { useEffect, useState } from 'react';
import './ResetPassword.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { VERTIFY_TOKEN_RESET_PASSWORD } from '../../graphql/Mutation';
import { useMutation } from '@apollo/client';
import NotFound from '../error/NotFound';

interface TypesReset {
  passWord: string;
  confirmPassWord: string;
}

function ResetPassword() {
  const localHost = process.env.REACT_APP_CLIENT_HOST;
  const { token } = useParams();
  const navigate = useNavigate();
  const [isVertify, setVertify] = useState<any>(true)
  const [errPassword, setErrPassword] = useState<string>();
  const [errConfirmPassword, setErrConfirmPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [showText, setShowText] = useState(false);
  const [formResetPassWord, setFormResetPassWord] = useState<TypesReset>({
    passWord: '',
    confirmPassWord: '',
  });
  const [showPassword, setShowPassword] = useState<any>({
    password: false,
    confirmPassword: false
  })
  const [isVertifyToken] = useMutation(VERTIFY_TOKEN_RESET_PASSWORD, {
    variables: {
      token: token
    },
    onCompleted: (data) => {
      setVertify(data?.isLinkResetPasswordExpired)
    }
  })
  useEffect(() => {
    isVertifyToken({
      variables: {
        token: token
      },
      onCompleted: (data) => {
        setVertify(data?.isLinkResetPasswordExpired)
      }
    })
  }, [token])
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormResetPassWord({
      ...formResetPassWord,
      [e.target.name]: e.target.value,
    });
  };
  const handleFocusInput = () => {
    setShowText(true);
    setErrPassword('');
  };
  const handleReset = async (e: any) => {
    e.preventDefault();
    if (!formResetPassWord.passWord) {
      setErrPassword('Password is requied');
    } else if (
      formResetPassWord.confirmPassWord !== formResetPassWord.passWord
    ) {
      setErrConfirmPassword('Confirm password is not match');
    } else {
      setErrorMessage('');
      setErrConfirmPassword('');
      try {
        const res = await axios.post(
          `${localHost}auth/reset/password/${token}`,
          { password: formResetPassWord.passWord },
        );
        const successMes = res.data.result;
        setSuccessMessage(successMes);
        setErrorMessage('');
        // setTimeout(() => {
        navigate('/login');
        // }, 3000);
      } catch (error: any) {
        console.error(error);
        setErrorMessage(error?.response.data.error.message);
        setSuccessMessage('');
      }
    }
  };
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

  return (
    <>
      {
        isVertify ?
          <div id="form-resetPassword-container">
            <div className="form-resetPassword-container-img">
              <img
                onClick={() => navigate('/login')}
                src={process.env.REACT_APP_CLIENT_URL + 'img/LogoCashgp.svg'}
                alt="logo"
              />
            </div>
            <div id="form-resetPassword-input">
              <p className="form-resetPassword-input-title">
                Set your new password
              </p>
              {errorMessage && errorMessage.length > 0 ? (
                <div className="errorMessage-password">
                  <img
                    src={process.env.REACT_APP_CLIENT_URL + 'img/errRed.svg'}
                    alt="error"
                  />
                  <h3>{errorMessage}</h3>
                </div>
              ) : null}
              {successMessage && successMessage.length > 0 ? (
                <div className="successMessage-password">{successMessage}</div>
              ) : null}
              <div className="form-resetPassword-input-container">
                <h4 className="form-resetPassword-input-titlePassword">Password</h4>
                <input
                  type={showPassword.password ? "text" : "password"}
                  value={formResetPassWord.passWord}
                  name="passWord"
                  className="form-resetPassword-input-value"
                  placeholder="Enter your password"
                  onChange={handleOnchange}
                  onFocus={handleFocusInput}
                  onBlur={() => setShowText(false)}
                />
                {showText ? (
                  <div className="text-recommend">
                    Strong password should include caps, numbers and symbols
                  </div>
                ) : (
                  ''
                )}
                {errPassword ? (
                  <div className="errorMessage">{errPassword}</div>
                ) : null}
                <span className="strong-password" onClick={handleShowPassword}>
                  {showPassword.password === false ? "Show" : "Hide"}
                </span>
              </div>
              <div className="form-resetPassword-input-container">
                <h4 className="form-resetPassword-input-titlePassword">
                  Confirm password
                </h4>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={formResetPassWord.confirmPassWord}
                  name="confirmPassWord"
                  className="form-resetPassword-input-value"
                  placeholder="Enter your password"
                  onChange={handleOnchange}
                />
                {errConfirmPassword ? (
                  <div className="errorMessage">{errConfirmPassword}</div>
                ) : null}
                <span className="strong-password" onClick={handleShowConfirmPassword}>
                  {showPassword.confirmPassword === false ? "Show" : "Hide"}
                </span>
              </div>
              <button
                disabled={
                  !formResetPassWord.passWord.length ||
                  !formResetPassWord.confirmPassWord.length
                }
                className={
                  formResetPassWord.passWord && formResetPassWord.confirmPassWord
                    ? 'resetPassword-btn-next fill-input'
                    : 'resetPassword-btn-next'
                }
                onClick={handleReset}>
                Next
              </button>
            </div>
          </div> : <NotFound />
      }
    </>
  );
}

export default ResetPassword;
