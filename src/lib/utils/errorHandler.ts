
import { toast } from 'sonner';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info', 
  WARN = 'warn',
  ERROR = 'error'
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  public readonly level: LogLevel;
  public readonly context: ErrorContext;
  public readonly timestamp: Date;

  constructor(
    message: string,
    level: LogLevel = LogLevel.ERROR,
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.level = level;
    this.context = context;
    this.timestamp = new Date();
  }
}

export const errorHandler = {
  log: (error: Error | AppError, context: ErrorContext = {}) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      level: error instanceof AppError ? error.level : LogLevel.ERROR
    };

    // Log to console with proper formatting
    console.group(`🚨 ${errorData.level.toUpperCase()}: ${error.message}`);
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Timestamp:', errorData.timestamp);
    console.groupEnd();

    // Show user-friendly toast for errors
    if (errorData.level === LogLevel.ERROR) {
      toast.error(errorHandler.getUserFriendlyMessage(error.message));
    } else if (errorData.level === LogLevel.WARN) {
      toast.warning(errorHandler.getUserFriendlyMessage(error.message));
    }
  },

  getUserFriendlyMessage: (originalMessage: string): string => {
    const errorMap: Record<string, string> = {
      'invalid input syntax for type uuid': 'Invalid data format. Please try again.',
      'Project name is required': 'Please enter a project name.',
      'User not authenticated': 'Please log in to continue.',
      'Failed to create': 'Unable to save. Please check your connection and try again.',
      'Network Error': 'Connection problem. Please check your internet and try again.',
      '[object Object]': 'An unexpected error occurred. Please try again.'
    };

    for (const [key, message] of Object.entries(errorMap)) {
      if (originalMessage.includes(key)) {
        return message;
      }
    }

    return 'Something went wrong. Please try again.';
  },

  handleApiError: (error: any, context: ErrorContext = {}) => {
    let message = 'An unexpected error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error?.error?.message) {
      message = error.error.message;
    }

    const appError = new AppError(message, LogLevel.ERROR, context);
    errorHandler.log(appError, context);
    throw appError;
  },

  handleSuccess: (message: string, description?: string) => {
    console.log(`✅ SUCCESS: ${message}`);
    const toastOptions = description ? { description } : undefined;
    toast.success(message, toastOptions);
  },

  handleInfo: (message: string, context: ErrorContext = {}) => {
    console.log(`ℹ️ INFO: ${message}`, context);
  }
};
