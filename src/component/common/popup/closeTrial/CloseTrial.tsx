import React from 'react'
import { useNavigate } from 'react-router-dom'
import './CloseTrial.scss'


function CloseTrial() {
  const navigate = useNavigate()
  return (
    <>
      <div id='closeTrial-container'>
        <div className='closeTrial-content'>
          <div onClick={() => navigate('/')}>
            <img
              className="listProject-image"
              src={process.env.REACT_APP_CLIENT_URL + 'img/Logo.svg'}
              alt="logo"
            />
            <span>CashGPS</span>
          </div>
          <h3>your account need to upgrade</h3>
          <h4>Your Free-trial plan is expired, upgrade your account to continue using</h4>
          <button
            onClick={() => navigate('/subscription')}
          >
            <img
              src={process.env.REACT_APP_CLIENT_URL + 'img/blackStar_update_icon.svg'}
              alt="star"
            />
            Upgrade Now
          </button>
        </div>
      </div>
    </>
  )
}

export default CloseTrial