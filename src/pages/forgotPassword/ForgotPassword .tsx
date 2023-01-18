import { useEffect, useState } from 'react';
import axios from 'axios';
import './ForgotPassword.scss';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [submit, setSubmit] = useState<boolean>(false);
  const [loadingBTn, setLoadingBtn] = useState<boolean>(false);
  const localHost = process.env.REACT_APP_CLIENT_HOST;

  const handleSignUp: any = (e: any) => {
    setLoadingBtn(true);
    let timer = setTimeout(() => {
      setLoadingBtn(false);
    }, 2500);
    e.preventDefault();
    setLoadingBtn(true);
    setSubmit(true);
    return () => {
      clearTimeout(timer);
    };
  };

  useEffect(() => {
    const handeForgotPassword = async () => {
      if (submit === true) {
        setSuccessMessage('')
        setErrorEmail('')
        setErrorMessage('')
        setTimeout(async () => {
          if (!email) {
            setErrorEmail('Email is requied');
            return;
          } else if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              email,
            )
          ) {
            setErrorEmail('You must enter a valid email. Please try again.');
          } else {
            setErrorEmail('');
            try {
              setLoadingBtn(true);
              const res = await axios.post(`${localHost}auth/forgot/password`, {
                email,
              });
              const successMes = res.data.forgotPassword.message;
              setSuccessMessage(successMes);
              setLoadingBtn(false);
              setErrorMessage('');
              setSubmit(false);
            } catch (error: any) {
              setErrorMessage(error.response.data.error.message);
              setSuccessMessage('');
              setSubmit(false);
            }
          }
        }, 2500)
      }
    }
    handeForgotPassword()
  }, [submit])
  return (
    <>
      <div id="form-forgotPassword-container">
        <div className="form-forgotPassword-img">
          <img
            onClick={() => navigate('/login')}
            className="form-forgotPassword-img-logo"
            src={process.env.REACT_APP_CLIENT_URL + 'img/LogoCashgp.svg'}
          />
        </div>
        <div className="forgotPassword-input-container">
          <div className="forgotPassword-input">
            <h5>
              Enter the email you used to register your account to retrieve your
              password
            </h5>
            {errorMessage && errorMessage?.length > 0 ? (
              <div className="errorMessage-password">
                <img
                  src={process.env.REACT_APP_CLIENT_URL + 'img/warningIcon.svg'}
                  alt="error"
                />
                <h5>
                  {errorMessage}{' '}
                </h5>
                <span onClick={() => navigate('/login')}> Login </span>
              </div>
            ) : null}
            {successMessage && successMessage?.length > 0 ? (
              <div className="successMessage-password">{successMessage}</div>
            ) : null}
            <div className="input-container">
              <input
                type="email"
                placeholder="abc@example.com"
                name="email"
                value={email}
                className={
                  errorEmail
                    ? 'input-container-value error-email'
                    : 'input-container-value'
                }
                onChange={e => setEmail(e.target.value)}
              />
              {errorEmail && (
                <div className="forgotPassword-input-error">{errorEmail}</div>
              )}
            </div>
            {
              !loadingBTn ?
                <button
                  disabled={!email.length}
                  className={
                    email.length > 0
                      ? 'forgotPassword-input-btn fill-input'
                      : 'forgotPassword-input-btn'
                  }
                  onClick={handleSignUp}>
                  Next
                </button>
                :
                <div className="buttonload">
                  <i className="fa fa-spinner fa-spin"></i>
                </div>
            }

          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
