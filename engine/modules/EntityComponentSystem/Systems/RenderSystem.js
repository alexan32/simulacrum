import { drawCircleCenter, drawImageCenter, drawRectCenter } from "../Utils/CanvasUtils.js";
import { entityManager, eventBus } from "../EntityComponentSystem.js";

const CANVAS = document.getElementById("canvas");

export const RENDER_LAYERS = {
    BACKGROUND: -1,
    GROUND: 0,
    DETAILS: 1,
    COLLISION: 2,
    ENTITY: 3,
    PLAYER: 4,
    FOREGROUND: 5,
    TOP: 6
};

export const defaultTransform = [1, 0, 0, 1, 0, 0];

// must add this component in order for an entity to part of the layered rendering
export class RenderLayerComponent{
    constructor(renderLayer=RENDER_LAYERS.ENTITY){
        this.componentKey = "renderLayer";
        this.sortValue = renderLayer;
    }
}

export class RenderSystem{
    
    constructor(){
        this.ctx = CANVAS.getContext('2d');
        this.id = "renderSystem";
        this.layerSorted = [];
        this.entityAddedSubscription = eventBus.on("entityAdded", this.layerSort.bind(this), (entity)=>{return entity.hasOwnProperty("renderLayer")});
        this.entityAddedSubscription = eventBus.on("entityRemoved", this.pruneLayerSorted.bind(this));
        this.debug = false;
    }

    setDebug(bool=true){
        this.debug = bool;
    }

    //use this function to add entity to layer rendering. kicked off automatically
    layerSort(entity){
        if(!entity.renderLayer){
            console.warn("entity was missing renderLayer component, and cannot be added to layer based rendering: ", entity);
        }
        let referenceObj = {id: entity.id, sortValue: entity.renderLayer.sortValue};
        this.layerSorted.push(referenceObj);
        this.layerSorted.sort((a, b) => { return a.sortValue - b.sortValue});
    }

    pruneLayerSorted(entityId){
        for(let i=0; i<this.layerSorted.length; i++){
            if(this.layerSorted[i].id === entityId){
                this.layerSorted.splice(i, 1);
                break;
            }
        }
    }

    draw(){

        // render layerSorted entities first
        for(let i=0; i<this.layerSorted.length; i++){
            const entity = entityManager.entityPool[this.layerSorted[i].id];
            if(entity.sprite && entity.position && entity.sprite.render){
                this.drawSprite(entity);
            }
        }

        // render remaining entities
        for(var key in entityManager.entityPool){
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            const entity = entityManager.entityPool[key];
            
            // skip entities that have renderLayer component
            if(entity.renderLayer){
                continue;
            }
            
            if(entity.sprite && entity.position && entity.sprite.render){
                this.drawSprite(entity);
            }
        }

        // render debug info
        if(this.debug){
            for(var key in entityManager.entityPool){
                const entity = entityManager.entityPool[key];
                this.drawDebug(entity);
            }
        }
    }

    drawSprite(entity){
        let {x, y, r} = entity.position;
        r += entity.sprite.rotation;
        let transform = JSON.parse(JSON.stringify(entity.sprite.transform));
        drawImageCenter(this.ctx, entity.sprite.image, x, y, r, transform);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawDebug(entity){
        if(entity.position && entity.dimension){
            const {x, y, r} = entity.position;
            const {w, h} = entity.dimension;
            this.ctx.strokeStyle = "green";
            drawRectCenter(this.ctx, x, y, w, h, r);
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        if(entity.position){
            const {x, y, r} = entity.position;
            this.ctx.strokeStyle = "red";
            drawCircleCenter(this.ctx, x, y, 3);
        }
    }

}