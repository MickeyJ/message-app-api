import config from './config'
import moment from 'moment-timezone'
import DailyRotateFile from 'winston-daily-rotate-file'
import winston, {
    format,
    transports,
    createLogger,
} from 'winston'

const configure = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'orange',
        info: 'cyan',
        verbose: 'green',
    },
};

winston.addColors(configure.colors);

const time = () => {
    return moment().tz('America/Denver').format('hh:mm:ss');
};

export const errorTransport = new transports.File({
    level: 'error',
    filename: `./logs/error_${moment().format('YYYY-MM-DD')}.json`,
    json: true,
    colorize: false,
    maxsize: 10000000,
});

const consoleTransport = new transports.Console({
    colorize: true,
    format: format.combine(
        format.colorize(),
        format.printf(info => {
            return `${time()} - ${info.level}: ${info.message}`;
        })
    ),
});

const logger = createLogger({
    levels: configure.levels,
    exitOnError: false,
});

if (config.__DEV__) {

    logger.configure({
        transports: [
            consoleTransport,
            errorTransport,
        ],
    });

} else {

    logger.configure({
        format: format.json(),
        transports: [
            new DailyRotateFile({
                level: 'info',
                filename: './logs/access_%DATE%.json',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
            new DailyRotateFile({
                level: 'error',
                filename: './logs/error_%DATE%.json',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),

        ],
    });

}

export default logger
