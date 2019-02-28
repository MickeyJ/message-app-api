import socket from 'socket.io'

export default function(server){

    const io = socket(server);

    io.on('connection', (socket) => {
        console.log('socket:', socket);
    });


    return io;
}