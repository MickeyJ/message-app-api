import { eventLog } from './helpers'

export default function colorListeners(client){

    const colors = [
        '#ff1300',
        '#ff5800', // extra
        '#ff7700',
        '#ffb200', // extra
        '#ffd700',
        '#fff800', // extra
        '#dfff02',
        '#93ff00', // extra
        '#0eff00',
        '#00ff7f', // extra
        '#00ffe1',
        '#00a7ff', // extra
        '#0064ff',
        '#000bff', // extra
        '#4100ff',
        '#7900ff', // extra
        '#b900ff',
        '#ff00d8', // extra
        '#ff004d',
    ];


    let colorIndex = 0;

    function getNextColor(){
        if(colorIndex === colors.length - 1){
            colorIndex = 0;
        } else {
            colorIndex++;
        }
        return colors[colorIndex];
    }

    client.on('subscribe.color', (data) => {
        eventLog(client, 'Subscribe Color', data);
        setInterval(() => {
            // const time = new Date().toISOString();
            client.emit('send.color', getNextColor());
        }, 100)
    });

}