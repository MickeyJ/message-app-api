/* npm */
import bugsnag from 'bugsnag'
// import lodash from 'lodash'

/* internal */
import emailer from '~/common/plugins/emailer'
import Html from '~/common/plugins/Html'
import * as typeCheck from '~/common/plugins/type_check'
import checkParams from '~/common/plugins/check_params'
import deleteFile from '~/common/plugins/delete_file'
import writeFile from '~/common/plugins/write_file'
import writeJson from '~/common/plugins/write_json'
import readFile from '~/common/plugins/read_file'
import readDir from '~/common/plugins/read_dir'
import handleError from '~/common/plugins/handle_error'
import uploadFFS from '~/common/plugins/upload_ffs'
import calculateReqTime from '~/common/plugins/calculate_req_time'

export default {

    /* npm */
    bugsnag,
    // lodash,

    /* internal */
    typeCheck,
    checkParams,
    deleteFile,
    writeFile,
    writeJson,
    readFile,
    readDir,
    Html,
    emailer,
    handleError,
    uploadFFS,
    calculateReqTime,
}
