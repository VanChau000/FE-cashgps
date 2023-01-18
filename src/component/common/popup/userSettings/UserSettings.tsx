import { useContext, useEffect, useRef, useState } from 'react';
import { GETUSERINFOR } from '../../../../graphql/Query';
import { useQuery } from '@apollo/client';
import { HandleCloseModal } from '../../../../utils/ModalClose';
import './UserSettings.scss';
import { UserCtx } from '../../../../context/user/state';
import axios from 'axios';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../../../config/firebase'
interface TypesUserProfile {
  currency?: String;
  email?: String;
  firstName?: String;
  lastName?: String;
  timezone?: String;
  userId?: Number;
  googleId?: any;
}
interface TypeSet {
  setShowProfile?: Function | undefined;
  setShowChangeName?: Function | undefined;
  setShowTimeZone?: Function | undefined;
  setShowCurrency?: Function | undefined;
  setShowChangePassword?: Function | undefined;
  setEditInforProject?: Function | undefined;
  setEditAccount?: Function | undefined;
}

function UserSettings(props: any) {
  const {
    setShowProfile,
    setShowChangeName,
    setShowTimeZone,
    setShowCurrency,
    setShowChangePassword,
    setEditInforProject,
    setEditAccount
  }: any = props
  const auth = getAuth(app)
  let modalRef: any = useRef();
  const { profile, setProfile } = useContext(UserCtx);
  const { loading, error, data: inforUser } = useQuery(GETUSERINFOR);
  const [userProfile, setUserProfile] = useState<
    TypesUserProfile | undefined
  >();

  useEffect(() => {
    setUserProfile(inforUser?.getUser?.user);
    setProfile(inforUser?.getUser?.user);
  }, [inforUser?.getUser?.user]);

  const handleChangeName = () => {
    if (setEditAccount) {
      setShowChangeName(true);
      setEditAccount(false)
      setShowProfile(false);
    } else if (setShowChangeName && !setEditAccount && setShowProfile) {
      setShowChangeName(true);
      setShowProfile(false);
    }
  };

  const handleChangeTimeZone = () => {
    if (setEditAccount) {
      setShowTimeZone(true);
      setEditAccount(false)
      setShowProfile(false);
    } else if (setShowTimeZone && !setEditAccount && setShowProfile) {
      setShowTimeZone(true);
      setShowProfile(false);
    }
  };
  const handleChangeCurrency = () => {
    if (setEditAccount) {
      setShowCurrency(true);
      setEditAccount(false)
      setShowProfile(true);
    } else if (setShowTimeZone && !setEditAccount && setShowProfile) {
      setShowCurrency(true);
      setShowProfile(false);
    }
  };

  const handleChangePassword = () => {
    if (setEditAccount) {
      setShowChangePassword(true);
      setEditAccount(false)
      setShowProfile(true);
    } else if (setShowTimeZone && !setEditAccount && setShowProfile) {
      setShowChangePassword(true);
      setShowProfile(false);
    }
  };
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
  // const handleLogoutGG =  () => {
  //   localStorage.clear();
  //   const user = localStorage.getItem('token');
  //   if (!user) {
  //      window.open(`${process.env.REACT_APP_CLIENT_HOST}logout`, '_self')
  //     window.location.href = '/login';
  //   }
  // }
  const handleClosePopupSetting = () => {
    if (setEditAccount && setShowProfile) {
      setEditAccount(false)
      setShowProfile(false)
    }
    else if (!setEditAccount && setShowProfile) {
      setShowProfile(false)
    }
  }
  HandleCloseModal(modalRef, setShowProfile as any);
  HandleCloseModal(modalRef, setEditAccount as any);

  return (
    <>
      <div id="container-profile-setting">
        <div id="profile-container" ref={modalRef}>
          <div className="profile-header">
            <span>Account</span>
            <img
              onClick={() => handleClosePopupSetting()}
              src={process.env.REACT_APP_CLIENT_URL + 'img/X.svg'}
              alt="logo"
            />
          </div>
          <div id="profile-setting">
            <div className="profile-setting-content">
              <div className="setting-name">
                <div>
                  <h3>Name</h3>
                  <h5>
                    {userProfile?.firstName} {userProfile?.lastName}
                  </h5>
                </div>
                <h4 onClick={() => handleChangeName()}>Change name</h4>
              </div>
              <div className="setting-email">
                <h3>Email</h3>
                <h5>{userProfile?.email}</h5>
                {
                  userProfile?.googleId === null ? <h4 style={{"opacity":"0"}}>something</h4> :  <h4>Manage by Google</h4>
                }
              </div>
              {/* <hr className="line" /> */}
              <div className="setting-timezone">
                <div>
                  <h3>Time zone</h3>
                  <h5>{userProfile?.timezone}</h5>
                </div>
                <h4 onClick={() => handleChangeTimeZone()}>Change time zone</h4>
              </div>
              <div className="setting-currency">
                <div>
                  <h3>Currency</h3>
                  <h5>{userProfile?.currency}</h5>
                </div>
                <h4 onClick={handleChangeCurrency}>Change currency</h4>
              </div>
              {/* <hr className="line" /> */}
              <div className="setting-password">
                <h3>Password</h3>
                <h5>
                  <img
                    src={
                      process.env.REACT_APP_CLIENT_URL + 'img/passwordIcon.svg'
                    }
                    alt="logo"
                  />
                  Your password is encrypted
                </h5>
                {userProfile?.googleId === null ? (
                  <h4 onClick={handleChangePassword}>Change password</h4>
                ) : (
                  <h4 style={{ color: '#8c9196', cursor: 'default' }}>
                    Change password
                  </h4>
                )}
              </div>
              <div className="setting-logout">
                <h3>Account</h3>
                <div className="setting-btn-signout">
                  <img
                    onClick={() => handleSignout()}
                    src={process.env.REACT_APP_CLIENT_URL + 'img/SignOut.svg'}
                    alt="logo"
                  />
                  <span onClick={handleSignout}>Sign out</span>
                  {/* <span onClick={handleLogoutGG}>Sign out with GG</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default UserSettings;
