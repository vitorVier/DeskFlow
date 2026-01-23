'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          height: '75px',
          fontSize: '18px',
          paddingRight: '15px',
          paddingLeft: '15px',
          maxWidth: '450px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'green',
            secondary: 'white',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
        },
        blank: {
          icon: '⚠️',
          style: {
            backgroundColor: '#FFFBEB',
            color: '#92400E',
            border: '1px solid #FDE68A',
          }
        }
      }}
    />
  );
};

export default ToastProvider;