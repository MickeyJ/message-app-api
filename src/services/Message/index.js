import ApiService from 'ApiService'
import config from './config'
import routers from './routers'
import createSocket from './socket'

/* modules */
import middleware from './middleware'
import db from './db'
import events from './events'


/*
* Testing Service
* */
export default new ApiService({
    routers,
    descriptors: {
        name: config.API_NAME,
        fullName: config.FULL_NAME,
        domain: config.API_DOMAIN,
    },
    // plugins: {
    //     createSocket: createSocket,
    // },
    modules: {
        db,
        middleware,
        events,
        socket: createSocket,
    },
});
