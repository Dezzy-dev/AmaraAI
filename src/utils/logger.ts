/**
 * Logging utility that only logs in development mode
 * This prevents debug messages from appearing in production console
 */

interface Logger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const createLogger = (): Logger => {
  const isDevelopment = import.meta.env.DEV;

  return {
    log: (...args: any[]) => {
      if (isDevelopment) {
        console.log(...args);
      }
    },
    warn: (...args: any[]) => {
      if (isDevelopment) {
        console.warn(...args);
      }
    },
    error: (...args: any[]) => {
      // Always log errors, even in production
      console.error(...args);
    },
    info: (...args: any[]) => {
      if (isDevelopment) {
        console.info(...args);
      }
    },
    debug: (...args: any[]) => {
      if (isDevelopment) {
        console.debug(...args);
      }
    }
  };
};

export const logger = createLogger();