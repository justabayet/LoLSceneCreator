const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]; 
const url = window.location.protocol + "//" + window.location.host + "/clashData";
const REGIONS = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru'];

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
    isDebugMode:true,
    debug:(msg)=>{
        if(Log.isDebugMode) console.log(`DEBUG : ${msg}`);
    },
    error:(content)=>{
        console.log(`ERROR : ${content}`);
    }
};