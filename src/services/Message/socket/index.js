import http from 'http'
import socket from 'socket.io'

function createServer(PORT){

    const server = http.createServer((req, res) => {

        res.writeHead(200, { 'Context-Type': 'text/plain' });
        res.write('Connection Success');
        res.end();

        if(!req.headers['referer']) return;

        console.log('Request...');

    });

    /* do something when app is closing */
    process.on('exit', () => {
        console.log('exit');
        server.close();
    });

    /* catches ctrl+c event */
    process.on('SIGINT', () => {
        console.log('SIGINT');
        server.close();
    });

    server.listen(PORT);

    return server;
}

function createSocket(service){

    const {
        server,
        modules: {
            events,
        },
    } = service;

    const io = socket(server);

    io.on('connection', (socket) => {
        console.log('socket:', socket);

        events.on('socket-test', () => {
            console.log('Emit socket test?');
        });

    });

    return io
}

export default function(service){

    // const {
    //     PORT = 3001,
    //     server = createServer(PORT),
    // } = options;


    const io = createSocket(service);

    return {
        io,
    };
}