const express = require('express');
const device = require('express-device');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(device.capture());

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res){
    console.log(req.device.type);
    if(req.device.type === "desktop"){
        res.sendFile(path.join(__dirname, 'static/html/desktop.html'))
    } else {
        res.sendFile(path.join(__dirname, 'static/html/mobile.html'))
    }
});

app.get('/clashData', function(req, res){
    console.log(req.query.region);
    res.json(clashDataList[req.query.region]);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



let api_key = "";
try {
    api_key = fs.readFileSync(path.join(__dirname, 'api_key.txt'), 'utf8');
    console.log(api_key);
} catch (err) {
    console.log("Couldn't load api_key : Not requesting data from riot's API");
    console.error(err);
}


let clashData = null;
let updateTime = 0;
const REGIONS = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru'];
let clashDataList = {};
for(const region of REGIONS){
    clashDataList[region] = null;
}
const baseTimeoutDuration = 30000;
let timeoutDuration = baseTimeoutDuration;

function loopUpdateData(){
    timeoutDuration = baseTimeoutDuration;
    for(const region of REGIONS){
        https.get(`https://${region}.api.riotgames.com/lol/clash/v1/tournaments?api_key=${api_key}`, (resp) => {
            let data = '';
          
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
              data += chunk;
            });
          
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                //console.log(resp.headers);
    
                if(resp.statusCode == 429){
                    console.log("429 : Limit exceed detected");
                    timeoutDuration = (resp.headers['retry-after'])*1000;
    
                } else if (resp.statusCode == 200){
                    updateTime = Date.now();
                    clashDataList[region] = {
                        clashData:JSON.parse(data),
                        updateTime: updateTime
                    }
                    console.log(`200 : ${region} Clash data update on ${(new Date(updateTime)).toString()}`);
                } else {
                    console.log(resp.statusCode);
                }
            });  
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    

    setTimeout(loopUpdateData, timeoutDuration);
}

if(api_key !== "")
    loopUpdateData();

// "id": 2981,
//         "themeId": 19,
//         "nameKey": "zaun",
//         "nameKeySecondary": "day_1",
//         "schedule": [
//             {
//                 "id": 3101,
//                 "registrationTime": 1613866500000,
//                 "startTime": 1613876400000,
//                 "cancelled": false
//             }
//         ]