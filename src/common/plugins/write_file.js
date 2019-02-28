import fs from 'fs'

export default function writeFile(path, content){
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (error) =>{
            if(error){
                reject(error)
            } else {
                const message = `[writeFile] - File Created '${path}'`;
                resolve({
                    message,
                    path,
                    content,
                });
            }
        });
    })
}