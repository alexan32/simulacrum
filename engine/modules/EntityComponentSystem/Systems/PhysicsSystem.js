import { entityManager, eventBus } from "../EntityComponentSystem.js";
import { distanceBetweenTwoPoints, getRectangleCorners, hasSeparatingAxis, polygonsIntersect } from "../Utils/Utils.js";

export class PhysicsSystem{

    constructor(){
        this.id = "physicsSystem";
        this.collisionCheck = {};
        this.moveList = {};
        this.collisions = [];
        eventBus.on("entityAdded", this.addCollisionCheck.bind(this), (entity)=>{return entity.hasOwnProperty("dimension")});
        eventBus.on("entityRemoved", this.removeCollisionCheck.bind(this));
    }

    addCollisionCheck(entity){
        this.collisionCheck[entity.id] = entity;
    }

    removeCollisionCheck(id){
        if(id in this.collisionCheck){
            delete this.collisionCheck[id];
        }
    }


    // during update, physics system collects list of all entities that want to move
    update(delta){
        this.moveList = {};

        const deltaInSeconds = delta / 1000;

        for(const key in entityManager.entityPool){
            const entity = entityManager.entityPool[key];

            // Update movement
            if(entity.position && entity.velocity && (entity.velocity.x !=0 || entity.velocity.y != 0 || entity.velocity.r != 0)){
                
                // if entity is solid, save old position in case we need to undo move after collision detection
                if(entity.dimension && entity.dimension.solid){
                    this.moveList[entity.id] = {
                        x: entity.position.x,
                        y: entity.position.y,
                        r: entity.position.r
                    }
                }
                
                entity.position.x += entity.velocity.x * deltaInSeconds;
                entity.position.y += entity.velocity.y * deltaInSeconds;
                entity.position.r += entity.velocity.r * deltaInSeconds;
                
                // prevents rotational issues that occur when radians are beyond certain range by
                // adding or subtracting 360 degrees
                if(entity.position.r > 2 * Math.PI){
                    entity.position.r -= 2 * Math.PI;
                }else if(entity.position.r < -Math.PI){
                    entity.position.r += 2 * Math.PI;
                }

            }

        }

    }

    // during checkCollision, if enitity from move list is also in collision check, check for collision and modify
    // movement accordingly
    checkCollision(){
        this.collisions = [];

        for(const x in this.collisionCheck){
            let entity = entityManager.entityPool[x];
            for(const y in entityManager.entityPool){
                if(y !== x){
                    let target = entityManager.entityPool[y];
                    if(!target.dimension){
                        continue;
                    }


                    this.performCollisionCheck(entity, target);

                    // perform checks to prevent "tunneling" aka "bullet through paper"
                    // https://gamedev.stackexchange.com/questions/192400/in-games-physics-engines-what-is-tunneling-also-known-as-the-bullet-through
                    if(x in this.moveList){
                        const start = this.moveList[x];
                        for(let i=0; i< distanceBetweenTwoPoints(start.x, start.y, entity.position.x, entity.position.y); i+=3){
                            
                        }
                    }

                    if(entity.dimension.type == "rectangle" && target.dimension.type == "rectangle"){
                        if(this.rectangleOnRectangleCollisionCheck(entity, target)){
                            this.collisions.push({
                                "A": entity,
                                "B": target,
                                "solid": entity.dimension.solid && target.dimension.solid
                            });
                        }
                    }
                }
            }
        }
    }

    performCollisionCheck(entity, target){
        if(entity.dimension.type == "rectangle" && target.dimension.type == "rectangle"){
            if(this.rectangleOnRectangleCollisionCheck(entity, target)){
                this.collisions.push({
                    "A": entity,
                    "B": target,
                    "solid": entity.dimension.solid && target.dimension.solid
                });
            }
        }
    }

    handleCollision(){
        // move solid entity collisions to prevent interesection
        for(let i=0; i<this.collisions.length; i++){
            const collisionData = this.collisions[i];
            if(collisionData.solid){
                const aMove = this.moveList[collisionData.A.id];
                // const bMove = this.moveList[collisionData.B.id];
                // console.log(aMove);
                // collisionData.A.position.x = aMove.x;
                // collisionData.A.position.y = aMove.y;
                // collisionData.B.position.x = bMove.x;
                // collisionData.B.position.y = bMove.y;
            }
        }

        // fire "onCollision" callback from dimension component.
        // should be done last in case callback involves entity deletion
        for(let i=0; i<this.collisions.length; i++){
            const collisionData = this.collisions[i];
            collisionData.A.dimension.onCollision(collisionData);
            collisionData.B.dimension.onCollision(collisionData);
        }
    }

    rectangleOnRectangleCollisionCheck(A, B){

        // 1. to improve performance, first do a simple check that the
        // distance between two entities is too great for a collision to occur
        let radiusA = distanceBetweenTwoPoints(0, 0, 0.5 * A.dimension.w, 0.5 * A.dimension.h);
        let radiusB = distanceBetweenTwoPoints(0, 0, 0.5 * B.dimension.w, 0.5 * B.dimension.h);
        if(distanceBetweenTwoPoints(A.position.x, A.position.y, B.position.x, B.position.y) > radiusA + radiusB){
            return false;
        }

        //2. calculate collision using seperate axis theorem
        let polygonA = getRectangleCorners(A.position.x, A.position.y, A.dimension.w, A.dimension.h, A.position.r);
        let polygonB = getRectangleCorners(B.position.x, B.position.y, B.dimension.w, B.dimension.h, B.position.r);
        const result = polygonsIntersect(polygonA, polygonB);
        return result
    }

    circleOnCircleCollisionCheck(A, B){
        const aToB = distanceBetweenTwoPoints(A.position.x, A.position.y, B.position.x, B.position.y);
        return (aToB < A.dimension.r + B.dimension.r);
    }
}
