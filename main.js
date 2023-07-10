import { Application } from "./engine/app.js";
import { initializePlayer } from "./player.js";
import { initializeParticle } from "./particles.js";
import { initializeTerrain } from "./terrain.js";
import { DimensionComponent } from "./engine/modules/EntityComponentSystem/Components.js";
import { polygonsIntersect } from "./engine/modules/EntityComponentSystem/Utils/Utils.js";

const application = new Application(false);

let renderSystem = application.systemManager.systemPool["renderSystem"];
renderSystem.setDebug(true);

initializePlayer(application);
initializeTerrain(application);

console.log(application.entityManager);
console.log(application.systemManager);

application.start();

// let A = [{x: -1, y: 1}, {x: 1, y: 1}, {x: 1, y:-1}, {x:-1, y:-1}];
// let B = [{x: 2, y: 1}, {x: 4, y: 1}, {x: 4, y:-1}, {x:2, y:-1}];

// console.log(polygonsIntersect(A, B));