import io from 'socket.io-client'

export default function createSocketClient(){

    const socket = io('http://10.0.0.7:3000');


    socket.on('connect', function () {

        console.log('User Connected');

        // socket.send('hi');

        socket.on('test', function (msg) {
            console.log('test message', msg);
        });
    });




    // return socket;
}
