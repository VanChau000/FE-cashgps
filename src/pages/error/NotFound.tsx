import './NotFound.scss';
import { useNavigate } from 'react-router-dom';

function NotFound({ isOnline }: any) {
  const navigate = useNavigate();
  const user = localStorage.getItem('token');

  const changeDerection = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <div id="noutFound-container">
        <div className="noutFound-container-img">
          {user ? (
            <img
              onClick={() => navigate('/')}
              src={process.env.REACT_APP_CLIENT_URL + 'img/LogoCashgp.svg'}
            />
          ) : (
            <img
              onClick={() => navigate('/login')}
              src={process.env.REACT_APP_CLIENT_URL + 'img/LogoCashgp.svg'}
            />
          )}
        </div>
        <div className="notFound-content-container">
          <img src={process.env.REACT_APP_CLIENT_URL + 'img/Oops404.svg'} />
          <h3 className="notFound-title">404 - page not found</h3>
          <h3 className="notFound-content">
            {isOnline
              ? 'please check your internet connection and try again'
              : 'The page you are looking for might have been removed had its name changed or is temporarily unavailable.'}
          </h3>
          {!isOnline ? (
            <button className="notFound-btn" onClick={changeDerection}>
              Go to homepage
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default NotFound;
