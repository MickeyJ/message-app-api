import fs from 'fs'
import url from 'url'
import path from 'path'
import fws from 'fixed-width-string'
import isObject from 'lodash/isObject'

/**
 * Static Configurations
 * =====================
 */
export const {
    NODE_ENV,
    API_DOMAIN,
} = process.env;
export const API_NAME = 'API Template';
export const PORT = '3000';
export const __PROD__  = (NODE_ENV === 'production');
export const __STAGE__ = (NODE_ENV === 'staging');
export const __DEV__   = !__PROD__ && !__STAGE__;
export const baseUrl = (
    __DEV__
        ? `http://${API_DOMAIN}`
        : `https://${API_DOMAIN}`
);

/**
 * Dynamic Configurations
 * ======================
 */

export const fullUrlWithPath = (path) => url.resolve(baseUrl, path);

export const PATHS = {
    public: absolute('public'),
    tmp: absolute('tmp'),
    logs: absolute('logs'),
};

createDirectories(PATHS);

const config = {
    PORT,
    PATHS,
    API_NAME,
    __DEV__,
    __PROD__,
    __STAGE__,
    baseUrl,
};

export default config

function absolute(dirname){
    return path.resolve('./', dirname)
}

function createDirectories(paths){
    const pathKeys = Object.keys(paths);
    pathKeys.map(pathKey => {
        const path = paths[pathKey];
        if (!fs.existsSync(path)){
            console.log('\nCreate Directory:', path);
            fs.mkdirSync(path);
        }
    })
}

console.dataLog = function(title, data){

    const dataKeys = Object.keys(data);
    const titleLength = (title.length * 1.5);
    const titlePadLength = (titleLength - title.length) / 2;
    const titlePad = fws('', titlePadLength);
    const titleFormatted = titlePad + fws(title, titleLength, { align: 'center' });
    const titleUnderline = fws('', titleLength, { padding: '=' });
    const hrLine = fws('', titleLength, { padding: '—' });

    let longestKeyLength = getLongestKey();

    logTitle();

    if(!dataKeys.length){
        console.log('No data to log.');
    } else {
        logItems();
    }

    logEnd();


    function logTitle(){
        console.log(' ');
        console.log(hrLine);
        console.log(titleFormatted);
        console.log(titleUnderline);
    }

    function logItems(){
        dataKeys.forEach(dataKey => {
            const key = fws(dataKey, longestKeyLength + 1);
            let value = data[dataKey];
            if(isObject(value)){
                value = JSON.stringify(value, null, 2)
            }

            console.log(`${key}:`, value);
        });
    }

    function logEnd(){
        console.log(hrLine);
        console.log(' ');
    }

    function getLongestKey(){
        let longestKeyLength = 0;
        dataKeys.forEach(key => {
            const keyLength = key.length;
            if(keyLength > longestKeyLength){
                longestKeyLength = keyLength;
            }
        });
        return longestKeyLength;
    }
};
