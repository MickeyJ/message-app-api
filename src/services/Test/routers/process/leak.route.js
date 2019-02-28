import uuid from 'uuid/v1'

const reqMap = new Map();

class ALeakyThing {
    constructor(n){
        this.value = n
    }
}

class ANonLeakyThing {
    constructor(n){
        this.value = n
    }
}

let leakyThings = [];

export default function(config){
    return function(){

        return {
            ...config,
            handler: (req, res, next) => {



                const nonLeakyThings = [];

                if(req.query.clean){

                    reqMap.clear();
                    leakyThings = [];

                    // manually run garbage collection
                    try {
                        global.gc();
                    } catch (e) {
                        console.log("You must run program with 'node --expose-gc' or 'npm start'");
                        return next(e);
                    }

                } else {
                    // store leaky and non-leaky data
                    reqMap.set(uuid(), req);
                    addThings(nonLeakyThings, 1000);
                }

                // const requests = [];
                //
                // for(const request of reqMap.keys()){
                //     requests.push(request)
                // }

                req.leakData = {
                    leakyThings: leakyThings.length,
                    nonLeakyThings: nonLeakyThings.length,
                    leakedRequests: reqMap.size,
                };

                const memoryRoute = this.getRoute('process.memory');

                memoryRoute.handle(req, res, next);
            },
        }
    }
}

function addThings(nonLeakyThings, count) {
    let idx = 0;
    while(idx < count){
        nonLeakyThings.push(new ANonLeakyThing(bigRandomNumber()));
        leakyThings.push(new ALeakyThing(bigRandomNumber()));
        idx++;
    }
}

function bigRandomNumber(){
    return Math.floor(Math.random() * 10000) + 1000
}
