import './ConfirmEmail.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ConfirmEmail() {
  const [btnShow, setBtnShow] = useState<boolean>(false);
  const [count, setCount] = useState<number>(10);
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  const localHost = process.env.REACT_APP_CLIENT_HOST;
  const hanldeResendEmail = async () => {
    // navigate(`/auth/signup/confirm/${id}`)
    try {
      await axios.get(`${localHost}auth/signup/confirm/${id}`);
    } catch (error) {
      console.error(error)
    }
    setBtnShow(false);
    setCount(10);
  };

  useEffect(() => {
    let timer = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);
    if (count === 0) {
      setBtnShow(true);
      setCount(10);
    }
    return () => clearInterval(timer);
  }, [count, setCount]);
  return (
    <>
      <div id="confirmemail-container">
        <div>
          <img
          style={{"cursor":"pointer"}}
            onClick={() => navigate('/login')}
            src={process.env.REACT_APP_CLIENT_URL + 'img/LogoCashgp.svg'}
            alt="logo"
          />
        </div>
        <div className="confirmEmail-content">
          <div className="confirmEmail-img-container">
            <img
              className="confirmEmail-img-gmail"
              src={process.env.REACT_APP_CLIENT_URL + 'img/email.svg'}
              alt="logo"
            />
          </div>
          <h3 className="confirmEmail-verify-email">Verify your email</h3>
          <h4 className="confirmEmail-verify-content">
            You’re almost there! We sent an email from{' '}
            <span>cashgps@nelisoftwares.com</span>
          </h4>
          <h4 className="confirmEmail-verify-action">
            Just click on the link in that email to complete your sign up. If
            you don’t see it, you may need to <span>check your spam</span>{' '}
            folder.
          </h4>
          <h4 className="confirmEmail-verify-mention">
            Still can’t find email?
          </h4>
          {btnShow ? (
            <button className="confirmEmail-btn" onClick={hanldeResendEmail}>
              Resend email
            </button>
          ) : (
            <div className="confirmEmail-btn-count">
              00 : {count < 10 ? '0' + count : count}{' '}
            </div>
          )}
          <h4 className="confrimEmail-help">
            Need help? <span>Contact us</span>
          </h4>
        </div>
      </div>
    </>
  );
}

export default ConfirmEmail;
