import EventEmitter from 'events'

export default class ServiceEvents extends EventEmitter {

    eventList = [];

    constructor(eventList){
        super();
        this.eventList = eventList;
        this._registerEvents(eventList)
    }

    _registerEvents(eventList){
        eventList.forEach(event => {
            if(event.type === 'on'){
                this.on(event.name, event.method)
            }
            if(event.type === 'once'){
                this.once(event.name, event.method)
            }
        })
    }

}