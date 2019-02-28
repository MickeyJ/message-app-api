#!/usr/bin/env node

import './errors'
import 'source-map-support/register'
import debug from 'debug'
import http from 'http'
import createAPI from './api'

import {
    PORT,
    NODE_ENV,
    API_NAME,
} from './config'

debug('latitude-gr-api:api');

const port = normalizePort(process.env.PORT || PORT);

const server = createAPI(port, http.createServer);

server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

export default server

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

function onError(error) {
    console.log('http error', error);
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    console.dataLog(`Running ${API_NAME}`, {
        port: addr.port,
        environment: NODE_ENV,
    });

    debug('Listening on ' + bind);
}
