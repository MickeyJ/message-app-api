
export function isString(s) {
    return typeof s === 'string' || s instanceof String;
}

export function isNumber(n) {
    return typeof n === 'number' || n instanceof Number;
}

export function isBool(b) {
    return typeof b === 'boolean' || b instanceof Boolean;
}

export function isFunction(f) {
    const getType = {};
    return f && getType.toString.call(f) === '[object Function]';
}

export function isObject(o) {
    if (o === null) { return false;}
    return ( (typeof o === 'function') || (typeof o === 'object') );
}

export function isArray(a) {
    return Array.isArray(a);
}
