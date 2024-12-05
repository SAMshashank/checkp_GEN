// logger.ts



const log = require("node-file-logger");

const options = {
  folderPath: "./server/logs",
  dateBasedFileNaming: true,
  fileNamePrefix: "DailyLogs_",
  fileNameExtension: ".log",
  dateFormat: "YYYY_MM_D",
  timeFormat: "h:mm:ss A",
};

// Configure the logger with the options
log.SetUserOptions(options);

// Create a logger instance

// Export the configured logger instance
export const logger = log;
