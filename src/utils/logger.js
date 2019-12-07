const {createLogger, format, transports} = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `\n[${timestamp}] ${level}: ${message}`;
});

module.exports = createLogger({
    format: format.combine(
        format.simple(), 
        format.timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 6,
            filename: `${__dirname}/../../log-api.log`,
        }),
        new transports.Console({
            level: 'debug',
        })
    ]
})