import util from 'util'

export default function(pool, queryGroups){

    const processedQueryGroups = {};

    Object.keys(queryGroups).map(groupKey => {
        processedQueryGroups[groupKey] = queryGroups[groupKey](pool, makeQueryPromise)
    });

    return processedQueryGroups;
}

function makeQueryPromise(c){
    c.query = util.promisify(c.query);
    return c.query;
}