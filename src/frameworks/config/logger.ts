import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info', // Log only if info level or higher
  format: winston.format.json(), // Output logs in JSON format
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
    new winston.transports.Console() // Log to the console
  ],
});

export default logger;
