import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Toast from './component/common/popup/toast/Toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateProject from './pages/createProject/CreateProject';
import { useContext } from 'react';
import { UserCtx } from './context/user/state';
import { ToastContainer } from 'react-toastify';
import Loading from './component/common/loading/Loading';
import Login from './pages/login/Login';
import NotFound from './pages/error/NotFound';
import ForgotPassword from './pages/forgotPassword/ForgotPassword ';
import ResetPassword from './pages/resetPassword/ResetPassword';
import Policy from './component/common/popup/policy/Policy';
import ConfirmEmail from './pages/confirmEmail/ConfirmEmail';
import CloseTrial from './component/common/popup/closeTrial/CloseTrial';
import Success from './pages/success/Success';
import Subscription from './pages/subscription/Subscription';
import SuccessPayment from './pages/successPayment/SuccessPayment';
import ListProject from './pages/listProject/ListProject';
import Home from './pages/home/Home';

function App() {
  const { user, isExistedProject } = useContext(UserCtx);
  const isOnline = navigator.onLine;
  return (
    <>
      {isOnline ? (
        <div className="App">
          <ToastContainer autoClose={1500} style={{ "position": "absolute", "zIndex": "999999999" }} />
            <Routes>
              <Route path="/:projectId" element={user && isExistedProject === 'true' ? <Home /> : <Login />} />
              <Route path="/sharing/:permission/:ownerId/:projectId" element={user && isExistedProject === 'true' ? <Home /> : <Login />} />
              <Route path="/" element={user ? <ListProject /> : <Login />} />
              <Route
                path="login"
                element={user && isExistedProject === 'true' ? <Navigate to="/" /> : <Login />}
              />
              <Route path="/forgotPassword" element={user ? <NotFound /> : <ForgotPassword />} />
              <Route path="/resetPassword/:token" element={<ResetPassword />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/listProject" element={<ListProject />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/confirmEmail" element={<ConfirmEmail />} />
              <Route path="/success" element={<Success />} />
              <Route path="/expiredTrial" element={user ? <CloseTrial /> : <NotFound />} />
              <Route path="/toast" element={<Toast />} />
              <Route
                path="/newProject"
                element={<CreateProject />}
              />
              <Route path='/subscription' element={<Subscription />} />
              <Route path='/successPayment' element={<SuccessPayment />} />
              <Route path="*" element={<NotFound />} />
            <Route path="notFound" element={<NotFound />} />
          </Routes>
        </div>
      ) : (
        <div>
          <NotFound isOnline={isOnline} />
        </div>
      )}
    </>
  );
}

export default App;
