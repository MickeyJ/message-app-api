import { fullUrlWithPath } from '../config'

const activeServices = [
    require('~/services/Message').default,
];

function router(api, logger, server){

    api.get('/', (req, res) => {
        res.send({
            Services: serviceMap(activeServices),
        })
    });

    const services = {};

    activeServices.forEach((service) => {
        service.getService = getService;
        service.logger = logger;
        service.server = server;
        services[service.name] = service;
        applyService(service);
    });

    api.get('/favicon.ico', function(req, res) {
        res.status(204).send();
    });

    function applyService(service){
        api.use(service.serviceURI, service.router);
    }

    function getService(name){
        const foundService = services[name];
        if(!foundService){
            throw(`could not find service '${name}'`);
        }
        return foundService
    }
}


function serviceMap(services){
    const map = {};
    services.forEach(service => {
        map[service.fullName] = fullUrlWithPath(service.serviceURI)
    });
    return map;
}

export default router
