import './Loading.scss';

function Loading() {
  return (
    <>
      <div id="loading-container">
        <div className="laoding-content">
          <div className="loading-img">
            <img
              src={process.env.REACT_APP_CLIENT_URL + 'img/Frame1.png'}
              alt="logo"
            />
          </div>
          <div className="loading-text">
            <h4>Creating Nelisoftwares project. Please wait...</h4>
          </div>
          <div className="loading-animation">
            <div className="line-box">
              <div className="line"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loading;
