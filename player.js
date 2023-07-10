import { DimensionComponent, HealthComponent, PositionComponent, SpriteComponent, VelocityComponent } from "./engine/modules/EntityComponentSystem/Components.js";
import { Entity } from "./engine/modules/EntityComponentSystem/EntityComponentSystem.js";
import { audioSystem } from "./engine/modules/EntityComponentSystem/Systems/AudioSystem.js";
import { RENDER_LAYERS, RenderLayerComponent } from "./engine/modules/EntityComponentSystem/Systems/RenderSystem.js";
import { State, StateMachine } from "./engine/modules/Logic/StateMachine.js";
import { Gun } from "./Gun.js";


export function initializePlayer(application){

    // Player audio
    const leftFootPlay = new State({
        "audioEnd": "LEFTFOOTEND"
    });
    const leftFootEnd = new State({
        "audioStart": "RIGHTFOOTPLAY"
    });
    const rightFootPlay = new State({
        "audioEnd": "RIGHTFOOTEND"
    });
    const rightFootEnd = new State({
        "audioStart": "LEFTFOOTPLAY"
    });
    const stepStateMachine = new StateMachine("RIGHTFOOTEND", {
        "LEFTFOOTEND": leftFootEnd,
        "RIGHTFOOTEND": rightFootEnd,
        "LEFTFOOTPLAY": leftFootPlay,
        "RIGHTFOOTPLAY": rightFootPlay
    });

    const stepSoundOne = document.createElement("audio");
    stepSoundOne.src = "./assets/audio/sfx/stepstone_1.wav";
    audioSystem.addTrackByElement(stepSoundOne, "playerStep1");
    stepSoundOne.addEventListener("ended", (event)=>{stepStateMachine.update("audioEnd")});
    leftFootPlay.onEnter = ()=>{
        audioSystem.stop("playerStep1");
        audioSystem.play("playerStep1");
    }

    const stepSoundTwo = document.createElement("audio");
    stepSoundTwo.src = "./assets/audio/sfx/stepstone_2.wav";
    audioSystem.addTrackByElement(stepSoundTwo, "playerStep2");
    stepSoundTwo.addEventListener("ended", (event)=>{stepStateMachine.update("audioEnd")});
    rightFootPlay.onEnter = ()=>{
        audioSystem.stop("playerStep2");
        audioSystem.play("playerStep2");
    }

    // Player Entity
    // const PLAYER = document.getElementById("player");
    const PLAYER = document.createElement("img");
    PLAYER.src = "./assets/player.png";
    let player = new Entity("player");
    player.addComponent(new PositionComponent(200, 100));
    player.addComponent(new VelocityComponent(0, 0));
    const playerDimension = new DimensionComponent("rectangle", 20, 20, 0, true, true);
    playerDimension.onCollision = (collsionData)=>{
        // console.log(collsionData);
    }
    player.addComponent(playerDimension);
    player.addComponent(new SpriteComponent(PLAYER, [1, 0, 0, 1, 5, 5]));
    player.addComponent(new HealthComponent(100));
    player.addComponent(new RenderLayerComponent(RENDER_LAYERS.PLAYER));
    player["speed"] = 100;
    player["gun"] = new Gun(300, 15, 1000, 1000);
    

    // Player System
    const controller = application.game.controller;
    const playerSystem = {
        update: (delta)=>{
            // if(Object.keys(controller.pressed).length > 0){
            //     console.log(controller.pressed);
            // }
            let y = 0;
            let x = 0;
            if(controller.pressed["KeyA"]){
                x--;
            }
            if(controller.pressed["KeyD"]){
                x++;
            }
            if(controller.pressed["KeyW"]){
                y--;
            }
            if(controller.pressed["KeyS"]){
                y++;
            }
            y = y * player.speed;
            x = x * player.speed;
            if(x!= 0 && y!= 0){
                x/= Math.SQRT2;
                y/= Math.SQRT2;
            }
            if(x!=0 || y!=0){
                // player.position.r = Math.atan2(y, x);
                stepStateMachine.update("audioStart");
            }else{
                stepStateMachine.currentState = "RIGHTFOOTEND";
            }
            
            // player rotation
            let theta = Math.atan2( controller.mouseY - player.position.y, controller.mouseX - player.position.x);
            let deltaR = theta - player.position.r;
            if(Math.abs(deltaR) > Math.PI){
                if(deltaR > 0){
                    deltaR -= 2 * Math.PI
                }else{
                    deltaR += 2 * Math.PI
                }
            }
            player.velocity.r = deltaR * 10;
            player.velocity.x = 0 + x;
            player.velocity.y = 0 + y;

            // gun controls
            if(controller.pressed["KeyR"]){
                player.gun.reload();
            }
            if(controller.pressed["MOUSE_0"]){
                player.gun.shoot(player.position.x, player.position.y, controller.mouseX, controller.mouseY)
            }
        }
    }

    application.entityManager.addEntity(player);
    application.systemManager.addSystem(playerSystem);
}