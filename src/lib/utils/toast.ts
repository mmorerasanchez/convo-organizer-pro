
import { toast as sonnerToast } from 'sonner';

// Standard toast types for consistent usage across app
export const toast = {
  /**
   * Display a success toast notification
   */
  success: (message: string) => {
    sonnerToast.success("Success", {
      description: message,
      duration: 4000,
    });
  },
  
  /**
   * Display an error toast notification
   */
  error: (message: string) => {
    sonnerToast.error("Error", {
      description: message,
      duration: 5000,
    });
  },
  
  /**
   * Display an informational toast notification
   */
  info: (message: string) => {
    sonnerToast.info("Info", {
      description: message,
      duration: 4000,
    });
  },
  
  /**
   * Display a warning toast notification
   */
  warning: (message: string) => {
    sonnerToast.warning("Warning", {
      description: message,
      duration: 5000,
    });
  },
  
  /**
   * Display a simple message toast with no icon
   */
  message: (message: string) => {
    sonnerToast(message, {
      duration: 3000,
    });
  },
  
  /**
   * Display a toast with a custom component or action
   */
  custom: (title: string, options?: any) => {
    sonnerToast(title, options);
  },
  
  /**
   * Display a toast with promise handling
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  }
};
