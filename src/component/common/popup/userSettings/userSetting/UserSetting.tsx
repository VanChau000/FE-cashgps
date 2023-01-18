import { getAuth, signOut } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react'
import { app } from '../../../../../config/firebase';
import BillFactory from '../../../../../models/BillFactory';
import { HandleCloseModal } from '../../../../../utils/ModalClose'
import axios from 'axios'
import './UserSetting.scss'
import { useQuery } from '@apollo/client';
import { GETUSERINFOR } from '../../../../../graphql/Query';
function UserSetting({ setOpenAccountSetting, setEditAccount, setIsOpenBilling, setBillsHistory, setLoading }: any) {

  const avatarRef: any = useRef()
  const auth = getAuth(app)
  const [customerId, setCustomerId] = useState<any>('')
  const localHost = process.env.REACT_APP_CLIENT_HOST;
  const { data: inforUser } = useQuery(GETUSERINFOR);

  const handleSignout = () => {
    localStorage.clear();
    signOut(auth)
    const user = localStorage.getItem('token');
    if (!user) {
      window.open(`${process.env.REACT_APP_CLIENT_HOST}logout`, '_self')
      // window.location.href = (`${process.env.REACT_APP_CLIENT_HOST}logout`)
      window.location.href = '/login';
    }
  };

  const handleOpenBilling = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${localHost}historyPayment`, {
        customerId
      })
      const data = BillFactory.getBillsHistory(res)
      setBillsHistory(data)
      setIsOpenBilling(true)
      setLoading(false)
    } catch (error) {
      
    }
  }

  useEffect(() => {
    setCustomerId(inforUser?.getUser.user.customerId)
  }, [inforUser])

  HandleCloseModal(avatarRef, setOpenAccountSetting as any)

  return (
    <>
      <div className='wrap-pop-userSetting' ref={avatarRef}>
        <div className='pop-userSetting'>
          <div>
            <div className="user-profile" onClick={() => setEditAccount(true)}>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/UserCircle.svg'} alt="user profile" />
              <p>
                My profile
              </p>
            </div>
            <div className="user-billing" onClick={handleOpenBilling}>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/CreditCard.svg'} alt="user billing" />
              <p>Billing</p>
            </div>
            <div className="user-signOut" onClick={handleSignout}>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/SignOutUserSetting.svg'} alt="user signOut" />
              <p>Sign out</p>
            </div>
          </div>
          <div className='version'>
            <p>Build version 1.0.11</p>
          </div>
        </div>
      </div>


    </>
  )
}

export default UserSetting