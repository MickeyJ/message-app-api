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
            handler: (req, res, next) => {

                const {
                    filename,
                } = req.query;

                if(!filename){
                    return res.status(400).send({
                        message: 'missing required query "filename"',
                    })
                }

                try {
                    plugins.deleteFile(`${PATHS.tmp}/${filename}`);
                } catch (e) {
                    plugins.handleError(next, 400, { filename })(e);
                    return;
                }

                res.status(200).send({
                    message: `file ${filename} deleted`,
                });

            },
        }
    }
}
