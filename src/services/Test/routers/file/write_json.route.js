import faker from 'faker'
import uuid from 'uuid/v1'

export default function(config){
    return function(){

        const {
            PATHS,
            plugins,
            modules,
        } = this;

        return {
            ...config,
            middleware: modules.middleware.checkParams(config.queryKeys, 'query'),
            handler: (req, res) => {

                const {
                    filename,
                } = req.query;

                const data = [
                    {
                        id: uuid(),
                        firstName: faker.name.firstName(),
                        username: faker.internet.userName(),
                    },
                ];

                // const data = {
                //     [uuid()]: faker.name.firstName(),
                // };

                plugins.writeJson(filename, PATHS.tmp, data, false)
                    .then(success => {
                        res.status(201).send({
                            ...success,
                            content: JSON.parse(success.content),
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        res.status(400).send(e);
                    });

            },
        }
    }
}
