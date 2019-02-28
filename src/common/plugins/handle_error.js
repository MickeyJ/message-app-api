
export default function handleError(next, status = 400, extraData = {}){
    return function(e){
        next(new ApiError(e, status, extraData));
    }
}