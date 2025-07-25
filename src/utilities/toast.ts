import { toast } from 'react-toastify';

export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
) => {
  const commonOptions = {
    position: "bottom-left" as const,
  };

  switch (type) {
    case 'success':
      toast.success(message, commonOptions);
      break;
    case 'error':
      toast.error(message, commonOptions);
      break;
    case 'warning':
      toast.warn(message, commonOptions);
      break;
    case 'info':
    default:
      toast.info(message, commonOptions);
  }
};
