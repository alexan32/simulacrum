import { DimensionComponent, PositionComponent, SpriteComponent, VelocityComponent } from "./engine/modules/EntityComponentSystem/Components.js";
import { Entity, entityManager } from "./engine/modules/EntityComponentSystem/EntityComponentSystem.js";
import { RENDER_LAYERS, RenderLayerComponent } from "./engine/modules/EntityComponentSystem/Systems/RenderSystem.js";

export function initializeTerrain(application){
    
    // BACKGROUND
    // const background = new Entity("background");
    // const backgroundImage = document.createElement("img");
    // backgroundImage.src = "./assets/terrain.png";

    // background.addComponent(new PositionComponent(0,0));
    // background.addComponent(new SpriteComponent(backgroundImage, [1, 0, 0, 1, 500, 500], 0, true));
    // background.addComponent(new RenderLayerComponent(RENDER_LAYERS.BACKGROUND));
    // entityManager.addEntity(background);

    // CRATE
    const crate = new Entity("crate");
    const crateImage = document.createElement("img");
    crateImage.src = "./assets/crate.png";

    crate.addComponent(new PositionComponent(400, 200, Math.PI/4));
    crate.addComponent(new DimensionComponent("rectangle", 41, 41, 0, true, true));
    crate.addComponent(new SpriteComponent(crateImage, [1, 0, 0, 1, 0, 0], 0, true));
    crate.addComponent(new RenderLayerComponent(RENDER_LAYERS.ENTITY));
    entityManager.addEntity(crate);

    // const crateTwo = new Entity("createTwo");
    // crateTwo.addComponent(new PositionComponent(400, 230, 0));
    // const dimension = new DimensionComponent("rectangle", 41, 41, 0, true, true);
    // dimension.onCollision = (data) => {console.log(data)};
    // crateTwo.addComponent(dimension);
    // crateTwo.addComponent(new SpriteComponent(crateImage, [1, 0, 0, 1, 0, 0], 0, true));
    // crateTwo.addComponent(new VelocityComponent(0, 0));
    // crateTwo.addComponent(new RenderLayerComponent(RENDER_LAYERS.ENTITY));
    // entityManager.addEntity(crateTwo);
}