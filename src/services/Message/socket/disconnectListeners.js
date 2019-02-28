import { eventLog } from './helpers'

export default function disconnectListeners(client){

    client.on('disconnect', () => {
        eventLog(client, 'Disconnect');
        client.removeAllListeners();
        client.disconnect(true);
    });

    client.on('force:disconnect', function(){
        eventLog(client, 'Disconnect FORCED');
        client.removeAllListeners();
        client.disconnect(true);
    });

}