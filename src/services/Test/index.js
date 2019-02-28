import ApiService from 'ApiService'
import config from './config'
import routers from './routers'


// modules
import middleware from './middleware'
import db from './db'

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
    modules: {
        db,
        middleware,
    },
});
