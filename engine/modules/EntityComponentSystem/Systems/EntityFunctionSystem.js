import { entityManager } from "../EntityComponentSystem.js";

// allows you to set a "update" and "draw" function directly inside of entity instead
// of using a component class

export class EntityFunctionSystem{
    constructor(){
        this.id = "updateDraw";
    }

    update(delta){
        for(const key in entityManager.entityPool){
            let entity = entityManager.entityPool[key];
            if(entity.update){
                entity.update(delta);
            }
        }
    }

    draw(){
        for(const key in entityManager.entityPool){
            let entity = entityManager.entityPool[key];
            if(entity.draw){
                entity.draw();
            }
        }
    }

    checkCollision(){
        for(const key in entityManager.entityPool){
            let entity = entityManager.entityPool[key];
            if(entity.checkCollision){
                entity.checkCollision();
            }
        }
    }

    handleCollision(){
        for(const key in entityManager.entityPool){
            let entity = entityManager.entityPool[key];
            if(entity.handleCollision){
                entity.handleCollision();
            }
        }
    }
}