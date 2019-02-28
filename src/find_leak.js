import memwatch from 'memwatch-next'
import trace from '@risingstack/trace'
import util from 'util'

/**
 * Check for memory leaks
 */
let hd = null;
memwatch.on('leak', (info) => {
    console.log('memwatch::leak');
    console.error(info);
    if (!hd) {
        hd = new memwatch.HeapDiff();
    }
    else {
        const diff = hd.end();
        console.error(util.inspect(diff, true, null));
        trace.report('memwatch::leak', {
            HeapDiff: hd,
        });
        hd = null;
    }
});

memwatch.on('stats', (stats) => {
    console.log('memwatch::stats');
    console.error(util.inspect(stats, true, null));
    trace.report('memwatch::stats', {
        Stats: stats,
    });
});
