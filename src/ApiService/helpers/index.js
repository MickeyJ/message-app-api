import _ from 'lodash'
import required from './required'

import {
    isString,
    isBool,
    isFunction,
} from '~/common/plugins/type_check'

export const requestTypeList = ['get','head','put','patch','post','delete'];

export defaultPlugins from './default_plugins'

/**
 *  Throw Custom Service Error
 *  @param errorType : Function error constructor
 *  @param message : String Error constructor
 */
export function throwError(errorType, message){
    const error = new errorType(message);
    delete error.stack;
    throw error;
}

export function iterateObj(obj, cb){
    for(let key in obj){
        if(!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        cb(key, value)
    }
}

export function validServiceArgument(arg) {
    return (
        arg
        || arg !== undefined
        || _.size(arg)
    )
}

export function missingDescriptors(descriptors){
    const missingDescriptor = [];
    required.descriptors.forEach(descriptor => {
        if(!descriptors[descriptor]){
            missingDescriptor.push(descriptor)
        }
    });
    return missingDescriptor.length ? missingDescriptor : false;
}

export function validateRoute(routerName, routeName, route){

    const {
        open,
        type,
        handler,
    } = route;

    if(open === undefined) {
        throwError(Error, `Missing Required Route Property 'open'
        \nRouter: ${routerName}\nRoute: ${routeName}\n
      `);
    } else if(!isBool(open)) {
        throwError(TypeError, `'open' Requires Boolean Value
        \nRouter: ${routerName}\nRoute: ${routeName}\n
      `);
    }

    if(type === undefined) {
        throwError(Error, `Missing Required Route Property 'type'
        \nRouter: ${routerName}\nRoute: ${routeName}\n
      `);
    } else if(!isString(type)) {
        throwError(TypeError, `'type' Requires String Value
          \n-> \nRouter: ${routerName}\nRoute: ${routeName}\n
      `);
    } else {

        const validRequestType = requestTypeList.find(requestType => type.toLowerCase() === requestType);

        if(!validRequestType || validRequestType === undefined) {
            throwError(TypeError, `Invalid Request Type: '${type}'
          \nRouter: ${routerName}.js\nRoute: ${routeName}\nUse -> ${requestTypeList}
       `);
        }

    }

    if(handler === undefined) {
        throwError(Error, `Missing Required Route Property 'handler'
        \nRouter: ${routerName}\nRoute: ${routeName}
      `);
    } else if(!isFunction(handler)) {
        throwError(TypeError, `'handler' Must Be Type Function
        \nRouter: ${routerName}\nRoute: ${routeName}
      `);
    }

}
