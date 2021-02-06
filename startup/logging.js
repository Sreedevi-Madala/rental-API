// should log the uncaughtException and unhandledRejection and exit the process,
// because the process may be in an unclean state
// In production, use a process manager to automatically restart a Node process.

const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

require('winston-mongodb')
require('express-async-errors');

module.exports = function () {

    const env = process.env.NODE_ENV || 'development';
    const logDir = 'log';

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const filename = path.join(logDir, 'results.log');
    const fileException = path.join(logDir, 'exceptions.log');

    const logger = createLogger({
        level: env === 'development' ? 'debug' : 'info',
        format: format.combine(format.colorize(),
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            // format.json()
        ),
        transports: [
            new transports.Console({
                level: 'verbose',
                format: format.combine(
                    format.colorize(),
                    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
                    // format.json()
                )
            }),
            new transports.File({ filename })
        ],
        exceptionHandlers: [
            new transports.File({
                filename: fileException,
            })
          ]
    });

    process.on('uncaughtException', (ex) => {
       console.log('we got an uncaughtException');
       logger.error(ex.message, ex)
       // process.exit(1)
    })

    process.on('unhandledRejection', (ex) => {
       console.log('we got an unhandled rejection');
       logger.error(ex.message, ex)
       // process.exit(1)
    })
}
