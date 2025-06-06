
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`🔍 DEBUG: ${message}`, context || '');
    }
  }

  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`ℹ️ INFO: ${message}`, context || '');
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.warn(`⚠️ WARN: ${message}`, context || '');
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    // Always log errors, but sanitize in production
    const sanitizedMessage = this.isDevelopment ? message : this.sanitizeErrorMessage(message);
    console.error(`🚨 ERROR: ${sanitizedMessage}`, this.isDevelopment ? error : '', context || '');
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove potentially sensitive information from error messages
    return message
      .replace(/uuid:\s*[0-9a-f-]{36}/gi, 'uuid: [REDACTED]')
      .replace(/password.*$/gi, 'password: [REDACTED]')
      .replace(/token.*$/gi, 'token: [REDACTED]')
      .replace(/key.*$/gi, 'key: [REDACTED]');
  }
}

export const logger = new Logger();
