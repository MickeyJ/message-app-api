import isObject from 'lodash/isObject'

class ApiError extends Error {
    constructor(e, status = 400, data = {}){
        const error = parseError(e);
        super(error.message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
        captureStack(this, error.stack);
    }
}


global.ApiError = ApiError;

function parseError(e){
    if(!e){
        return new Error('Unknown Error');
    }
    if(typeof e === 'string'){
        return new Error(e);
    }
    if(isObject(e)){
        const error = new Error(e.message || 'Unknown Error');
        copyData(error, e);
        return error
    }
    if(!(e instanceof Error)){
        const error = new Error('Unknown Error');
        error.data = e;
        return error;
    }
    return e
}

function captureStack(instance, stack){
    if(Error.captureStackTrace){
        Error.captureStackTrace(instance, ApiError);
    }
    const stackItems = stack.split('\n');
    stackItems.shift();
    instance.stack += `\n${stackItems.join('\n')}`;
}

function copyData(instance, errorData){
    const cleanData = JSON.parse(cleanCircularData(errorData));
    Object.keys(cleanData).map(key => {
        instance[key] = cleanData[key];
    })
}

function cleanCircularData(o){

    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    let cache = [];
    return JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });

    // cache = null; // Enable garbage collection

}