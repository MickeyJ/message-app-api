
export default [
    require('./read.route').default({
        name: 'read',
        type: 'GET',
        open: true,
        queryKeys: [
            'filename*',
        ],
    }),
    require('./write.route').default({
        name: 'write',
        type: 'GET',
        open: true,
        queryKeys: [
            'filename*',
            'content',
        ],
    }),
    require('./write_json.route').default({
        name: 'write_json',
        uri: 'write-json',
        type: 'get',
        open: true,
        queryKeys: [
            'filename*',
        ],
    }),
    require('./remove.route').default({
        name: 'remove',
        type: 'GET',
        open: true,
        queryKeys: [
            'filename*',
        ],
    }),
]
