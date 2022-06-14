const express = require('express');
const device = require('express-device');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(device.capture());

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/clashData', function(req, res){
    console.log(req.query.region);
    // console.log(clashDataList[req.query.region]);
    if(clashDataList[req.query.region] !== undefined){
      res.json(clashDataList[req.query.region]);
    } else {
      res.json({clashData:null});
    }
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
let mockData = {
    clashData: [
      {
        id: 2681,
        themeId: 19,
        nameKey: 'zaun_deadaezd_deazdaezda',
        nameKeySecondary: 'day_2',
        schedule: [
            {
              id: 2801,
              registrationTime: 1613922300000,
              startTime: 1613937600000,
              cancelled: false
            }
          ]
      },
      {
        id: 2662,
        themeId: 19,
        nameKey: 'zaun',
        nameKeySecondary: 'day_4',
        schedule: [
            {
              id: 2782,
              registrationTime: 1615131900000,
              startTime: 1615147200000,
              cancelled: false
            }
          ]
      },
      {
        id: 2701,
        themeId: 19,
        nameKey: 'zaun',
        nameKeySecondary: 'day_3',
        schedule: [
            {
              id: 2821,
              registrationTime: 1615045500000,
              startTime: 1615060800000,
              cancelled: false
            }
          ]
      },
      {
        id: 2661,
        themeId: 19,
        nameKey: 'zaun',
        nameKeySecondary: 'day_1',
        schedule: [
            {
              id: 2781,
              registrationTime: 1613835900000,
              startTime: 1613851200000,
              cancelled: false
            }
          ]
      }
    ],
    updateTime: 1611437305211
  };


let updateTime = 0;
const REGIONS = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru'];
let clashDataList = {};
const baseTimeoutDuration = 30000;
let timeoutDuration = baseTimeoutDuration;




/* Response example of the RIOT API. Time is in GMT+0
"id": 2981,
        "themeId": 19,
        "nameKey": "zaun",
        "nameKeySecondary": "day_1",
        "schedule": [
            {
                "id": 3101,
                "registrationTime": 1613866500000,
                "startTime": 1613876400000,
                "cancelled": false
            }
        ]
 */
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

let mockDataList = {};
if(api_key !== ""){
  loopUpdateData();

} else {   
  for(const region of REGIONS){
    clashDataList[region] = mockData;
  }
}

