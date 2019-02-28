import mysql from 'mysql'
import util from 'util'
import Pool from 'mysql/lib/Pool'

Pool.prototype.query = util.promisify(Pool.prototype.query);

const query = Pool.prototype.query;

Pool.prototype.query = async function(){
    console.log('running a query');
    return await query.apply(this, arguments);
};

export default (config) => {

    const pool = mysql.createPool(config);

    pool.on('connection', function () {
        process.env.NODE_ENV.indexOf('test') === -1
        && console.log('[mysql]','Pool Connection Successful');
    });

    pool.on('enqueue', function () {
        process.env.NODE_ENV.indexOf('test') === -1
        && console.log('[mysql]', 'Waiting for available connection slot');
    });

    return pool;
}
