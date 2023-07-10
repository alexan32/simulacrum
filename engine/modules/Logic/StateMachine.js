/*  A state is an object that has:
    1. a map of available transitions out of the state
    2. an onEnter() function
    3. an onExit() function

    example:
    var on = new State({
        "push": "OFF"
    });
    on.onExit = ()=>{ console.log("leaving ON state") };
    on.onEnter = ()=>{ console.log("entering ON state") };
*/
export class State{

    constructor(transitionMap){
        this.transitionMap = transitionMap;
    }
    onEnter() {}
    onExit() {}
}


/*  A state machine has: 
    1. a currentState
    2. a states map that maps a state name to a state object
    3. an update function that will perform state transitions when provided
        with the appropriate input for the current state.

    example:
    var machine = new StateMachine("OFF", {"ON": on, "OFF": off});
    machine.update("push");
*/
export class StateMachine{

    constructor(initialState=null, states={}){
        this.currentState = initialState;
        this.states = states;
    }

    update(eventKey){
        if (this.states[this.currentState].transitionMap.hasOwnProperty(eventKey)) {
            this.states[this.currentState].onExit();
            this.currentState = this.states[this.currentState].transitionMap[eventKey];
            this.states[this.currentState].onEnter();
        }
    }

}