const winston = require('winston');
const path = require('path');

// Define o formato padrão dos logs
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Cria o logger com saída para console e arquivo
const logger = winston.createLogger({
  level: 'info', // Níveis possíveis: error, warn, info, http, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console: útil em desenvolvimento
    new winston.transports.Console(),
    // Arquivo: útil para análise posterior
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'storage', 'logs', 'app.log'),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
  exitOnError: false,
});

module.exports = logger;
