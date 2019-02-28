import configureQueries from '~/common/utils/configure_queries'

import select from './select.query'

export default function(pool){
    return configureQueries(pool, {
        select,
    });
}

