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
                    content = 'hello',
                } = req.query;

                const filePath = `${PATHS.tmp}/${filename}`;

                plugins.writeFile(filePath, content)
                    .then(success => {
                        res.status(201).send(success);
                    })
                    .catch(e => {
                        res.status(400).send(e);
                    });

            },
        }
    }
}
