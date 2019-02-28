import url from 'url'
import size from 'lodash/size'
import config from '../config'
import { Router } from 'express'

import {
    throwError,
    defaultPlugins,
    iterateObj,
    validServiceArgument,
    missingDescriptors,
    validateRoute,
} from './helpers'

const {
    typeCheck: {
        isString,
        isNumber,
        isBool,
        isFunction,
        isArray,
    },
} = defaultPlugins;

const routeDefaults = {
    bodyKeys: [],
    queryKeys: [],
    paramKeys: [],
};

export default class ApiService {

    PATHS = config.PATHS;
    _config = config;
    _logger = null;

    get config(){
        return this._config;
    }

    get serviceURI() {
        return `/${this.name}`
    }

    get plugins() {
        return this._plugins
    }

    get modules() {
        return this._modules
    }

    get router() {
        return this._router
    }

    get routers() {
        return this._routers
    }

    get routeMap() {
        return this._routeMap
    }

    get service() {
        return this
    }

    get getRoute(){
        return this._getRoute;
    }

    get getService() {
        return this._getService;
    }

    set getService(fn) {
        this._getService = fn;
    }

    get logger(){
        return this._logger
    }

    set logger(value){
        this._logger = value
    }

    fullUrlWithPath = (path) => url.resolve(this.domain, path);

    /**
     * ApiService Constructor
     * @param descriptors : Object - general information
     * @param plugins : Object - npm packages needed
     * @param modules : Object - custom modules that need access to the rest of the service
     * @param routers : Object - api (express) routers
     */
    constructor({descriptors, plugins, modules, routers}) {

        this._plugins = {};
        this._modules = {};
        this._routers = {};
        this._routeMap = {};
        this._router = {};

        this._applyDescriptors(descriptors);
        this._applyPlugins({
            ...defaultPlugins,
            ...plugins,
        });
        this._applyModules(modules);

        this._router = Router();
        this._applyRouters(routers);
        this._setRouteMap();
    }

    _applyDescriptors = (descriptors) => {
        if (!validServiceArgument(descriptors)) return;

        const isMissingDescriptors = missingDescriptors(descriptors);

        if (isMissingDescriptors) {
            const missingDescriptorString = isMissingDescriptors.join(', ');
            throwError(
                Error,
                `the following api service descriptors are required and missing...\n${missingDescriptorString}`
            )
        }

        iterateObj(descriptors, (descriptorName, descriptor) => {
            if (isString(descriptor) || isNumber(descriptor) || isBool(descriptor)) {
                this[descriptorName] = descriptor
            } else {
                throwError(
                    TypeError,
                    `descriptor '${descriptorName}' must be a string, number, or boolean`
                )
            }
        });
    };

    _applyPlugins = (plugins) => {
        if (!size(plugins)) return;
        if (!validServiceArgument(plugins)) {
            throwError(Error, 'Invalid Service Argument : plugins ' + this.name)
        }
        iterateObj(plugins, (pluginName, plugin) => {
            if (plugin === undefined) {
                throwError(TypeError, 'Undefined plugin : ' + pluginName)
            }
        });
        this._plugins = plugins
    };

    _applyModules = (modules) => {
        if (!size(modules)) return;
        if (!validServiceArgument(modules)) {
            throwError(Error, 'Invalid Service Argument : modules ' + this.name);
        }
        iterateObj(modules, (moduleName, module) => {
            if (!isFunction(module)) {
                throwError(TypeError, this.name + ' - Each module must be a function')
            }
            this._modules[moduleName] = module(this);
        });
    };

