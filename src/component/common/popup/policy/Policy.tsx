import React from 'react'
import './Policy.scss'

function Policy({setPolicy}:any) {
    return (
        <div id='policy-container'>
            <div className='policy-content'>
                <div className='policy-hedaer'>
                    <h3>Terms and Privacies</h3>
                    <img onClick={() => setPolicy(false)} src={process.env.PUBLIC_URL + 'img/closeNewtransaction.svg'} alt="logo" />
                </div>
                <div className='policy-main'>
                    <h5 className='policy-update'>Last updated: 2022-11-11</h5>
                    <div className='item-policy'>
                        <h3>1- Introduction</h3>
                        <h5>
                            <h5> Welcome to CashGPS!</h5>
                            <h5> These Terms of Service govern your use of our website located at cashgps.com operated by CashGPS.</h5>
                            <h5>Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.</h5>
                            <h5>
                                Your agreement with us includes these Terms and our Privacy Policy. You acknowledge that you have read and understood Agreements, and agree to be bound of them.
                            </h5>
                            <h5>
                                If you do not agree with Agreements, then you may not use the Service, but please let us know by emailing at support@cashgps.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.

                            </h5>
                        </h5>
                    </div>
                    <div className='item-policy'>
                        <h3>2- Account</h3>
                        <h5>
                            <h5> When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service.</h5>
                            <h5> You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</h5>
                            <h5>You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization. You may not use as a username any name that is offensive, vulgar or obscene.</h5>
                            <h5>
                                We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.
                            </h5>
                        </h5>
                    </div>
                    <div className='item-policy'>
                        <h3>3- Copyright Policy</h3>
                        <h5>
                            <h5>  We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity.</h5>
                            <h5>
                                If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to support@cashgps.com, with the subject line: “Copyright Infringement” and include in your claim a detailed description of the alleged Infringement as detailed below, under “DMCA Notice and Procedure for Copyright Infringement Claims” You may be held accountable for damages (including costs and attorneys’ fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.
                            </h5>
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Policy