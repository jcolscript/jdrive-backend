const expressWinston = require('express-winston');
const winston = require('winston');

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const myFormat = winston.format.printf(({ level, message, timestamp, meta }) => {
    return `\n[${timestamp}] ${level}: ${message}, ${JSON.stringify(meta)}`;
});

const logInOut = name => expressWinston.logger({
    format: winston.format.combine(
        winston.format.simple(), 
        winston.format.timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true,
            level: 'info',
            handleExceptions: true
        }),
        new winston.transports.File({
            name: name,
            filename: name,
            level: 'debug',
            maxsize: 5242880,
            maxFiles: 10,
            json: true,
            colorize: true
        })
    ]
})

module.exports = { logInOut } 