    _applyRouters = (routers) => {

        if (!size(routers)) {
            throwError(Error, 'Invalid Service Argument : routers ' + this.name)
        }

        console.log(`\n${this.fullName} routes`);

        iterateObj(routers, (routerName, router) => {

            console.log(`${routerName.toUpperCase()}:`);

            // must be an array of routes/endpoints
            if (!isArray(router)) {
                throwError(TypeError, this.name + ' - Each router must be an array : ' + routerName)
            }

            const subRouter = Router();
            const routes = new Map();

            router.map(r => {
                const route = r.bind(this)();

                const {
                    uri,
                    name,
                    open,
                    type,
                    middleware = [],
                    handler,
                } = route;

                if (!open) return;

                if (routes.get(name)) {
                    const duplicateError = new Error(
                        `Duplicate route ${routerName}.${name} in ${this.fullName}`
                    );
                    throw(duplicateError);
                }

                validateRoute(routerName, name, route);

                console.log(' •', name);

                const requestType = type.toLowerCase();
                const routeEndpoint = `/${uri || name}`;
                const routeURI = `/${routerName}${routeEndpoint}`.trim();
                const fullPath = this.serviceURI + routeURI;
                const address = this.fullUrlWithPath(fullPath);

                // add route to express router
                subRouter[requestType](routeEndpoint, setReqTimeStart, middleware, handler);

                // grab each layer so we can play with it later
                const lastStackIndex = subRouter.stack.length - 1;
                const layer = {...subRouter.stack[lastStackIndex]};

                routes.set(name, {
                    ...routeDefaults,
                    ...route,
                    routeURI,
                    fullPath,
                    address,
                    type: type.toLowerCase(),
                    handle: layer.handle,
                });

            });

            this.router.use(`/${routerName}`, subRouter);

            const lastStackIndex = this.router.stack.length - 1;
            const layer = this.router.stack[lastStackIndex];

            this.routers[routerName] = {
                router: subRouter,
                routes,
                layer,
            };
        });

    };

    _setRouteMap = () => {

        for (let key in this.routers) {
            if (!this.routers.hasOwnProperty(key)) continue;

            const {
                router,
                routes,
            } = this.routers[key];

            const routerKey = `/${key}`;

            const routerPath = this.serviceURI + routerKey;
            const routerAddress = this.fullUrlWithPath(routerPath);

            this._routeMap[routerKey] = {
                'route details': routerAddress,
                urls: [],
            };

            const routerRoutesMap = {};

            for (const route of routes.values()) {

                const {
                    type,
                    name,
                    fullPath,
                    address,
                    bodyKeys,
                    queryKeys,
                    paramKeys,
                } = route;

                this._routeMap[routerKey].urls.push(address);

                const routeKey = `/${name}`;

                routerRoutesMap[routeKey] = {
                    requestType: type.toUpperCase(),
                    path: fullPath,
                    address,
                };

                if (bodyKeys.length) {
                    routerRoutesMap[routeKey].bodyKeys = bodyKeys
                }
                if (queryKeys.length) {
                    routerRoutesMap[routeKey].queryKeys = queryKeys
                }
                if (paramKeys.length) {
                    routerRoutesMap[routeKey].paramKeys = paramKeys
                }

            }

            router.get('/', (req, res) => {
                res.send({
                    'back to service': this.fullUrlWithPath(this.serviceURI),
                    [`${this.serviceURI}${routerKey}`]: routerRoutesMap,
                })
            })

        }

        this.router.get('/', (req, res) => {
            res.send({
                'back to root': this.fullUrlWithPath(''),
                [this.serviceURI]: this.routeMap,
            })
        });

    };

    _getService = () => {
        throw('[getServices] - method not yet implemented');
    };

    _getRoute = (routePath) => {
        const routePaths = routePath.split('.');

        let serviceKey = null;
        let routerKey = null;
        let routeKey = null;
        let service = this;

        // check if we want to looking in another service
        if (routePaths.length === 3) {
            serviceKey = routePaths[0];
            routerKey = routePaths[1];
            routeKey = routePaths[2];
        } else {
            routerKey = routePaths[0];
            routeKey = routePaths[1];
        }

        if (serviceKey) {
            service = this.getService(serviceKey);
        }

        const router = service.routers[routerKey];
        if (!router) {
            throw(`could not find router '${routerKey}' in ${service.fullName}`)
        }

        const route = router.routes.get(routeKey);
        if (!route) {
            throw(`could not find route '${routePath}' in ${service.fullName}`)
        }

        return route;
    };

}


function setReqTimeStart(req, res, next){
    if(!req.startTime){
        req.startTime = Date.now();
    }
    next();
}
