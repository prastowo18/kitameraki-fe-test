import React, { createContext, useContext } from 'react';

import {
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
} from '@fluentui/react-components';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastContextType = {
  notify: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const GLOBAL_TOASTER_ID = 'app-toaster';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { dispatchToast } = useToastController(GLOBAL_TOASTER_ID);

  const notify = (message: string, type: ToastType = 'info') => {
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent: type, position: 'top-end' }
    );
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <Toaster toasterId={GLOBAL_TOASTER_ID} />
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
