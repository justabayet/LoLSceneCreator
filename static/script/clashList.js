class ClashList{
    constructor(){
        this.list = [];
        /*
        [{
            'name': 'zaun',
            'days':[
                {
                    'name': 'day_1',
                    'schedules': [{
                        "id": 3101,
                        "registrationTime": 1613866500000,
                        "startTime": 1613876400000,
                        "cancelled": false
                    }]
                }
            ]
        }] 
        */
        this.currentIdPrimary = 0;
        this.currentIdSecondary = 0;
    }

    initialize(data){
        this.list = [];
        this.currentIdPrimary = 0;
        this.currentIdSecondary = 0;
        for(const clash of data){
            this.addPrimary(clash.nameKey);
            this.addSecondary(clash.nameKey, clash.nameKeySecondary, clash.schedule);
        }
    }

    isPrimaryIn(key){
        for(const clash of this.list){
            if(clash.name === key) return true;
        }
        return false;
    }

    addPrimary(key){
        if(this.isPrimaryIn(key)) return;

        this.list.push({
            'name':key,
            'days':[]
        });
    }

    nextPrimary(){
        if(this.list.length === 1) return;
        this.currentIdPrimary = (this.currentIdPrimary+1)%this.list.length;
        this.currentIdSecondary = 0;
        Log.debug(this.currentIdPrimary);
    }

    previousPrimary(){
        if(this.list.length === 1) return;
        this.currentIdPrimary = (this.currentIdPrimary-1)%this.list.length;
        this.currentIdSecondary = 0;
        Log.debug(this.currentIdPrimary);
    }

    getCurrentPrimary(){
        return this.list[this.currentIdPrimary];
    }

    getPrimary(key){
        for(const clash of this.list){
            if(clash.name === key) return clash;
        }
        return null;
    }

    addSecondary(keyPrimary, keySecondary, schedules){
        if(!this.isPrimaryIn(keyPrimary)) this.addPrimary(keyPrimary);

        let clash = this.getPrimary(keyPrimary);

        let placed = false;
        for(let i=0; i < clash.days.length && !placed; i++){
            if(keySecondary < clash.days[i].name){

                clash.days.splice(i, 0, {
                    'name':  keySecondary,
                    'schedules': schedules
                });

                placed = true;
            }
        }

        if(!placed){
            clash.days.push({
                'name':  keySecondary,
                'schedules': schedules
            });
        }
    }

    nextSecondary(){
        let cp = this.getCurrentPrimary();
        this.currentIdSecondary = (this.currentIdSecondary+1)%cp.days.length;
        Log.debug(this.currentIdSecondary);
    }

    previousSecondary(){
        let cp = this.getCurrentPrimary();
        this.currentIdSecondary = (this.currentIdSecondary-1+cp.days.length)%cp.days.length;
        Log.debug(this.currentIdSecondary);
    }

    getCurrentSecondary(){
        return this.list[this.currentIdPrimary].days[this.currentIdSecondary];
    }

    sort(){

    }

    getCurrentRegistrationTime(){
        for(const schedule of this.getCurrentSecondary().schedules){
            if(!schedule.canceled) return schedule.registrationTime;
        }
        return null;
    }
}