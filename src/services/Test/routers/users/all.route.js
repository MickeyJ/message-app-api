
export default function(config){
    return function(){
        return {
            ...config,
            handler: async (req, res, next) => {

                const users = await this.modules.db.select.users();

                res.send(users)

            },
        }
    }
}
