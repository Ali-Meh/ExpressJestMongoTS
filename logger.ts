import winston from 'winston'

export let logger=winston.createLogger({
    level:'debug',
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`;
        })
    )
})
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console());
}else{
    logger.add(new winston.transports.File({ filename: './logs/error.log', level: 'error' ,handleExceptions: true,maxsize: 5242880,maxFiles: 5 }));
    logger.add(new winston.transports.File({ filename: './logs/combined.log' ,handleExceptions: true,maxsize: 5242880,maxFiles: 5}));
}
export default logger;
