import { useEffect, useState, useContext, useRef } from 'react';
import './Login.scss';
import ValidateForm from '../../utils/ValidateFormLogin';
import ValidateFormSingup from '../../utils/ValidateFormSignup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../../component/common/loading/Loading';
import { UserCtx } from '../../context/user/state';
import Policy from '../../component/common/popup/policy/Policy';
import fire from '../../config/firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import ReCAPTCHA from "react-google-recaptcha";
// import Captcha from './Captcha';


interface TypesLogin {
  email: string;
  password: string;
}
interface TypesSingup {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // catcha: boolean;
  letterEmail?: boolean;
  agree: boolean;
}

function Login() {
  const sginUpRef: any = useRef();
  const { login, setProfile, setIsExistedProject }: any = useContext(UserCtx);
  const navigate = useNavigate();
  const auth = getAuth();
  const [errMessage, setErrMessage] = useState<object | undefined | any>({});
  const [beActiveLogin, setBeActiveLogin] = useState<boolean>(true);
  const [beActiveSignUp, setBeActiveSignUp] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isSubmitSignUp, setIsSubmitSignUp] = useState<boolean>(false);
  const [errServer, setErrServer] = useState<string>('');
  const [errServerSignUP, setErrServerSignUP] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [highlight, setHighLight] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const captchaRef: any = useRef(null)
  const [tokenCaptcha, setTokenCaptcha] = useState<any>()
  const [toggleShowPassword, setToggleShowPassword] = useState({
    password: false,
    passwordSignUp: false,
    passwordConfirm: false,
  });
  const [errMessageSignup, setErrMessageSignup] = useState<
    object | undefined | any
  >({});
  const [formLogin, setFormLogin] = useState<TypesLogin>({
    email: '',
    password: '',
  });
  const [formSignUp, setFormSignUp] = useState<TypesSingup>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // catcha: false,
    letterEmail: false,
    agree: false,
  });
  const localHost = process.env.REACT_APP_CLIENT_HOST;
  const [loadingBTn, setLoadingBtn] = useState<boolean>(false);
  const [policy, setPolicy] = useState<any>(false)


  // function handleChange Input
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeSignup = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormSignUp({
      ...formSignUp,
      [e.target.name]: value,
    });
  };

  // function toggle acitve css
  const toggleClassLogin = () => {
    setBeActiveLogin(true);
    setBeActiveSignUp(false);
  };
  const onChange = (value: any) => {
    const token = captchaRef.current.getValue();
    setTokenCaptcha(token)
  }

  const toggleClassSignup = () => {
    setBeActiveLogin(false);
    setBeActiveSignUp(true);
  };

  const toggleLogin = beActiveLogin ? 'activeLogin' : null;
  const toggleSignUp = beActiveSignUp ? 'activeSignUp' : null;

  // function handler login form
  const handleLogin = async (e: any) => {

    e.preventDefault();
    if (formLogin.email.length && formLogin.password.length) {
      setErrMessage(ValidateForm(formLogin));
      setIsSubmit(true);
    }
  };

  const handleClick = (value: string) => {
    if (value === 'password')
      setToggleShowPassword({
        ...toggleShowPassword,
        password: !toggleShowPassword.password,
      });
    if (value === 'password-signUp')
      setToggleShowPassword({
        ...toggleShowPassword,
        passwordSignUp: !toggleShowPassword.passwordSignUp,
      });
    if (value === 'password-signUpConfirm')
      setToggleShowPassword({
        ...toggleShowPassword,
        passwordConfirm: !toggleShowPassword.passwordConfirm,
      });
  };

  useEffect(() => {
    const submitLogin = async () => {
      if (Object.keys(errMessage).length === 0 && isSubmit) {
        try {
          setLoading(true);
          // setInterval(async () => {
          const res = await axios.post(`${localHost}auth/login`, {
            ...formLogin,
          });
          const dataProject = ({ activeSubscription: res?.data?.loginResult?.profile?.activeSubscription, subscriptionExpiresAt: res?.data?.loginResult?.profile?.subscriptionExpiresAt })
          const existedProject = res.data.loginResult.profile.hasProject;
          const profile = res.data.loginResult.profile;
          localStorage.setItem("isExistedProject", existedProject)
          setProfile({
            firstName: profile.firstName,
            lastName: profile.lastName,
            currency: profile.currency,
            timezone: profile.timezone,
            projectId: profile.projectId,
            hasProject: profile.hasProject,
          });
          const token = res.data.loginResult.accessToken;
          if (token) {
            await login(token);
            await setIsExistedProject(existedProject)
          }
          if (dataProject.activeSubscription === "NORMAL" || new Date(dataProject.subscriptionExpiresAt) < new Date()) {
            window.location.href = '/subscription'
          }
          else {
            setLoading(false);
            window.location.href = '/';
          }

          // }, 1900)
          // setLoading(false);
        } catch (error: any) {
          setLoading(false);
          setErrServer(error.response.data.error);
        }
      }
    };
    submitLogin();
  }, [errMessage, isSubmit]);

  const handleSignUp: any = (e: any) => {
    setLoadingBtn(true);
    let timer = setTimeout(() => {
      setLoadingBtn(false);
    }, 700);
    e.preventDefault();
    setErrMessageSignup(ValidateFormSingup(formSignUp));
    setIsSubmitSignUp(true);
    setLoadingBtn(true);
    return () => {
      clearTimeout(timer);
    };
  };

  useEffect(() => {
    const submitSignUp = async () => {
      if (Object.keys(errMessageSignup).length === 0 && isSubmitSignUp) {
        try {
          const user = { ...formSignUp, token: tokenCaptcha }
          const res = await axios.post(`${localHost}auth/signup`, {
            ...user,
          });
          captchaRef.current.reset();
          localStorage.setItem('id', res.data.signupResult.id);
          navigate('/confirmEmail');
        } catch (error: any) {
          setSuccessMessage('');
          setErrServerSignUP(error.response.data.error.message);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    submitSignUp();
  }, [errMessageSignup, isSubmit]);

  //google login
  useEffect(() => {
    fire.auth().onAuthStateChanged((userCred: any) => {
      if (userCred) {
        // setAuth(true);
        // window.localStorage.setItem('token', 'true');
        userCred.getIdToken().then((token: any) => {
          // login(token);
        });
      }
    });
  }, []);
  const loginWithGoogle = async () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (response: any) => {
        const { email, firstName, lastName } = response._tokenResponse
        const { uid: googleId, accessToken } = response.user
        const user = {
          accessToken,
          googleId,
          email,
          firstName,
          lastName,
        };
        try {
          const res = await axios.post(`${localHost}auth/google/callback`, {
            ...user
          });
          const isEmailVerified = res.data.userLoginGoogle.profile.isEmailVerified
          localStorage.setItem('id', res.data.userLoginGoogle.profile.id);
          const dataProject = ({ activeSubscription: res?.data?.userLoginGoogle?.profile?.activeSubscription, subscriptionExpiresAt: res?.data?.userLoginGoogle?.profile?.subscriptionExpiresAt })
          const existedProject = res.data.userLoginGoogle.profile.hasProject;
          localStorage.setItem("isExistedProject", existedProject)
          const token = res?.data.userLoginGoogle.accessToken;
          if (!isEmailVerified) {
            navigate('/confirmEmail');
          } else {
            if (token) {
              await login(token);
            }
            if (dataProject.activeSubscription === "NORMAL" || new Date(dataProject.subscriptionExpiresAt) < new Date()) {
              window.location.href = '/subscription'
            }
            else {
              window.location.href = '/';
            }
          }
        } catch (error: any) {
          setErrServer(error.response.data.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // handler highlight btn
  useEffect(() => {
    const checkFillInput = () => {
      if (
        formSignUp.firstName.length > 0 &&
        formSignUp.lastName.length > 0 &&
        formSignUp.password.length > 0 &&
        formSignUp.email.length > 0 &&
        formSignUp.confirmPassword.length > 0 &&
        formSignUp.agree === true &&
        tokenCaptcha?.length > 0
        // formSignUp.catcha === true
      ) {
        setHighLight(true);
      } else {
        setHighLight(false);
      }
    };
    checkFillInput();
  }, [formSignUp, setHighLight, tokenCaptcha]);


  return (
    <>
      <div id={policy ? "container-fixed" : "container"}>
        <img
          className="img-logo"
          src={process.env.REACT_APP_CLIENT_URL + 'img/LogoCashgp.svg'}
          alt="logo"
        />
        <div
          className={beActiveLogin ? 'form-container' : 'form-container sigup'}>
          <div className="form-container-header">
            <div
              data-testid='title-login'
              className={`form-container-header-login ${toggleLogin}`}
              onClick={toggleClassLogin}>
              Log in
            </div>
            <div
              data-testid='title-signup'
              className={`form-container-header-login ${toggleSignUp}`}
              onClick={toggleClassSignup}>
              Sign up
            </div>
          </div>
          {beActiveLogin ? (
            <div className="form-content">
              <form className="form-login-container" onSubmit={handleLogin}>
                <div className="form-title">
                  {errServer ? (
                    <div className="errServer">
                      {/* <span className="exclamation-mark">!</span> &nbsp;{' '} */}
                      <img src={process.env.REACT_APP_CLIENT_URL + 'img/warningIcon.svg'} alt="error" /> &nbsp;
                      {errServer}
                    </div>
                  ) : null}
                  <div className="form-title">Email address</div>
                  <input
                    data-testid="input-email"
                    type="email"
                    name="email"
                    className={
                      errMessage.email ? 'form-input error' : 'form-input'
                    }
                    value={formLogin.email}
                    onChange={e => handleOnchange(e)}
                    autoComplete="off"
                  />
                  {errMessage.email && (
                    <div className="errMessage">{errMessage.email}</div>
                  )}
                </div>
                <div className="form-title">
                  <div className="title-password">
                    <span>Password</span>
                    <span
                      className="title-forgot"
                      onClick={() => navigate('/forgotPassword')}>
                      Forgot password
                    </span>
                  </div>
                  <div style={{ "position": "relative" }}>
                    <input
                      data-testid='input-password'
                      maxLength={30}
                      type={`${toggleShowPassword.password ? 'text' : 'password'
                        }`}
                      name="password"
                      className={
                        errMessage.password
                          ? 'form-input password error'
                          : 'form-input'
                      }
                      value={formLogin.password}
                      onChange={handleOnchange}
                    />

                    <span
                      className="hide-show-password"
                      onClick={() => handleClick('password')}>
                      {toggleShowPassword.password ? 'Hide' : 'Show'}
                    </span>
                  </div>
                  {errMessage.password && (<div className="errMessage">{errMessage.password}</div>)}
                </div>
                <button type="submit" style={{ opacity: '0' }}></button>
              </form>
              <div className="form-google-container">
                <button
                  data-testid="btn-login"
                  onClick={handleLogin}
                  disabled={
                    !formLogin.email.length || !formLogin.password.length
                  }
                  className={
                    formLogin.email.length > 0 && formLogin.password.length > 0
                      ? 'form-google-container-login fill-input'
                      : 'form-google-container-login'
                  }>
                  <span>Login</span>
                </button>
                <div className="or">or</div>
                <div className="btn-google" onClick={() => loginWithGoogle()} >
                  <img src={process.env.REACT_APP_CLIENT_URL + 'img/Google.svg'} alt="google login" />
                  <button>Log in with Google</button>
                </div>
                <div className="btn-signup">
                  New to CashGPS?{' '}
                  <span onClick={toggleClassSignup}>Sign up</span>
                </div>
              </div>
            </div>
          ) : (
            <form id="form-cotainer-signup" onSubmit={handleSignUp}>
              {errServerSignUP ? (
                <div className="errServer">
                  {/* <span className="exclamation-mark">!</span> &nbsp; */}
                  <img src={process.env.REACT_APP_CLIENT_URL + 'img/warningIcon.svg'} alt="error" /> &nbsp;
                  <h4>{errServerSignUP}</h4>
                </div>
              ) : null}
              {successMessage && successMessage.length > 0 ? (
                <div className="successMessage-password">{successMessage}</div>
              ) : null}
              <div className="form-input-fullname">
                <div>
                  <div>First name</div>
                  <input
                    data-testid="firstname-test"
                    type="text"
                    className={
                      errMessageSignup.firstName
                        ? 'input-firstName errors'
                        : 'input-firstName'
                    }
                    name="firstName"
                    value={formSignUp.firstName}
                    onChange={handleChangeSignup}
                    autoComplete="__away"
                  />
                  {errMessageSignup.firstName && (
                    <div className="errMessage">
                      {errMessageSignup.firstName}
                    </div>
                  )}
                </div>
                <div>
                  <div>Last name</div>
                  <input
                    data-testid="lastname-test"
                    type="text"
                    className={
                      errMessageSignup.lastName
                        ? 'input-firstName errors'
                        : 'input-firstName'
                    }
                    name="lastName"
                    value={formSignUp.lastName}
                    onChange={handleChangeSignup}
                    autoComplete="__away"

                  />
                  {errMessageSignup.lastName && (
                    <div className="errMessage">
                      {errMessageSignup.lastName}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-input-email">
                <div>Email address</div>
                <input
                  data-testid="email-test"
                  type="email"
                  className={
                    errMessageSignup.email
                      ? 'input-email errors'
                      : 'input-email'
                  }
                  placeholder="abc@example.com"
                  name="email"
                  value={formSignUp.email}
                  onChange={handleChangeSignup}
                />
                {errMessageSignup.email && (
                  <div className="errMessage">{errMessageSignup.email}</div>
                )}
              </div>
              <div className="form-input-password">
                <div>Password</div>
                <div className='password-input'>
                  <input
                    data-testid="pass-test"
                    type={`${toggleShowPassword.passwordSignUp ? 'text' : 'password'
                      }`}
                    maxLength={30}
                    className={
                      errMessageSignup.password
                        ? 'input-password errors'
                        : 'input-password'
                    }
                    placeholder="Enter your password"
                    name="password"
                    value={formSignUp.password}
                    onChange={handleChangeSignup}
                  />
                  <span className='show-passWord' onClick={() => handleClick('password-signUp')}>
                    {toggleShowPassword.passwordSignUp ? 'Hide' : 'Show'}
                  </span>
                </div>
                <div>
                  {formSignUp.password.length > 0 && (
                    <span className="password-recommend">
                      Strong password should include caps, numbers and symbols
                    </span>
                  )}
                </div>
                {errMessageSignup.password && (
                  <div className="errMessage">{errMessageSignup.password}</div>
                )}
              </div>
              <div className="form-input-password form-input-confirmPassword">
                <div>Confirm password</div>
                <div className='passwordConfirm-input'>
                  <input
                    data-testid='passConfirm-test'
                    type={`${toggleShowPassword.passwordConfirm ? 'text' : 'password'
                      }`}
                    className={
                      errMessageSignup.confirmPassword
                        ? 'input-password errors'
                        : 'input-password'
                    }
                    maxLength={30}
                    placeholder="Enter your password"
                    name="confirmPassword"
                    value={formSignUp.confirmPassword}
                    onChange={handleChangeSignup}
                    autoComplete="new-password"
                  />
                  <span className='show-ConfirmPassWord' onClick={() => handleClick('password-signUpConfirm')}>
                    {toggleShowPassword.passwordConfirm ? 'Hide' : 'Show'}
                  </span>
                </div>
                {errMessageSignup.confirmPassword && (
                  <div className="errMessage">
                    {errMessageSignup.confirmPassword}
                  </div>
                )}

              </div>

              {errMessageSignup.catcha && (
                <div className="errMessage">{errMessageSignup.catcha}</div>
              )}
              <div className="form-check-argee">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formSignUp.agree === true}
                  onChange={handleChangeSignup}
                />
                <span className="checkbox-title">
                  I agree with CashGPS <span onClick={() => setPolicy(true)}>Terms and Privacies</span>
                </span>
              </div>
              {errMessageSignup.agree && (
                <div className="errMessage">{errMessageSignup.agree}</div>
              )}
              <div className="form-input-catcha" >
                <ReCAPTCHA
                  sitekey={`${process.env.REACT_APP_GG_SITE_KEY}`}
                  // sitekey="6Ld7L5YjAAAAAHtU0ippoYbxpOkVC78g24eq-v3k"
                  onChange={onChange}
                  ref={captchaRef}
                  onExpired={() => {
                    captchaRef.current.reset(); // here
                  }}
                  hl="en"
                />
              </div>
              {loadingBTn ? (
                <div className="buttonload">
                  <i className="fa fa-spinner fa-spin"></i>
                </div>
              ) : (
                <button
                  ref={sginUpRef}
                  disabled={!highlight}
                  className={
                    highlight ? 'btn-signup fill-input-signUp' : 'btn-signup'
                  }
                  onClick={handleSignUp}>
                  Sign up
                </button>
              )}
              <div className="footer-signup">
                You already have an account?
                <span onClick={toggleClassLogin}> Log in</span>
              </div>
              <button type="submit" style={{ opacity: '0' }}></button>
            </form>
          )}
        </div>
      </div>
      {loading === true ? <Loading /> : null}
      {policy === true ? <Policy setPolicy={setPolicy} /> : null}
    </>
  );
}

export default Login;
