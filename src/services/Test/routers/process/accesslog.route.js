
export default function(config){
    return function(){

        const {
            PATHS,
            plugins: {
                readFile,
                readDir,
            },
        } = this;

        return {
            ...config,
            handler: (req, res, next) => {

                if(!req.query.filename){
                    const self = this.getRoute('test.process.accesslog');

                    return readDir(PATHS.logs)
                        .then(files => {

                            const accessFileLinks = (
                                files
                                    .filter(filename => filename.indexOf('access') === 0)
                                    .map(filename => self.address + `?filename=${filename}`)
                            );

                            res.status(200).send(accessFileLinks)
                        })
                        .catch(e => {
                            e.status = 400;
                            next(e);
                        })
                }

                const filePath = `${PATHS.logs}/${req.query.filename}`;

                readFile(filePath)
                    .then(content => {

                        const logs = [];

                        content.split('\n').forEach(accessLog => {

                            if(!accessLog) return;

                            let logData;
                            try{
                                logData = JSON.parse(accessLog)
                            } catch(e){
                                console.log(e);
                                console.log('accessLog:', accessLog);
                                throw e
                            }

                            if(logData){
                                if(logData.level === 'error') return;
                                if(logData.req && shouldIgnoreLog(logData.req)) return;
                                logs.push(logData);
                            }

                        });

                        res.status(200).send(logs);
                    })
                    .catch(e => {
                        e.status = 400;
                        next(e);
                    });

            },
        }
    }
}

function shouldIgnoreLog(req){
    const {
        url,
        headers,
    } = req;
    const isFaviconRequest = url === '/favicon.ico';
    const isEC2HealthCheck = headers['user-agent'].indexOf('ELB-HealthChecker') > -1;
    return (
        isFaviconRequest
        || isEC2HealthCheck
    )
}
