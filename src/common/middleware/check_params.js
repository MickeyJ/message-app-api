

export default function checkParams(routeParameters, parameterType){
    return function(req, res, next){

        const parameters = req[parameterType];

        if(!parameters){
            const error = new Error(`req.${parameterType} does not exist`);
            error.status = 400;
            return next(error)
        }

        const missingParameters = [];

        routeParameters.forEach(parameter => {
            const isRequired = parameter.indexOf('*') > -1;
            if(isRequired){
                const parameterKey = parameter.replace('*', '');
                if(!parameters[parameterKey]){
                    missingParameters.push(parameterKey);
                }
            }
        });

        if(missingParameters.length){
            return res.status(400).send({
                error: `missing required data from 'req.${parameterType}'`,
                missingData: missingParameters,
            })
        }

        next();
    }
}
