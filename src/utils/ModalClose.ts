import { useEffect } from 'react';

export const HandleCloseModal = (
  ref: any,
  callback: (state: boolean)  => void,
) => {
  useEffect(() => {
    let handler = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.addEventListener('mousedown', handler);
    };
  });
};
export const HandleCloseModalAndDeleteValue = (ref: any,
  callback: (state: boolean) => void, setCallBack :any) => {
  useEffect(() => {
    let handler = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(false);
        setCallBack('')
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.addEventListener('mousedown', handler);
    };
  });
}
