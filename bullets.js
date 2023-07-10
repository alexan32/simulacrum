import { DimensionComponent, PositionComponent, SpriteComponent, VelocityComponent } from "./engine/modules/EntityComponentSystem/Components.js";
import { Entity, entityManager } from "./engine/modules/EntityComponentSystem/EntityComponentSystem.js";
import { RENDER_LAYERS, RenderLayerComponent, defaultTransform } from "./engine/modules/EntityComponentSystem/Systems/RenderSystem.js";
import { TimerComponent } from "./engine/modules/EntityComponentSystem/Systems/TimerSystem.js";
import { angleRadians } from "./engine/modules/EntityComponentSystem/Utils/Utils.js";

let counter = 0;
let bulletImage = document.createElement("img");
bulletImage.src = "./assets/bullet.png";

export function createProjectile(x, y, x2, y2, velocity){

    // const theta = (x2 -x) / (y2 -2);
    const theta = angleRadians(x, y, x2, y2);
    const vX = Math.cos(theta) * velocity;
    const vY = Math.sin(theta) * velocity;

    const projectile = new Entity(`b${counter}`);
    counter ++;
    projectile.addComponent(new PositionComponent(x, y, theta));
    const dimension = new DimensionComponent("rectangle", 3, 1, 0, true, true);
    dimension.onCollision = (collisionData)=>{
        console.log(collisionData);
    }
    projectile.addComponent(dimension);
    projectile.addComponent(new VelocityComponent(vX, vY));
    projectile.addComponent(new SpriteComponent(bulletImage, defaultTransform, Math.PI/2));
    projectile.addComponent(new RenderLayerComponent());
    const timer = new TimerComponent(2.0);
    timer.addCallback(()=>{entityManager.removeEntity(projectile)});
    projectile.addComponent(timer);

    entityManager.addEntity(projectile);
}
