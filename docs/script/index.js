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
        document.getElementById('tournamentSelectorPrevious').classList.add("selectorButtonEnabled");
        document.getElementById('tournamentSelectorNext').classList.add("selectorButtonEnabled");
    } else {
        document.getElementById('tournamentSelectorPrevious').classList.remove("selectorButtonEnabled");
        document.getElementById('tournamentSelectorNext').classList.remove("selectorButtonEnabled");
    }
    $('#daySelector').html((clashList.getCurrentSecondary().name).toUpperCase());
    if(clashList.hasNextSecondary()){
        document.getElementById('daySelectorPrevious').classList.add("selectorButtonEnabled");
        document.getElementById('daySelectorNext').classList.add("selectorButtonEnabled");
    } else {
        document.getElementById('daySelectorPrevious').classList.remove("selectorButtonEnabled");
        document.getElementById('daySelectorNext').classList.remove("selectorButtonEnabled");
    }
}

function createDropdown(){
    for(const region of REGIONS){
        $("#regionSelector").append(`<div class="dropdown-item">${region}</div>`);
    }
    $("#regionSelectorDropbtn").html("euw1");
}
createDropdown();


function initialize(clashData){
    
    clashList.initialize(clashData);

    updateSelectors();
    swapViews();
    setTimeout(() => {
        updateCoolDivs();
    }, 500);
    updateCountdownLoop = setInterval( updateCountdown, 500);

}

function getClashData(){
    $.get(url, {region:$("#regionSelectorDropbtn").html()}, (data, status) => {
        
        if(data.clashData != null){
            Log.debug(data.clashData);
            Log.debug(data.updateTime);
        }

        initialize(data.clashData);
    
    }).fail(function() {
        let now = Date.now();
        let one_hour = 60 * 60 * 1000
        let one_day = 24 * one_hour

        clashData = [
            {
                id: 2681,
                themeId: 19,
                nameKey: 'mock1',
                nameKeySecondary: 'day_1',
                schedule: [
                    {
                        id: 2801,
                        registrationTime: now + one_day,
                        startTime: now + one_day + one_hour,
                        cancelled: false
                    }
                ]
            },
            {
                id: 2662,
                themeId: 19,
                nameKey: 'mock1',
                nameKeySecondary: 'day_2',
                schedule: [
                    {
                        id: 2782,
                        registrationTime: now + one_day * 2,
                        startTime: now + one_day * 2 + one_hour,
                        cancelled: false
                    }
                ]
            },
            {
                id: 2701,
                themeId: 19,
                nameKey: 'mock2',
                nameKeySecondary: 'day_1',
                schedule: [
                    {
                        id: 2821,
                        registrationTime: now + one_day * 7,
                        startTime: now + one_day * 7 + one_hour,
                        cancelled: false
                    }
                ]
            },
            {
                id: 2661,
                themeId: 19,
                nameKey: 'mock2',
                nameKeySecondary: 'day_2',
                schedule: [
                    {
                        id: 2781,
                        registrationTime: now + one_day * 8,
                        startTime: now + one_day * 8 + one_hour,
                        cancelled: false
                    }
                ]
            }
        ];
        initialize(clashData);
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

        let leftDuration = dateMilli - Date.now(); // In milliseconds

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
        // Date.now() is not relative to the timezone
        let leftDuration = Math.abs(currentRegistrationTime - Date.now()); // In milliseconds
    
        // Days part from the timestamp
        let days = Math.floor(leftDuration/(1000*60*60*24));
        // Hours part from the timestamp
        let hours = Math.floor(leftDuration/(1000*60*60)) - days*24;
        // Minutes part from the timestamp
        let minutes = Math.floor(leftDuration/(1000*60))- days*24*60 - hours*60;
        // Seconds part from the timestamp
        let seconds = Math.floor(leftDuration/(1000))- days*24*60*60 - hours*60*60 - minutes*60;
    
        $("#days").html(days);
        $("#hours").html(("0"+hours).slice(-2));
        $("#minutes").html(("0"+minutes).slice(-2));
        $("#seconds").html(("0"+seconds).slice(-2));

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
        }, 300);

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