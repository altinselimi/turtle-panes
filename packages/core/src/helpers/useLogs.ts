export const useLogs = (): {
  logInfo: (...args: any[]) => void;
  logWarning: (...args: any[]) => void;
  logError: (...args: any[]) => void;
} => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    return {
      logInfo: () => {},
      logWarning: () => {},
      logError: () => {},
    };
  }

  return {
    logInfo: (...args) => {
      console.log(...args);
    },
    logWarning: (...args) => {
      console.warn(...args);
    },
    logError: (...args) => {
      console.error(...args);
    },
  };
};
