import ServiceEvents from '~/common/ServiceEvents'

export default function events(service){

    const eventList = [
        {
            name: 'test',
            type: 'once',
            method(data){
                console.log(data);
            },
        },
        {
            name: 'error',
            type: 'on',
            method(data){
                console.log(data);
            },
        },

    ];

    return new ServiceEvents(eventList);
}