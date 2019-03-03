import { eventLog } from './helpers'

export default function chatListeners(client, service, chat){

    client.on('chat.subscribe', (userData) => {

        eventLog(client, 'Chat Subscribe', userData);

        const user = chat.users[userData.id] = {
            id: userData.id,
            client_id: client.id,
            name: userData.name,
            joined_at: userData.joined_at || new Date(),
        };

        const subscribeData = {
            ...chat,
            user,
        };

        client.emit('chat.subscribed', subscribeData);
        client.broadcast.emit('chat.subscribed', subscribeData);
        client.emit('chat.messaged', chat.messages);
        client.broadcast.emit('chat.messaged', chat.messages);

    });

    client.on('chat.message', (data) => {
        eventLog(client, 'Chat Message', data);

        const messages = chat.messages = [
            ...chat.messages,
            data,
        ];
        client.emit('chat.messaged', messages);
        client.broadcast.emit('chat.messaged', messages);
    });

}

