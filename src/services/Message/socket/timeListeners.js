import { eventLog } from './helpers'

export default function timeListeners(client){

    client.on('subscribe.time', (data) => {
        eventLog(client, 'Subscribe Time', data);
        setInterval(() => {
            const time = new Date().toISOString();
            client.emit('send.time', time);
        }, 1000)
    });

}