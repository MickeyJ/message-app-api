// http://10.0.0.7:3000

export default function(config){
    return function(){

        const {

            modules: {
                // socket,
                events,
            },
        } = this;

        return {
            ...config,
            handler: (req, res) => {



                // socket.sockets.emit('hi', 'everyone');


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
