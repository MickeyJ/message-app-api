import socket from 'socket.io'
import timeListeners from './timeListeners'
import disconnectListeners from './disconnectListeners'
import { eventLog } from './helpers'

export default function createSocket(service){

    const io = socket(service.plugins.server);

    io.on('connection', (client) => {

        eventLog(client, 'Connected');
        console.log('clients count:', io.engine.clientsCount);

        /* Create Listeners
        * ------------------*/
        disconnectListeners(client);
        timeListeners(client);

    });

    return io
}


