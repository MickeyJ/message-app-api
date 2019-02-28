import net from 'net'

export default function socketClient(port, data){
    const HOST = 'localhost';
    const PORT = port;
    const DATA = JSON.stringify(data);
    const logs = [];

    function eventMessage(event){
        return `${event}`
    }

    function logClient(logs){
        console.log(`\n\n[socket-connection] CLIENT - ${HOST}:${PORT}\n=========================`);
        logs.forEach(log => {
            const data = log.data ? JSON.stringify(log.data, null, 2) : '';
            console.log(log.message, data);
        })
    }

    const client = new net.Socket();

    client.connect(PORT, HOST, () => {
        logs.push({
            message: eventMessage('send'),
            data,
        });
        client.write(DATA);
    });

    client.on('data', (data) => {
        const message = data.toString();

        logs.push({
            message: eventMessage(`received: ${message}`),
        });

        client.destroy();
    });

    client.on('close', (data) => {

        logs.push({
            message: eventMessage('CLOSED'),
            data,
        });

        logClient(logs);

    });

}
