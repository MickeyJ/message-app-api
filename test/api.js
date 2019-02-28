import request from 'supertest'

let api;

if(process.env.NODE_ENV === 'quick-test'){
    api = require('../src/api').default;
} else {
    api = require('../bin/api').default;
}

export default request(api);