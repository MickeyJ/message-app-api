import fs from 'fs'

export default function readDir(path){
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(path)){
            const e = new Error(`directory "${path}" does not exist`);
            reject(e);
            return;
        }
        fs.readdir(path, function(error, items) {
            if(error) reject(error);
            else resolve(items);
        });
    })
}
