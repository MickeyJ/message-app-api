
export default [
    require('./connection.route').default({
        name: 'connection',
        type: 'GET',
        open: true,
    }),
]
