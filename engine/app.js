import { Game } from "./modules/Game.js";
import { entityManager, systemManager} from "./modules/EntityComponentSystem/EntityComponentSystem.js"

const FPS = 60;
const interval = 1000 / FPS;
let then;
const game = new Game();

let actualFps;

function gameloop(timestamp) {
    if (!game.state.paused) {
        // set 'then' variable the first time
        if (then === undefined) {
            then = timestamp;
        }

        const delta = timestamp - then;
        window.requestAnimationFrame(gameloop);
        if (delta > interval) {
            game.update(delta);
            game.checkCollision();
            game.handleCollision();
            game.draw();
            then = timestamp - (delta % interval);
            return;
        }
        
    }
    if (game.state.paused) {
        return game.scene.drawPause();
    }
}

export class Application{
    constructor(debug=false){
        this.game = game;
        this.gameloop = gameloop;
        this.entityManager = entityManager;
        this.systemManager = systemManager;
        if(debug){
            game.debug = true;
        }
    }

    start(){
        window.requestAnimationFrame(this.gameloop);
    }
}