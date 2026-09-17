import winston from 'winston';
import fs from 'fs';

// The logs/ directory is gitignored, so it won't exist on a fresh clone
// (e.g. Render's build) — winston throws if it can't open its file transports.
// Create it up front and degrade to console-only logging if the FS is read-only.
try {
  fs.mkdirSync('logs', { recursive: true });
} catch {
  // ignore — file transports will fail silently rather than crash the process
}

const { combine, timestamp, colorize, printf, errors } = winston.format;


const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Never let a failing file transport (e.g. read-only disk) crash the process.
logger.on('error', () => {});
