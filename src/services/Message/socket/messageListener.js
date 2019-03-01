import { eventLog } from './helpers'

export default function messageListener(client, service){

    service.modules.events.on('send-message', (message) => {
        client.write(message);
    });

    client.on('message', (data) => {
        eventLog(client, 'Received Message ::', `"${data}"`);
    });

}