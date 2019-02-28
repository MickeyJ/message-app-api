import fs from 'fs'
import { expect } from 'chai'
import api from './api'

const fileName = 'test-write.txt';
const fileContent = 'such a nice file.';

describe('GET /test/file/write', () => {

    it('fails without filename query parameter', () => {
        return api.get('/test/file/write')
            .expect(400)
            .then(response => {
                // assert()
                const errorMessage = JSON.parse(response.error.text);
                expect(errorMessage.error).to.equal(`missing required data from 'req.query'`);
            })
    });

    it('writes a file', () => {
        return api.get(`/test/file/write?filename=${fileName}`)
            .expect(201)
            .then((res) => {
                expect(fs.existsSync(res.body.path), 'File not written??').to.be.true;
            })
    });

    it('writes a file with content', () => {
        return api.get(`/test/file/write?filename=${fileName}&content=${fileContent}`)
            .expect(201)
            .then((res) => {
                expect(fs.existsSync(res.body.path), 'File not written??').to.be.true;
                return api.get(`/test/file/read?filename=${fileName}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.text).to.equal(fileContent);
                    })
            })
    });

});