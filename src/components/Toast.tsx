import {
  useId,
  Toaster,
  useToastController,
  ToastTitle,
  Toast,
} from '@fluentui/react-components';
import { forwardRef, useImperativeHandle } from 'react';

export type ToastType = 'success' | 'error';

type Props = {
  defaultMessage?: string;
  defaultType?: ToastType;
};

export type ToastActionRef = {
  notify: (message?: string, type?: ToastType) => void;
};

export const ToastAction = forwardRef<ToastActionRef, Props>(
  ({ defaultMessage = 'Action completed', defaultType = 'success' }, ref) => {
    const toasterId = useId('toaster');
    const { dispatchToast } = useToastController(toasterId);

    const notify = (message?: string, type?: ToastType) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{message ?? defaultMessage}</ToastTitle>
        </Toast>,
        { position: 'top-end', intent: type ?? defaultType }
      );
    };

    useImperativeHandle(ref, () => ({ notify }));

    return <Toaster toasterId={toasterId} />;
  }
);

ToastAction.displayName = 'ToastAction';
