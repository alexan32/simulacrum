import { entityManager } from "../EntityComponentSystem.js";

export class TimerComponent{
    constructor(duration=0, expires=true, active=true){
        this.componentKey = "timer";
        this.hasExpired = false;
        this.originalArgs = {"duration": duration, "expires": expires, "active": active}
        this.reset();
    }

    reset(){
        this.duration = this.originalArgs.duration;
        this.expires = this.originalArgs.expires;
        this.active = this.originalArgs.active;
        this.hasExpired = false;
        this.elapsed = 0;
    }

    addCallback(callbackFunction){
        this.callback = callbackFunction;
    }
}


export class TimerSystem{

    constructor(){
        this.id="timerSystem";
    }

    update(delta){
        for(const key in entityManager.entityPool){
            const entity = entityManager.entityPool[key];
            if(entity.timer){
                let timer = entity.timer;
                if(timer.active){
                    timer.elapsed += delta/1000;
                }
                if(timer.elapsed >= timer.duration){
                    if(timer.expires && !timer.hasExpired){
                        timer.hasExpired = true;
                        if(timer.callback){
                            timer.callback();
                        }
                    }
                }

            }
        }
    }

}
