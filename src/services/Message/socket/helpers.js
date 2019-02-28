
export function eventLog(client, event, data){
    console.log(`\nClient [${client.id}] :: ${event}`, data || '');
}