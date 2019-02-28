import net from 'net'

import uuidv4 from 'uuid/v4'

export default function socketServer(PORT, onData, getSocket){

    const HOST = 'localhost';

    const clients = {};

    function eventMessage(event){
        return `${event}`
    }

    function logClient(logs){
        console.log(`\n[socket-server] SERVER - ${HOST}:${PORT}\n=========================`);
        logs.forEach(log => {
            const data = log.data ? JSON.stringify(log.data, null, 2) : '';
            console.log(log.message, data);
        })
    }

    const socketServer = net.createServer((socket) => {

        socket.setEncoding('utf8');

        const clientID = uuidv4();

        clients[clientID] = {
            id: clientID,
            socket,
            logs: [],
        };

        const client = clients[clientID];

        socket.on('data', (data) =>{
            const DATA = JSON.parse(data.toString());

            client.logs.push({
                message: eventMessage('receive'),
                data: DATA,
            });

            onData(DATA, socket);
        });

        socket.on('close', () => {

            logClient(client.logs)
        });

        getSocket && getSocket(socket)
    });

    socketServer.listen(PORT, HOST);

    return socketServer;
}