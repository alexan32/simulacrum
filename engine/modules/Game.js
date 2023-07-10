import { controller } from './Controller/Controller.js';
import { GameState } from './Logic/GameState.js';
import { entityManager, eventBus, systemManager } from './EntityComponentSystem/EntityComponentSystem.js';
import { RenderSystem } from './EntityComponentSystem/Systems/RenderSystem.js';
import { EntityFunctionSystem } from './EntityComponentSystem/Systems/EntityFunctionSystem.js';
import { TimerSystem } from './EntityComponentSystem/Systems/TimerSystem.js';
import { audioSystem } from './EntityComponentSystem/Systems/AudioSystem.js';
import { PhysicsSystem } from './EntityComponentSystem/Systems/PhysicsSystem.js';

const CANVAS = document.getElementById("canvas");
const CANVASWIDTH = 1000;
const RATIO = 16 / 9;

export class Game {

    constructor() {

        // game children && systems that don't go through a system manager
        this.state = new GameState();
        this.controller = controller;
        this.entityManager = entityManager;
        this.systemManager = systemManager;
        this.eventBus = eventBus;

        // base systems
        this.systemManager.addSystem(new EntityFunctionSystem());
        this.systemManager.addSystem(new RenderSystem());
        this.systemManager.addSystem(new TimerSystem());
        this.systemManager.addSystem(new PhysicsSystem());
        this.systemManager.addSystem(audioSystem);

        // canvas set up
        CANVAS.width = CANVASWIDTH;
        CANVAS.height = CANVASWIDTH / RATIO;
        this.ctx = CANVAS.getContext('2d');

        // FPS counter
        this.debug = false;
        this.actualFps = 0;
    }

    update(delta) {
        // this.actualFps = Math.floor(1.0/delta * 1000);      // this is busted? not accurate at present
        this.systemManager.update(delta);
    }

    checkCollision() {
        this.systemManager.checkCollision();
    }

    handleCollision(){
        this.systemManager.handleCollision();
    }

    draw() {
        this.ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        this.systemManager.draw();
        if(this.debug){
            this.ctx.font = "12px serif";
            this.ctx.fillText(`${this.actualFps}`, 3, 12);
        }
    }

}