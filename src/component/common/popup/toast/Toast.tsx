import { useEffect, useState } from 'react';
import './Toast.scss';

function Toast({ activeToast, setToast, toast }: any) {
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setToast({
          ...toast,
          activeToast: false
        });
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);
  return (
    <>
      <div id="toast-active" className={toast.bgToast ? "bg-red-toast" : ''}>
        <h4>{toast.contentToast}&ensp;</h4>
        <img
          onClick={() => setToast({
            ...toast,
            activeToast: false
          })}
          src={process.env.REACT_APP_CLIENT_URL + 'img/xToast.svg'}
          alt="rightArrow"
        />
      </div>
      {/* <button onClick={() => addNewToast()}>add new toast</button>
        {
           <div className=" container position">
           {
             list.map((toast:any, i:any) => (
               <div
                 key={i}
                 className='notification toast position'
                 style={{ backgroundColor: toast.backgroundColor }}
               >
                <h3>{toast}</h3>
               </div>
             ))
           }
         </div>
        } */}
    </>
  );
}

export default Toast;
