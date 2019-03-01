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

                events.emit('send-message', 'Hello, client.');

                res.status(200).send({
                    message: 'Connection Success',
                });

            },
        }
    }
}
