import fs from 'fs'
import path from 'path'

import readFile from './read_file'
import writeFile from './write_file'

import {
    isArray,
    isObject,
} from './type_check'

export default function writeJson(filename, directory, writeData, shouldReplace = true){
    return new Promise((resolve, reject) => {

        if(!filename){
            reject(new Error('filename is required'));
            return;
        }
        if(!directory){
            reject(new Error('directory is required'));
            return;
        }
        if(!writeData){
            reject(new Error('no data/json to write'));
            return;
        }

        let defaultData = getDefaultData(writeData);

        const todayFileName = `${filename}.json`;
        const filePath = path.join(path.resolve(directory), todayFileName);
        let json = JSON.stringify(writeData, null, 2);

        if(!fs.existsSync(filePath) || shouldReplace){
            writeFile(filePath, json)
                .then(success => {
                    resolve(success)
                })
                .catch(e => {
                    reject(e)
                });
            return;
        }

        readFile(filePath)
            .then(oldJson => {

                let parsedJSON = null;

                if(!oldJson) parsedJSON = defaultData;
                else parsedJSON = JSON.parse(oldJson);

                const json = JSON.stringify(concatData(parsedJSON, writeData), null, 2);
                return writeFile(filePath, json)
            })
            .then(success => {
                resolve(success)
            })
            .catch(e => {
                reject(e)
            })

    });
}

function getDefaultData(data){
    if(isArray(data)){
        return [];
    } else if(isObject(data)){
        return {};
    }
}

function concatData(...args){
    let output = null;
    if(isArray(args[0])){
        output = [];
        args.forEach(data => {
            output.push(...data)
        });
    } else if(isObject(args[0])){
        output = {};
        args.forEach(data => {
            output = {
                ...output,
                ...data,
            }
        });
    }
    return output
}

