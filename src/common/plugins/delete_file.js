import fs from 'fs'

export default function deleteFile(path){
    !fs.existsSync(path) || fs.unlinkSync(path)
}