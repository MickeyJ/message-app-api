
export default function(config){
    return function(){

        const {
            PATHS,
            plugins: {
                readDir,
                readFile,
            },
        } = this;

        return {
            ...config,
            handler: (req, res, next) => {

                if(!req.query.filename){
                    const self = this.getRoute('test.process.errorlog');

                    return readDir(PATHS.logs)
                        .then(files => {

                            const errorFileLinks = (
                                files
                                    .filter(filename => filename.indexOf('error') === 0)
                                    .map(filename => self.address + `?filename=${filename}`)
                            );

                            res.status(200).send(errorFileLinks)
                        })
                        .catch(e => {
                            e.status = 400;
                            next(e);
                        })
                }



                const filePath = `${PATHS.logs}/${req.query.filename}`;

                readFile(filePath)
                    .then(content => {

                        const errors = [];

                        content.split('\n').forEach(errorLog => {
                            if(errorLog){
                                errors.push(JSON.parse(errorLog));
                            }
                        });

                        res.status(200).send(errors);
                    })
                    .catch(e => {
                        res.status(400).send(e);
                    });

            },
        }
    }
}
