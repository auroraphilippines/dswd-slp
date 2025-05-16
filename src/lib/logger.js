// Logger utility for handling console logs and data safety

const isDevelopment = process.env.NODE_ENV === 'development';

// Function to safely stringify objects without exposing sensitive data
const safeStringify = (obj) => {
  try {
    // Remove sensitive fields
    const sanitizedObj = { ...obj };
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'key', 'auth'];
    
    Object.keys(sanitizedObj).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitizedObj[key] = '[REDACTED]';
      }
      if (typeof sanitizedObj[key] === 'object' && sanitizedObj[key] !== null) {
        sanitizedObj[key] = safeStringify(sanitizedObj[key]);
      }
    });
    
    return JSON.stringify(sanitizedObj, null, 2);
  } catch (error) {
    return '[Error stringifying object]';
  }
};

// Custom logger class
class Logger {
  static log(...args) {
    if (process.env.NODE_ENV !== "production") {
      // console.log(...args); // <-- comment this out to suppress
    }
  }
  static error(...args) {
    if (process.env.NODE_ENV !== "production") {
      // console.error(...args);
    }
  }
  static warn(...args) {
    if (process.env.NODE_ENV !== "production") {
      // console.warn(...args);
    }
  }
  static info() {}
  static debug() {}
}

// Override console methods in production
if (!isDevelopment) {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  // Keep console.error for critical errors
}

export default Logger; 