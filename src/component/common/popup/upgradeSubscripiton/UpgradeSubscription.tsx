import './UpgradeSubscription.scss'
import { SubscriptionFactory } from '../../../../models/SubscriptionFactory'
import { iSubscription } from '../../../../pages/subscription/Subscription'
import axios from 'axios'

export default function UpgradeSubscription(props: any) {
  const { subscription, inforUser, setIsOpenUpgrade, currentSubscription } = props;

  const dateExpired = SubscriptionFactory.getExpiredSubscription(new Date(currentSubscription?.subscriptionExpiresAt))
  const typeSubscription = currentSubscription?.activeSubscription?.split(' ')
  const handleChoosePlan = async (subscription: iSubscription) => {
    const res = await axios.post('/create-checkout-session',
      { priceId: subscription?.planId, customerId: inforUser.getUser.user.customerId } as any)
    window.location.href = res.data.url
  }

  return (
    <div className='wrap-upgrade'>
      <div className='upgrade-subscription' >
        <div className="header-upgrade-subscription">
          <p>
            Change plan
          </p>
          <img src={process.env.REACT_APP_CLIENT_URL + 'img/closeNewtransaction.svg'} alt="close-icon" onClick={() => setIsOpenUpgrade(false)} />
        </div>
        <div className="body-upgrade-subscripiton">
          <div className="warning-subscripiton">
            <img src={process.env.REACT_APP_CLIENT_URL + 'img/protection_grey_icon.svg'} alt="warning-icon" />
            <span>
              Your current plan still has {dateExpired} days left.
            </span>
          </div>
          <p>
            Are you sure you want to upgrade to <span className='upgrade-type'>{subscription?.type.toLowerCase()}</span> plan? You won’t receive a refund for your current plan. This can’t be undone.
          </p>
        </div>
        <div className="foot-upgrade-subscription">
          <p className="btn-cancel" onClick={() => setIsOpenUpgrade(false)}>
            Cancel
          </p>
          <div className="btn-confirm" onClick={() => handleChoosePlan(subscription)}>
            Continue checkout
          </div>
        </div>

      </div>
    </div>
  )
}
