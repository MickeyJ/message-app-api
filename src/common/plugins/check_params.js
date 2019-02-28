
export default function(routeParameters, parameters){
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
    return missingParameters;
}