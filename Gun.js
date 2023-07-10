import { delay } from "./engine/modules/EntityComponentSystem/Utils/Utils.js";
import { StateMachine, State } from "./engine/modules/Logic/StateMachine.js";
import { createProjectile } from "./bullets.js";

// typical rifle state machine
// empty -> reloading
// reloading -> ready to fire
// ready to fire -> reloading | resetting
// reseting -> ready to fire | empty

function buildRifleStateMachine(gun){
    const machine = new StateMachine("EMPTY");

    //empty state
    const empty = new State({"reload": "RELOADING"});
    empty.onEnter = ()=>{console.log("empty")}

    //reloading state
    const reloading = new State({"reloaded": "READY"});
    reloading.onEnter = async ()=>{
        console.log("reloading");
        await delay(gun.reloadDelay);
        gun.bulletCount = gun.capacity;
        machine.update("reloaded");
    }

    //ready state
    const ready = new State({
        "reload": "RELOADING",
        "fire": "RESETTING"
    });
    // ready.onEnter = ()=>{console.log("ready")}

    //resetting state
    const resetting = new State({
        "empty":"EMPTY",
        "reset": "READY"
    });
    resetting.onEnter = async()=>{
        // console.log("resetting");
        if(gun.bulletCount <= 0){
            machine.update("empty");
        }else{
            await delay(gun.rateOfFire);
            machine.update("reset");
        }
    }

    machine.states = {
        "READY": ready,
        "EMPTY": empty,
        "RELOADING": reloading,
        "RESETTING": resetting
    }

    return machine
}

export class Gun{

    constructor(rateOfFire, capacity, velocity, reloadDelay){
        this.rateOfFire = rateOfFire;
        this.bulletCount = 0;
        this.capacity = capacity;
        this.velocity = velocity;
        this.reloadDelay = reloadDelay;
        this.stateMachine = buildRifleStateMachine(this);
    }

    shoot(x1, y1, x2, y2){
        if(this.stateMachine.currentState != "READY"){
            return;
        }
        this.stateMachine.update("fire");
        if(this.stateMachine.currentState == "RESETTING"){
            this.bulletCount--;
            createProjectile(x1, y1, x2, y2, this.velocity);
            console.log(this.bulletCount);
        }
    }

    reload(){
        this.stateMachine.update("reload");
    }

}