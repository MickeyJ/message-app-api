import socket from 'socket.io'
import chatListeners from './chatListeners'
import messageListener from './messageListener'
import disconnectListeners from './disconnectListeners'
import { eventLog } from './helpers'

export default function createSocket(service){

    const io = socket(service.plugins.server);

    const chat = {
        users: {
            /* Room user */
            [-1]: {
                id: -1,
                client_id: -1,
                name: '*',
                joined_at: new Date(),
            },
        },
        messages: [],
    };

    io.on('connection', (client) => {

        eventLog(client, 'Connected');
        console.log('clients count:', io.engine.clientsCount);

        /* Create Listeners
        * ------------------*/
        disconnectListeners(client, service, chat);
        messageListener(client, service);
        chatListeners(client, service, chat);

    });

    return io
}


