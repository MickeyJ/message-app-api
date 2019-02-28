

export default function calculateReqTime(startTime) {

    const milliseconds = (Date.now() - startTime);
    const msShort = parseInt(milliseconds.toString().substring(0, 2));

    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

    return [
        minutes,
        seconds,
        msShort,
    ].map(n => {
        return `${(n < 10 ? '0' : '')}${n}`
    }).join(':');
}
