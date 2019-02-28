import fs from 'fs'
import { expect } from 'chai'
import api from './api'

const fileName = 'test-read.txt';
const filePath = `./tmp/${fileName}`;
const fileContent = 'read me!';

try {
    fs.writeFileSync(filePath, fileContent);
} catch(e) {
    throw(e);
}

describe('GET /test/file/read', () => {

    it('fails without filename query parameter', () => {
        return api.get('/test/file/read')
            .expect(400)
            .then(response => {
                const errorMessage = JSON.parse(response.error.text);
                expect(errorMessage.error).to.equal(`missing required data from 'req.query'`);
            })
    });

    it('reads file and content', () => {
        return api.get(`/test/file/read?filename=${fileName}`)
            .expect(200)
            .then((res) => {
                expect(res.text).to.equal(fileContent);
            })
    })

});