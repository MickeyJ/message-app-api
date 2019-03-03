import { eventLog } from './helpers'

export default function disconnectListeners(client, service, chat){

    client.on('disconnect', () => {
        eventLog(client, 'Disconnect');
        removeClientUser();
        client.removeAllListeners();
        client.disconnect(true);
    });

    client.on('force:disconnect', function(){
        eventLog(client, 'Disconnect FORCED');
        removeClientUser();
        client.removeAllListeners();
        client.disconnect(true);
    });

    function removeClientUser(){
        Object.keys(chat.users).map(userID => {
            const user = chat.users[userID];
            if(user.client_id === client.id){
                delete chat.users[userID]
            }
        });
    }

}