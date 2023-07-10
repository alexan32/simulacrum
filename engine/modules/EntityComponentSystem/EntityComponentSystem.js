import { EventBus } from "../Logic/EventBus.js";
import { uuidv4 } from "./Utils/Utils.js";
export const eventBus = new EventBus();

/*
Entity's are an object with an id that act as a container for components. Components are aspects
of a game entity, such as health, position, velocity, etc. Components are objects. Optionally, 
an entity can be given a "update" and "draw" function directly, but component updates are supposed
to be handled by a "System" relating to that component. (example: render system handles the "draw"
function for the sprite component.)
*/
export class Entity{

    constructor(id=null){
        this.id = id;
    }
    
    addComponent(component){

        if(!component.componentKey){
            const addedKey = uuidv4();
            console.warn("component was missing component key! using unique id: ", addedKey);
            component.componentKey = addedKey;
        }
        
        // "update" and "draw" functions called directly from "EntityFunctionSystem"
        // code is here to allow input like myEntity.addComponent({"update": (delta)=>{...}});
        // better practice might be to do myEntity["update"] = (delta)=>{...};
        if(component.componentKey == "update"){
            this["update"] = component.update;
        }
        else if(component.componentKey == "draw"){
            this["draw"] = component.draw;
        }

        this[component.componentKey] = component;
        return component.componentKey;
    }

    removeComponent(componentKey){
        delete this[componentKey];
    }
}


/*
EntityManager maintains a list of all current entities inside of the "entityPool" child object, and ensures
that each entity has a unique id. 
*/
class EntityManager{
    
    constructor(){
        this.idCounter = 0;
        this.entityPool = {};
    }

    addEntity(entity){
        if(!entity.id){
            entity["id"] = `${this.idCounter}`;
            this.idCounter += 1;
        }
        this.entityPool[entity.id] = entity;
        eventBus.trigger("entityAdded", entity);
        return entity.id;
    }

    removeEntityById(id){
        let entity = this.entityPool[id];
        if(entity.onDestroy){
            entity.onDestroy();
        }
        eventBus.trigger("entityRemoved", id);
        delete this.entityPool[id];
    }

    removeEntity(entity){
        if(entity.onDestroy){
            entity.onDestroy();
        }
        eventBus.trigger("entityRemoved", entity.id);
        delete this.entityPool[entity.id];
    }
}

/*
SystemManager maintains a collection of all "System" objects inside of the "systemPool" child object.
similar to EntityManager, it makes sure systems have a unique id. It is used to call the "update",
"checkCollision", and "draw" functions inside of each system.
*/
class SystemManager{
    constructor(){
        this.idCounter = 0;
        this.systemPool = {};
    }

    addSystem(system){
        if(!system.id){
            system["id"] = `${this.idCounter}`;
            this.idCounter += 1
        }
        this.systemPool[system.id] = system;
        return system.id;
    }

    update(delta){
        for(const key in this.systemPool){
            if(this.systemPool[key].update){
                this.systemPool[key].update(delta);
            }
        }
    };

    checkCollision(){
        for(const key in this.systemPool){
            if(this.systemPool[key].checkCollision){
                this.systemPool[key].checkCollision();
            }
        }
    };

    handleCollision(){
        for(const key in this.systemPool){
            if(this.systemPool[key].handleCollision){
                this.systemPool[key].handleCollision();
            }
        }
    }

    draw(){
        for(const key in this.systemPool){
            if(this.systemPool[key].draw){
                this.systemPool[key].draw();
            }
        }
    };
}

/*
"Game" object uses exported object instances declared here. This way same instance of objects are used anywhere in either
game engine code, or the code used by game developer. 
*/
export const entityManager = new EntityManager();
export const systemManager = new SystemManager();