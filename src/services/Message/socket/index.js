import socket from 'socket.io'

function createSocket(service){

    const {
        server,
        modules: {
            events,
        },
    } = service;

    const io = socket(server);

    // console.log('Server', io);

    io.on('connection', (socket) => {

        console.log('Connected to socket server');

        events.on('socket-test', () => {
            console.log('Emit socket test?');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected to socket server');
        })
    });

    return io
}

export default function(service){

    return createSocket(service);
}
