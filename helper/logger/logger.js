var winston = require('winston')
require('winston-daily-rotate-file')

// var configJSON = require(__base + 'config/config')
// var configObj = configJSON.getEnvObject()

const fs = require('fs')
const logDir =  'log'
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}


var transport = new (winston.transports.DailyRotateFile)({
  filename: `${logDir}/log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

transport.on('rotate', function(oldFilename, newFilename) {
  // do something fun
});

var logger = winston.createLogger({
  transports: [
    transport,
    new (winston.transports.Console)({
      colorize: true,
      level: 'error'
    })
  ]
});



module.exports = logger
