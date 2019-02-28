// http://10.0.0.7:3000


export default function(config){
    return function(){

        const {

            modules: {
                socket: { io },
                events,
            },
        } = this;

        // const socket = io('')
        //
        // socket.on('connect', function () {
        //
        //     socket.send('hi');
        //
        //     socket.on('message', function (msg) {
        //         // my msg
        //         console.log('message', msg);
        //     });
        // });

        return {
            ...config,
            handler: (req, res) => {

                events.emit('socket-test', {
                    message: 'Hello',
                });


                res.status(200).send({
                    message: 'Connection Success',
                });

            },
        }
    }
}
