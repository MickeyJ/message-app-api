import path from 'path'
import moment from 'moment-timezone'
import express from 'express'
import expressWinston from 'express-winston'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import reactViews from 'express-react-views'

import config from './config'
import logger from './logger'
import router from './router'

export default function createAPI(port, createServer){

    const api = express();

    const server = createServer(api);
    server.listen(port);

    if (config.__DEV__) {

        if(process.env.NODE_ENV.indexOf('test') === -1){
            api.use(expressWinston.logger({
                winstonInstance: logger,
                expressFormat: true,
                colorize: true,
                ignoreRoute,
            }));
        }

        applyGeneralMiddleware(api);
        router(api, logger, server);

    } else {

        // const bugsnag = require('bugsnag');
        // bugsnag.register('0c94c60d321fba29a039013459fbb75a');
        // api.use(bugsnag.requestHandler);

        api.use(expressWinston.logger({
            winstonInstance: logger,
            meta: true,
            expressFormat: true,
            colorize: false,
            ignoreRoute,
        }));

        applyGeneralMiddleware(api);
        router(api, logger, server);

        // api.use(bugsnag.errorHandler);
    }

    api.use((req, res, next) =>{
        const err = new Error(`Not Found: "${req.url}"`);
        err.status = 404;
        next(err);
    });

    api.use((error, req, res, next) => {

        const timestamp = moment().tz('America/Denver').format('MM/DD/YYYY hh:mm:ss');

        if(typeof error === 'string'){
            logger.error({
                timestamp,
                message: error,
            });
            return res.status(500).send({ error });
        }

        const errorData = {
            timestamp,
            message: error.message,
            ...error,
            stack: (
                error.stack
                    ? error.stack.split('\n').map(line => line.trim())
                    : undefined
            ),
        };

        logger.error(errorData);
        console.log(JSON.stringify(errorData, null, 2));
        res.status(error.status || error.statusCode || 500);
        res.send(errorData);

        /* send error as html */
        // res.render('error', {
        //     error,
        //     message: error.message,
        //     title: 'Api Error',
        // })
    });

    return server;
}



// require('./find_leak');

// export default api;

function applyGeneralMiddleware(instance){
    instance.use(cors());
    instance.use(compression());
    instance.use(bodyParser.json({limit: '200mb'}) );
    instance.use(bodyParser.urlencoded({
        limit: '200mb',
        extended: true,
        parameterLimit: 50000,
    }));
    instance.use(express.static(path.join(__dirname, '../public')));
    instance.set('views', path.join(__dirname, '../views'));
    instance.set('view engine', 'jsx');
    instance.engine('jsx', reactViews.createEngine({ beautify: true}));
}

function ignoreRoute(req){
    if(req.url === '/favicon.ico'){
        return true;
    }
    return false;
}
