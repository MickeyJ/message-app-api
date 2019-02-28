
export default function(config){
    return function(){

        return {
            ...config,
            handler: (req, res, next) => {

                const output = {};

                const usage = process.memoryUsage();

                for (let key in usage) {
                    output[key] = `${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`;
                }

                const leakData = req.leakData || {};

                res.status(200).send({
                    totalReqTime: this.plugins.calculateReqTime(req.startTime),
                    memoryInfo: output,
                    ...leakData,
                })
            },
        }
    }
}
