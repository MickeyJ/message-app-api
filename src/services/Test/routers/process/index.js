
export default [
    require('./memory.route').default({
        name: 'memory',
        type: 'GET',
        open: true,
    }),
    require('./leak.route').default({
        name: 'leak',
        type: 'GET',
        open: true,
    }),
    require('./errorlog.route').default({
        name: 'errorlog',
        type: 'GET',
        open: true,
    }),
    require('./accesslog.route').default({
        name: 'accesslog',
        type: 'GET',
        open: true,
    }),

]
