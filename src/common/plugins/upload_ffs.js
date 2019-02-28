import fs from 'fs'
import rp from 'request-promise-native'

export default async function uploadFFS({uri, count, filePath, txtUploadcode, email}){

    const options = {
        method: 'POST',
        uri,
        formData: {
            count,
            txtUploadcode,
            email,
            file1: fs.createReadStream(filePath),
        },
    };

    return await rp(options)
}