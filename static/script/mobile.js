let clashList = new ClashList();
let updateCountdownLoop;
let toUpdateCountdown = true;


function swapViews(){
    $("#image").removeClass("animationImageSwap");
    $("#date-hider").removeClass("animationDateHiderSwap");
    void document.getElementById("image").offsetWidth;

    $("#date-hider").addClass("animationDateHiderSwap");
    $("#image").addClass("animationImageSwap");
}

function updateViews(){
    updateCoolDivs();
    updateSelectors();
}

function updateCoolDivs(){
    setDateDiv(clashList.getCurrentRegistrationTime());
    updateCountdown();
    toUpdateCountdown = true;
    updateCountdown();
    updateCountdownLoop = setInterval( updateCountdown, 500);
}

function updateSelectors(){
    $('#tournamentSelector').html((clashList.getCurrentPrimary().name).toUpperCase());
    if(clashList.hasNextPrimary()){
        if(document.getElementById('tournamentSelectorPrevious').classList.contains("selectorButtonDisabled")){
            document.getElementById('tournamentSelectorPrevious').classList.remove("selectorButtonDisabled");
            document.getElementById('tournamentSelectorNext').classList.remove("selectorButtonDisabled");
        }
        document.getElementById('tournamentSelectorPrevious').classList.add("selectorButtonEnabled");
        document.getElementById('tournamentSelectorNext').classList.add("selectorButtonEnabled");
    } else {
        if(document.getElementById('tournamentSelectorPrevious').classList.contains("selectorButtonEnabled")){
            document.getElementById('tournamentSelectorPrevious').classList.remove("selectorButtonEnabled");
            document.getElementById('tournamentSelectorNext').classList.remove("selectorButtonEnabled");
        }
        document.getElementById('tournamentSelectorPrevious').classList.add("selectorButtonDisabled");
        document.getElementById('tournamentSelectorNext').classList.add("selectorButtonDisabled");

    }
    $('#daySelector').html((clashList.getCurrentSecondary().name).toUpperCase());
    if(clashList.hasNextSecondary()){
        if(document.getElementById('daySelectorPrevious').classList.contains("selectorButtonDisabled")){
            document.getElementById('daySelectorPrevious').classList.remove("selectorButtonDisabled");
            document.getElementById('daySelectorNext').classList.remove("selectorButtonDisabled");
        }
        document.getElementById('daySelectorPrevious').classList.add("selectorButtonEnabled");
        document.getElementById('daySelectorNext').classList.add("selectorButtonEnabled");
    } else {
        if(document.getElementById('daySelectorPrevious').classList.contains("selectorButtonEnabled")){
            document.getElementById('daySelectorPrevious').classList.remove("selectorButtonEnabled");
            document.getElementById('daySelectorNext').classList.remove("selectorButtonEnabled");
        }
        document.getElementById('daySelectorNext').classList.add("selectorButtonDisabled");
        document.getElementById('daySelectorPrevious').classList.add("selectorButtonDisabled");
        
    }
}

function createDropdown(){
    for(const region of REGIONS){
        $("#regionSelector").append(`<div class="dropdown-item">${region}</div>`);
    }
    $("#regionSelectorDropbtn").html("euw1");
}
createDropdown();


