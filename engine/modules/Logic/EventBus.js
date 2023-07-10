import { uuidv4 } from "../EntityComponentSystem/Utils/Utils.js";

const returnTrue = ()=>{return true};

export class EventBus{

    constructor(){
        this.subscriptions = {};
        this.filters = {};
    }

    /*  eventName: event which triggers the callback
        callback: the callback function
        eventFilter: function. takes the event as input and returns true or false
    */
    on(eventName, callback, eventFilter=returnTrue) {
        const id = uuidv4();
        if (!this.subscriptions[eventName]){
            this.subscriptions[eventName] = {};
            this.filters[eventName] = {};
        }
    
        this.subscriptions[eventName][id] = callback;
        this.filters[eventName][id] = eventFilter;

        return {
            unsubscribe: () => {
                delete this.subscriptions[eventName][id];
                delete this.filters[eventName][id];
                if (Object.keys(this.subscriptions[eventName]).length === 0){
                    delete this.subscriptions[eventName];
                }
                if (Object.keys(this.filters[eventName]).length === 0){
                    delete this.filters[eventName];
                }
            }
        }
    }
    
    trigger(eventName, eventPayload) {
        if(!this.subscriptions[eventName]){
            return;
        }
        Object.keys(this.subscriptions[eventName]).forEach(key => {
            if(this.filters[eventName][key](eventPayload)){
                this.subscriptions[eventName][key](eventPayload);
            }
        });
    }

}