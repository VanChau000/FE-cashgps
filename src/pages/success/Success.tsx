import { useNavigate } from 'react-router-dom';
import './Success.scss';

function Success() {
  const navigate = useNavigate();
  
  return (
    <>
      <div id="success-container">
        <div className="success-logo">
          <img
            onClick={() => navigate('/login')}
            src={process.env.REACT_APP_CLIENT_URL + 'img/LogoCashgp.svg'}
          />
        </div>
        <div className="success-content">
          <div className="success-content-img">
            <img src={process.env.REACT_APP_CLIENT_URL + 'img/check.png'} />
          </div>
          <h3>Congrats!</h3>
          <h5>Your email address has been verified!</h5>
          <button className="success-btn" onClick={() => navigate('/login')}>
            {' '}
            Go to Login
          </button>
        </div>
      </div>
    </>
  );
}

export default Success;
