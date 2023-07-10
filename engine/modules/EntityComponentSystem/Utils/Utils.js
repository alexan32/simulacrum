
// wait for x milliseconds
export const delay = ms => new Promise(res => setTimeout(res, ms));

// generate a unique id. credit to some dude on stack overflow.
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function distanceBetweenTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

export function angleRadians(x1, y1, x2, y2){
    return Math.atan2(y2-y1, x2-x1);
}

export function angleDegrees(x1, y1, x2, y2){
    return Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
}

// returns true if rectangle i is fully inside rectangle v.
// 1 is top left, 2 is bottom right
export function rectangleContains(v1, v2, i1, i2){
    return (v1.x <= i1.x && v1.y <= i1.y && i2.x <= v2.x && i2.y <= v2.y);
}

// only works if regtangles do not rotate
export function rectanglesIntersect(v1, v2, i1, i2){
    // left or right
    if(v2.x <= i1.x || i2.x <= v1.x){
        return false;
    }
    // above or below
    if(v2.y <= i1.y || v1.y >= i2.y){
        return false;
    }
    return true;
}

export function pointInCircle(x, y, cx, cy, cr){
    return  distanceBetweenTwoPoints(x, y, cx, cy) <= cr
}

export function readJsonFile(pathToFile){
    console.log("Loading json file from path: ", pathToFile);
    var request = new XMLHttpRequest();
    request.open("GET", pathToFile, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

// returns list of vertices in clockwise order
export function getRectangleCorners(centerX, centerY, w, h, r){

    const halfW = 0.5 * w;
    const halfH = 0.5 * h;
    const distance = Math.sqrt(Math.pow(halfW, 2) + Math.pow(halfH, 2));
    const aTheta = Math.atan2(halfH, halfW);
    const bTheta = Math.atan2(halfH, -halfW);
    const cTheta = Math.atan2(-halfH, -halfW);
    const dTheta = Math.atan(-halfH, halfW);

    const A = {x: centerX + (distance * Math.cos(r + aTheta)), y: centerY + (distance * Math.sin(r + aTheta))};
    const B = {x: centerX + (distance * Math.cos(r + bTheta)), y: centerY + (distance * Math.sin(r + bTheta))};
    const C = {x: centerX + (distance * Math.cos(r + cTheta)), y: centerY + (distance * Math.sin(r + cTheta))};
    const D = {x: centerX + (distance * Math.cos(r + dTheta)), y: centerY + (distance * Math.sin(r + dTheta))};
    return [D, C, B, A];
}

// works on separating axis theorem. NGL, i straight up borrowed this from online. hard to explain
// https://stackoverflow.com/questions/42464399/2d-rotated-rectangle-collision
export function polygonsIntersect(a, b){
    return !hasSeparatingAxis(a, b) && !hasSeparatingAxis(b, a);
}

// winding order is clockwise! make sure polygon vertices array is in correct order
export function hasSeparatingAxis(a, b){
    
    for(let i = 0; i < a.length; i++){

        // create axis from line segment
        const normal_x = a[(i+1) % a.length].y - a[i].y;
        const normal_y = a[i].x - a[(i+1) % a.length].x;

        // check that all b points are on other side of that line
        for(let j = 0; j < b.length; j++){
            const dot_product = ((b[j].x - a[i].x) * normal_x) + ((b[j].y - a[i].y) * normal_y);
            if(dot_product >= 0.0){
                break;
            } // change sign of test based on winding order
            if(j == b.length - 1){
                return true
            }
        }
   }
   return false;
}

export function loadImage(pathToResource){
    return new Promise(resolve => {
        var img = new Image();
        img.src = pathToResource;
        img.addEventListener('load', ()=>{
            resolve(img);
        });
    })
}