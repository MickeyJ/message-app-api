import fs from 'fs'

export default function readFile(path, type = 'utf8'){
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(path)){
            const e = new Error(`file ${path} does not exist`);
            reject(e);
            return;
        }
        fs.readFile(path, type, (error, data) =>{
            if(error) reject(error);
            else resolve(data);
        });
    })
}
