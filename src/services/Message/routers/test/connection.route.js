export default function(config){
    return function(){

        const {
            // plugins,
            // getServer,
            // SERVER,
            modules,
        } = this;

        console.log('socket', modules.socket);

        // createSocket

        return {
            ...config,
            handler: (req, res) => {

                // const server = getServer();
                // console.log('SERVER', this.SERVER);
                //
                // // console.log(server);
                //
                // plugins.createSocket({
                //     server,
                // });

                res.status(200).send({
                    message: 'Connection Success',
                });

            },
        }
    }
}
