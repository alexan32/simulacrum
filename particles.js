import { PositionComponent, VelocityComponent } from "./engine/modules/EntityComponentSystem/Components.js";
import { Entity } from "./engine/modules/EntityComponentSystem/EntityComponentSystem.js";
import { entityManager } from "./engine/modules/EntityComponentSystem/EntityComponentSystem.js";
import { TimerComponent } from "./engine/modules/EntityComponentSystem/Systems/TimerSystem.js";
import { fillRectCenter } from "./engine/modules/EntityComponentSystem/Utils/CanvasUtils.js";

let counter = 0;

function createExplosionParticles(x, y, count, velocity, ctx){
    for(let i=0; i<count; i++){
        let particle = new Entity();
        counter ++;
        
        // destroy particle after 1 second
        let timer = new TimerComponent(1.0, true);
        timer.addCallback(()=>{
            entityManager.removeEntity(particle);
        });
        particle.addComponent(timer);

        // give particle a random starting position and velocity
        particle.addComponent(new PositionComponent(x, y));
        particle.addComponent(new VelocityComponent((Math.random() * 2-1) * velocity, (Math.random() * 2-1) * velocity));

        //particle draw function
        particle["draw"] = ()=>{
            ctx.fillStyle = `rgb(${255 * (1-particle.timer.elapsed)},${165 * (1-particle.timer.elapsed)},0)`;
            fillRectCenter(ctx, particle.position.x, particle.position.y, 4*(1 -particle.timer.elapsed), 4*(1 -particle.timer.elapsed), 0);
        }
        entityManager.addEntity(particle);
    }
}

export function initializeParticle(application){

    let ctx = application.game.ctx;

    const particleSpawner = new Entity("particleSpawner");
    particleSpawner.addComponent(new PositionComponent(100, 100));
    
    // spawn 300 particles every 3 seconds
    let timerComponent = new TimerComponent(3.0);
    timerComponent.addCallback(()=>{
        timerComponent.reset();
        createExplosionParticles(particleSpawner.position.x, particleSpawner.position.y, 300, 100, ctx);
    });
    particleSpawner.addComponent(timerComponent);

    entityManager.addEntity(particleSpawner);
}