import { json2csv } from 'json-2-csv'

export default function toCSV(data){
    return new Promise((resolve, reject) => {
        json2csv(data, (error, csv) =>{
            if(error){
                reject(error)
            } else {
                resolve(csv);
            }
        });
    })
}