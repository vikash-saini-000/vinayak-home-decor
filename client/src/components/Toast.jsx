import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: 'rgba(15, 15, 15, 0.95)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: '14px 18px',
        fontSize: '14px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      },
      success: {
        iconTheme: {
          primary: '#a78bfa',
          secondary: '#000000',
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: '#000000',
        },
      },
    }}
  />
);

export default Toast;
