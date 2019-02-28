import AWS from 'aws-sdk'
import fs from 'fs'

const s3 = new AWS.S3();

export function generateUploadParams(file){
    return {
    // ACL: 'public-read',
        Bucket: file.bucket,
        Key: `${file.bucketDir}/${file.filename}`,
        Body: fs.createReadStream(file.path),
    }
}

export default function s3upload(params){
    return new Promise((resolve, reject) => {
        s3.upload(params, function(error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    })
}