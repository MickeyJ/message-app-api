import createPool from '~/common/utils/create_pool'
import queries from './queries'

export default function(){

    const pool = createPool({
        host     : process.env.LOCAL_HOST,
        user     : process.env.LOCAL_DB_USER,
        password : process.env.LOCAL_DB_PASSWORD,
        database : 'testing',
        multipleStatements: true,
        dateStrings: true,
    });

    return queries(pool);
}