function getClashData(){
    $.get(url, {region:$("#regionSelectorDropbtn").html()}, (data, status) => {
        if(status != "success")
        {
            data = {
                clashData: [
                  {
                    id: 2681,
                    themeId: 19,
                    nameKey: 'zaun',
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
        }
        
        Log.debug(status);
        
        if(data.clashData != null){
            Log.debug(data.clashData);
            Log.debug(data.updateTime);
        }

        //$("#lastupdate").html("Last update on : " + (new Date(data.updateTime)).toString());
    
        clashList.initialize(data.clashData);

        updateSelectors();
        swapViews();
        setTimeout(() => {
            updateCoolDivs();
        }, 500);
        updateCountdownLoop = setInterval( updateCountdown, 500);
    
    });
}
getClashData();



function setDateDiv(dateMilli){
    if(dateMilli === null){
        $("#date-date").html(`-- JAN ---- `);
        $("#date-hour").html(`--:--`);
        $("#date-gmt").html(`GMT+----`);

        $("#backgroundCountdownPanel").css("background-color", "var(--top-color)");
        $('#passedText').css("display", "none");

    } else {
        let date = new Date(dateMilli);

        $("#date-date").html(`${("0" + date.getDate()).substr(-2)} ${month[date.getMonth()]} ${date.getFullYear()}`);
        $("#date-hour").html(`${("0" + date.getHours()).substr(-2)}:${("0" + date.getMinutes()).substr(-2)}` + "*");
        $("#date-gmt").html(`${date.toString().split(' ')[5]}`);

        let timeZoneOffsetInMilliseconds = (new Date()).getTimezoneOffset()*60*1000;
        let leftDuration = dateMilli - Date.now() + timeZoneOffsetInMilliseconds; // In milliseconds

        if(leftDuration < 0){
            $("#backgroundCountdownPanel").css("background-color", "var(--silver-color)");
            $('#passedText').css("display", "block");
        } else {
            $("#backgroundCountdownPanel").css("background-color", "var(--gold-color)");
            $('#passedText').css("display", "none");
        }
    }
}

function updateCountdown(){
    if(!toUpdateCountdown)
        return;
    let currentRegistrationTime = clashList.getCurrentRegistrationTime();
    if(currentRegistrationTime === null){
        $("#days").html("--");
        $("#hours").html("--");
        $("#minutes").html("--");
        $("#seconds").html("--");

    } else {
        let timeZoneOffsetInMilliseconds = (new Date()).getTimezoneOffset()*60*1000;
        let leftDuration = Math.abs(currentRegistrationTime - Date.now() + timeZoneOffsetInMilliseconds); // In milliseconds

    
        // Days part from the timestamp
        let days = Math.floor(leftDuration/(1000*60*60*24));
        // Hours part from the timestamp
        let hours = Math.floor(leftDuration/(1000*60*60)) - days*24;
        // Minutes part from the timestamp
        let minutes = Math.floor(leftDuration/(1000*60))- days*24*60 - hours*60;
        // Seconds part from the timestamp
        let seconds = Math.floor(leftDuration/(1000))- days*24*60*60 - hours*60*60 - minutes*60;
    
        $("#days").html(days);
        $("#hours").html(("0"+hours).substr(-2));
        $("#minutes").html(("0"+minutes).substr(-2));
        $("#seconds").html(("0"+seconds).substr(-2));

    }
}

$('#tournamentSelectorPrevious').click(
    function() {
        selectorClicked("tournamentSelectorPrevious clicked", ()=> clashList.previousPrimary());
    }
);

$('#tournamentSelectorNext').click(
    function() {
        selectorClicked("tournamentSelectorNext clicked", ()=> clashList.nextPrimary());
    }
);

$('#daySelectorPrevious').click(
    function() {
        selectorClicked("daySelectorPrevious clicked", ()=> clashList.previousSecondary());
    }
);

$('#daySelectorNext').click(
    function() {
        selectorClicked("daySelectorNext clicked", ()=> clashList.nextSecondary());
    }
);

function selectorClicked(msg, nextFunction){
    Log.debug(msg);
    toUpdateCountdown = false;
    clearInterval(updateCountdownLoop);

    if(nextFunction()){

        updateSelectors();
        swapViews();
        setTimeout(() => {
            updateCoolDivs();
        }, 200);

    }

}

$(".dropbtn").click(
    () => {
        $(".dropdown-content").toggleClass("show");
    }
);

$(".dropdown-item").click(
    (event) => {
        let newRegion = event.target.innerHTML;
        let oldRegion = $("#regionSelectorDropbtn").html();

        if(oldRegion != newRegion){
            $("#regionSelectorDropbtn").html(newRegion);
            getClashData();
        }
    }
);

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        $(".dropdown-content").removeClass("show");
    }
}