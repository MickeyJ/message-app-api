export default function(config){
    return function(){

        const {
            PATHS,
            modules,
            plugins,
        } = this;

        return {
            ...config,
            middleware: modules.middleware.checkParams(config.queryKeys, 'query'),
            handler: (req, res) => {

                const {
                    filename,
                } = req.query;

                if(!filename){
                    return res.status(400).send({
                        message: 'missing required query "filename"',
                    })
                }

                const filePath = `${PATHS.tmp}/${filename}`;

                plugins.readFile(filePath)
                    .then(content => {
                        res.status(200).send(content);
                    })
                    .catch(e => {
                        res.status(400).send(e);
                    });

            },
        }
    }
}
