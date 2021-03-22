class ClashList{
    constructor(){
        this.list = [];
        /* data structure example
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
        console.log(data);
        if(data === null) {
            data = [{
                'id': 0,
                'themeId': 0,
                'nameKey': '--',
                'nameKeySecondary': '--',
                'schedule':[]
                }];
        };
        for(const clash of data){
            this.addPrimary(clash.nameKey);
            this.addSecondary(clash.nameKey, clash.nameKeySecondary, clash.schedule);
        }
        this.sort();
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

    hasNextPrimary(){
        if(this.list.length === 1) return false;
        return true;
    }

    nextPrimary(){
        if(this.list.length === 1) return false;
        this.currentIdPrimary = (this.currentIdPrimary+1)%this.list.length;
        this.currentIdSecondary = 0;
        Log.debug(`Current primary index : ${this.currentIdPrimary}`);
        return true;
    }

    previousPrimary(){
        if(this.list.length === 1) return false;
        this.currentIdPrimary = (this.currentIdPrimary-1+this.list.length)%this.list.length;
        this.currentIdSecondary = 0;
        Log.debug(`Current primary index : ${this.currentIdPrimary}`);
        return true;
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

    hasNextSecondary(){
        let cp = this.getCurrentPrimary();
        if(cp.days.length === 1) return false;
        return true;
    }

    nextSecondary(){
        let cp = this.getCurrentPrimary();
        if(cp.days.length === 1) return false;
        this.currentIdSecondary = (this.currentIdSecondary+1)%cp.days.length;
        Log.debug(`Current secondary index : ${this.currentIdSecondary}`);
        return true;
    }

    previousSecondary(){
        let cp = this.getCurrentPrimary();
        if(cp.days.length === 1) return false;
        this.currentIdSecondary = (this.currentIdSecondary-1+cp.days.length)%cp.days.length;
        Log.debug(`Current secondary index : ${this.currentIdSecondary}`);
        return true;
    }

    getCurrentSecondary(){
        return this.list[this.currentIdPrimary].days[this.currentIdSecondary];
    }

    sort(){
        if(this.list[0].nameKey === "--") return this.list;
        let tempList = [];
        for(const elementToInsert of this.list){
            if(tempList.length == 0){
                tempList.push(elementToInsert);
            } else {
                let inserted = false;
                for(let i = 0 ; i < tempList.length && !inserted; i++){
                    if(elementToInsert.days[0].schedules[0].registrationTime < tempList[i].days[0].schedules[0].registrationTime){
                        tempList.splice(i, 0, elementToInsert);
                        inserted = true;
                    }
                }
                
                if(!inserted)
                    tempList.push(elementToInsert);
            }
        }

        this.list = tempList;
    }

    getCurrentRegistrationTime(){
        for(const schedule of this.getCurrentSecondary().schedules){
            if(!schedule.canceled) return schedule.registrationTime;
        }
        return null;
    }
}