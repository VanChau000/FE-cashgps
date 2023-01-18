import React from 'react'
import './SuccessPayment.scss'
function SuccessPayment() {

  const handleBackHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="successPayment">
      <img src={process.env.REACT_APP_CLIENT_URL + "img/check.png"} />
      <p className='titleSuccessful'>Payment successful</p>
      <p>You have successfully upgraded your account.
      </p>
      <p>Let's experience the new feature.</p>
      <div className='btnBackHome' onClick={handleBackHome}>Go to homepage</div>
    </div>
  )
}

export default SuccessPayment;