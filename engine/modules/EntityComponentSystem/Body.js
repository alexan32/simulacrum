// Body class is component operated on by physics system. Holds shape data for collision detection
export class Body{
    constructor(shape, collision=false, solid=false){
        this.shape = shape;
        this.boundingBox = {x:0, y:0, w:0, h:0};
        this.collision = collision;
        this.solid = solid;
    }
    onCollisionStart(){}
    onCollision(){}
    onCollisionExit(){}
}

// SHAPE CLASSES ==============================================================

export class Rectangle{
    constructor(width, height, rotation){
        this.type = "rectangle";
        this.width = width;
        this.height = height;

        this.rotation = rotation;
        this.lastRotation = rotation;   // lastRotation is used to detect change in rotation. if detected, update boundingBox
    }

    getBoundingBox(){}
}

export class Polygon{
    constructor(vertices, rotation){
        this.type = "polygon";
        this.vertices = vertices;

        this.rotation = rotation;
        this.lastRotation = rotation;
    }

    getBoundingBox(){}
}

export class Circle{
    constructor(radius, rotation){
        this.type = "circle";
        this.radius = radius;
        this.rotation = rotation;

        this.boundingBox = {
            x: -radius,
            y: radius,
            w: 2*radius,
            h: 2*radius
        }
    }

    getBoundingBox(){
        return {
            x: -this.radius,
            y: this.radius,
            w: 2*this.radius,
            h: 2*this.radius
        }
    }
}