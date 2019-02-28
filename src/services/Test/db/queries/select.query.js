

export default (pool) => ({

    users(){
        return pool.query(`
            SELECT * FROM users
        `)
    },

})