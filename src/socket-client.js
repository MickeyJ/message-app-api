import io from 'socket.io-client'

export default function(){

    const socket = io('http://10.0.0.7:3000');
    // const socket = io('http://localhost:3000');

    // console.log('Client', socket);

    socket.emit('test', 'test');

    // socket.on('connect', function () {
    //
    //     socket.send('hi');
    //
    //     socket.on('message', function (msg) {
    //         // my msg
    //         console.log('message', msg);
    //     });
    // });




    return socket;
}
