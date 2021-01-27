/*class Log{
    static isDebugMode = true;

    static debug(content){
        if(this.isDebugMode) console.log(`DEBUG : ${content}`);
    }

    static error(content){
        console.log(`ERROR : ${content}`);
    }
}*/

let Log = {
    debug:(abc)=>{
        console.log(abc);
    },
    error:(content)=>{
        console.log(`ERROR : ${content}`);
    }
};