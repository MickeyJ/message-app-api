
export default [
    require('./all.route').default({
        name: 'all',
        type: 'GET',
        open: true,
    }),
    // require('./user_post.route').default({
    //     name: 'user_post',
    //     uri: 'user',
    //     type: 'POST',
    //     open: true,
    // }),

]
