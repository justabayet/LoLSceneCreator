const clashDataDiv = document.getElementById("clashData");
const countDownDiv = document.getElementById("countDown");
const lastupdateDiv = document.getElementById("lastupdate");
let nextClash;
let nextSchedule;
let updateCountdownLoop;

const url = window.location.protocol + "//" + window.location.host + "/clashData";

$.get(url, (data, status) => {
    console.log(status, data.clashData, data.updateTime);
    let clashData = data.clashData;

    clashDataDiv.innerHTML = JSON.stringify(clashData);
    lastupdateDiv.innerHTML = "Last update on : " + (new Date(data.updateTime)).toString();

    let soonestTime = 0;
    for(const clash of clashData){
        for(const schedule of clash.schedule){
            if(!schedule.canceled && (clash.schedule < soonestTime || soonestTime == 0)){
                soonestTime = schedule.registrationTime;
                nextClash = clash;
                nextSchedule = schedule;
            }
        }
    }

    if(nextClash){
        updateCountdownLoop = setInterval(
            () => {
                let leftDuration = nextSchedule.registrationTime - Date.now(); // In milliseconds
                let leftDate = new Date(leftDuration);
        
                // Days part from the timestamp
                let days = Math.floor(leftDuration/(1000*60*60*24));
                // Hours part from the timestamp
                let hours = "0" + leftDate.getHours();
                // Minutes part from the timestamp
                let minutes = "0" + leftDate.getMinutes();
                // Seconds part from the timestamp
                let seconds = "0" + leftDate.getSeconds();
        
                // Will display time in 00d00:00:00 format
                let formattedLeftDate = days + 'd' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                countDownDiv.innerHTML = formattedLeftDate;
            },
            100
        );
    } else {
        countDownDiv.innerHTML = "No clash scheduled :("
    }
});