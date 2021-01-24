let clashList = new ClashList();
let updateCountdownLoop;

function updateViews(){
    setDateDiv(new Date(clashList.getCurrentRegistrationTime()));
    $('#tournamentSelector').html((clashList.getCurrentPrimary().name).toUpperCase());
    $('#daySelector').html((clashList.getCurrentSecondary().name).toUpperCase());
    updateCountdown();
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
        
        Log.debug(data.clashData);
        Log.debug(data.updateTime);
    
        $("#lastupdate").html("Last update on : " + (new Date(data.updateTime)).toString());
    
        clashList.initialize(data.clashData);
    
        if(clashList.getCurrentSecondary()){
            updateViews();
            updateCountdownLoop = setInterval( updateCountdown, 500);
    
        } else {
            Log.error("No clash scheduled atm");
        }
    });
}
getClashData();



function setDateDiv(date){
    $("#date-date").html(`${("0" + date.getDate()).substr(-2)} ${month[date.getMonth()]} ${date.getFullYear()}`);
    $("#date-hour").html(`${("0" + date.getHours()).substr(-2)}:${("0" + date.getMinutes()).substr(-2)}`);
    $("#date-gmt").html(`${date.toString().split(' ')[5]}`);
}

function updateCountdown(){
    let leftDuration = clashList.getCurrentRegistrationTime() - Date.now(); // In milliseconds
    let leftDate = new Date(leftDuration);

    // Days part from the timestamp
    let days = Math.floor(leftDuration/(1000*60*60*24));
    // Hours part from the timestamp
    let hours = "0" + leftDate.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + leftDate.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + leftDate.getSeconds();

    $("#days").html(days);
    $("#hours").html(hours.substr(-2));
    $("#minutes").html(minutes.substr(-2));
    $("#seconds").html(seconds.substr(-2));
}

$('#tournamentSelectorPrevious').click(
    function() {
        Log.debug("tournamentSelectorPrevious clicked");
        clashList.previousPrimary();
        updateViews();
    }
);

$('#tournamentSelectorNext').click(
    function() {
        Log.debug("tournamentSelectorNext clicked");
        clashList.nextPrimary();
        updateViews();
    }
);

$('#daySelectorPrevious').click(
    function() {
        Log.debug("daySelectorPrevious clicked");
        clashList.previousSecondary();
        updateViews();
    }
);

$('#daySelectorNext').click(
    function() {
        Log.debug("daySelectorNext clicked");
        clashList.nextSecondary();
        updateViews();
    }
);



$(".dropbtn").click(
    () => {
        $(".dropdown-content").toggleClass("show");
    }
);

$(".dropdown-item").click(
    (event) => {
        $("#regionSelectorDropbtn").html(event.target.innerHTML);
        getClashData();
    }
);

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        $(".dropdown-content").removeClass("show");
    }
}