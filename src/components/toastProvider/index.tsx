'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}

      toastOptions={
        {
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            height: '75px',
            fontSize: '18px',
            paddingRight: '15px',
            paddingLeft: '15px',
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'white',
            },
          },
        }
      }
    />
  );
};

export default ToastProvider;