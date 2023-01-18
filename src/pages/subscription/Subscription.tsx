import { useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingData from "../../component/common/loadingData/LoadingData";
import UpgradeSubscription from "../../component/common/popup/upgradeSubscripiton/UpgradeSubscription";
import { REGISTER_FREE_TRIAL } from "../../graphql/Mutation";
import { GETUSERINFOR, GET_SUBSCRIPTION_PROJECT } from "../../graphql/Query";
import { SubscriptionFactory } from "../../models/SubscriptionFactory";
import './Subscription.scss';

export interface iSubscription {
  type: string,
  price?: number,
  originalPrice?: number,
  currency?: string,
  effectiveTime: string,
  permisstion?: Array<string>,
  planId?: string,
}

export const Subscription = () => {
  const { data: inforUser } = useQuery(GETUSERINFOR);
  const { data: getSubscriptionProject, refetch } = useQuery(GET_SUBSCRIPTION_PROJECT)
  const [registerSubscription] = useMutation(REGISTER_FREE_TRIAL);
  const listSubscriptionMonth = SubscriptionFactory.listSubscription();
  const listSubscriptionAnnually = SubscriptionFactory.listAnnually();
  const [toggleTypeSubscription, setToggleTypeSubscription] = useState(true);
  const [typeSubscription, setTypeSubscription] = useState({ type: '', effectiveTime: toggleTypeSubscription ? "MONTHLY" : "ANNUALLY" })
  const currentSubscription = getSubscriptionProject?.getUser?.user
  const dateExpired = SubscriptionFactory.getExpiredSubscription(new Date(currentSubscription?.subscriptionExpiresAt))
  const dateExpiredTimeOut = SubscriptionFactory.getDateExpriredSubscription(new Date(currentSubscription?.subscriptionExpiresAt))
  const currentSubscriptionType = currentSubscription?.activeSubscription.toString().split(' ')
  const [isOpenUpgrade, setIsOpenUpgrade] = useState(false)
  const [subscriptionUpdate, setSubscriptionUpdate] = useState<iSubscription>();
  const [isLoading, setIsloading] = useState(true);

  const handleToggleEffectiveTime = (effectiveTime: string) => {
    if (effectiveTime === "MONTHLY") {
      setToggleTypeSubscription(true)
    } else {
      setToggleTypeSubscription(false)
    }
    setTypeSubscription({ ...typeSubscription, effectiveTime: !toggleTypeSubscription ? "MONTHLY" : "ANNUALLY" })
  }

  const handleChoosePlan = async (subscription: iSubscription) => {
    if (dateExpired > 0 && currentSubscription?.activeSubscription === `${subscription.effectiveTime} ${subscription.type}`) return
    if (dateExpired > 0) {
      setSubscriptionUpdate(subscription)
      setIsOpenUpgrade(true)
      return
    }
    const res = await axios.post('/create-checkout-session',
      { priceId: subscription?.planId, customerId: inforUser.getUser.user.customerId } as any)
    window.location.href = res.data.url
  }

  const renderCurrentSubscription = () => {
    return (
      <div className="current-subscription" data-testid='render-current-subs' >
        <img src={process.env.REACT_APP_CLIENT_URL + 'img/avatar_noBG.svg'} alt="avatar" />
        <div className="current-subscription-text">
          <p>Current plan: {currentSubscriptionType && <span className="type-subscription">{currentSubscriptionType[1] ? currentSubscriptionType[1]?.toLowerCase() : currentSubscriptionType[0] === 'TRIAL' ? ' Free Trial' : ` ${currentSubscriptionType[0]?.toLowerCase()}`}</span>}</p>
          <div>
            {dateExpired > 0 ?
              <>
                <p>Expired date: {currentSubscription?.subscriptionExpiresAt} </p>
                <div className={`${dateExpired > 0 && dateExpired < 7 ? `bg-red` : `bg-blue`} `}>{`${dateExpired} ${dateExpired === 1 ? `day` : `days`} left`} </div>
              </>
              : <span className="time-out-subscription">
                Your {currentSubscriptionType && currentSubscriptionType[1]} has been expired on {dateExpiredTimeOut}
              </span>}
          </div>
        </div>
      </div>
    )
  }


  const renderSubscription = (subscription: iSubscription, idx: number) => {
    return (
      <div className={`subscription ${dateExpired > 0 && currentSubscription?.activeSubscription === `${subscription.effectiveTime} ${subscription.type}` ? `currentSubscription` : `scale`} ${dateExpired > 0 && currentSubscriptionType && currentSubscriptionType[0] === 'ANNUALLY' && currentSubscriptionType[1] === subscription.type ? "currentSubscription" : ""}`} key={idx}>
        {subscription.type.toString().toUpperCase() === "PREMIUM" ? <div className="premium-subscription">
          <img src={process.env.REACT_APP_CLIENT_URL + 'img/StarGold.svg'} alt="start" />
          <p>{subscription.type}</p>
        </div> : <p>{subscription.type}</p>}
        <p><span className={`${dateExpired > 0 && currentSubscription?.activeSubscription === `${subscription.effectiveTime} ${subscription.type}` ? `currentPriceSubscription` : ``} 
        ${dateExpired > 0 && currentSubscriptionType && currentSubscriptionType[0] === 'ANNUALLY' && currentSubscriptionType[1] === subscription.type ? "currentPriceSubscription" : ""}
        `}>{`${subscription.price}${subscription.currency}`}</span>

          <span className={`${dateExpired > 0 && currentSubscription?.activeSubscription === `${subscription.effectiveTime} ${subscription.type}` ? `currentEffectTimeSubscription` : ``} 
        ${dateExpired > 0 && currentSubscriptionType && currentSubscriptionType[0] === 'ANNUALLY' && currentSubscriptionType[1] === subscription.type ? "currentEffectTimeSubscription" : ""}
        `} >{subscription.effectiveTime.toLowerCase()}</span></p>
        <p className="permisstion">
          {subscription?.permisstion?.map((per: any, index: number) => {
            return (
              <span key={index}>{per}</span>
            )
          })}
        </p>
        {currentSubscriptionType && dateExpired > 0 && currentSubscriptionType[0] === 'ANNUALLY' && currentSubscriptionType[1] === subscription.type ?
          <div className={"btnCurrentSubscription"}>Current plan</div> :
          <div className={`${dateExpired > 0 && currentSubscription?.activeSubscription === `${subscription.effectiveTime} ${subscription.type}` ? "btnCurrentSubscription" : "btnPermisstionSelected"} `}
            onClick={() => handleChoosePlan(subscription)}
          >{`${dateExpired > 0 && currentSubscription?.activeSubscription === `${subscription.effectiveTime} ${subscription.type}` ? "Current plan" : "Choose plan"}`}</div>
        }
        {
          !currentSubscription?.activeSubscription.includes('BASIC') && subscription.type === "BASIC" && <div className="popup-best-choice">
            <p >Best choice for start-ups</p>
          </div>
        }
        {
          !currentSubscription?.activeSubscription.includes('PREMIUM') && subscription.type.toString().toUpperCase() === "PREMIUM" && <div className="popup-best-choice">
            <p >Best choice for enterprises</p>
          </div>
        }
      </div>
    )
  }

  const handleClickFreeTrial = () => {
    registerSubscription({
      onCompleted: (data: any) => {
        refetch();
        window.location.href = '/';
      },
    })

  }

  useEffect(() => {
    const loading = setTimeout(() => {
      setIsloading(false)
    }, 1000)
    return () => clearTimeout(loading);
  })

  return (
    <>
      {
        isLoading ? <div className="loading"><LoadingData /> </div> :
          <div className="wrap-subscription">
        <div className="header-subscription" onClick={() => window.location.href = '/'}>
          {dateExpired < 0 || currentSubscription?.activeSubscription === 'NORMAL' ? null : <div className="header-back-home">
            <img src={process.env.REACT_APP_CLIENT_URL + 'img/ArrowLeftBack.svg'} alt="close-icon" />
            <p>Back to homepage</p>
          </div>}
        </div>
        <p className="title-subscription">Choose the better plan for your business</p>
        <p>We believe CashGPS should be accessible to all companies, no matter the size.</p>
        <div className="wrap-body-subscription">
          {currentSubscription?.activeSubscription === "NORMAL" ? <div className="free-trial" onClick={handleClickFreeTrial}>Start 14 days free-trial</div> : renderCurrentSubscription()}
          <div className="toggle-subscription">
            <span className={toggleTypeSubscription ? 'btn-show option1' : 'btn-show option2'}>{toggleTypeSubscription ? 'Monthly' : 'Annually'}</span>
                <span className="btn-subscription" onClick={() => handleToggleEffectiveTime("MONTHLY")} data-testid='btn-subs-monthly'>
              Monthly
            </span>
                <span className='btn-subscription' onClick={() => handleToggleEffectiveTime("ANNUALLY")} data-testid='btn-subs-annually'>
              Annually
            </span>
          </div>
        </div>
        <div className="body-subscription">
          {toggleTypeSubscription ? listSubscriptionMonth.map((subscription: iSubscription, index: number) => {
            return (
              renderSubscription(subscription, index)
            )
          })
            : listSubscriptionAnnually.map((annually: iSubscription, index: number) => {
              return (
                renderSubscription(annually, index)
              )
            })
          }
        </div>
        <div className="bottom-subscription">
          <p>All plans also contain:</p>
          <div>
            <p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Technical support 24/24</span>
            </p><p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Manage all projects</span>
            </p><p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Manage all projects</span>
            </p>
          </div><div>
            <p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Unlimited transactions</span>
            </p><p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Unlimited transactions</span>
            </p><p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Unlimited transactions</span>
            </p>
          </div><div>
            <p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Account information edit</span>
            </p><p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Account information edit</span>
            </p><p>
              <img src={process.env.REACT_APP_CLIENT_URL + 'img/Check.svg'} alt="icon check" />
              <span>Account information edit</span>
            </p>
          </div>
        </div>
        {isOpenUpgrade ? <UpgradeSubscription subscription={subscriptionUpdate} inforUser={inforUser} setIsOpenUpgrade={setIsOpenUpgrade} currentSubscription={currentSubscription} /> : null}
      </div>}


    </>

  )
}

export default Subscription;