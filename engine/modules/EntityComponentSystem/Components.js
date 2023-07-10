// All component classes must have a componentKey or else will be assigned a random key

export class SpriteComponent{
    constructor(image, transform=[1, 0, 0, 1, 0, 0], rotation=0, render=true){
        this.componentKey = "sprite"
        this.image = image;
        this.render = render;
        this.transform = transform;
        this.rotation = rotation;
    }
}

export class PositionComponent{
    constructor(x, y, r=0){
        this.componentKey = "position"
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

export class VelocityComponent{
    constructor(x=0, y=0, r=0){
        this.componentKey = "velocity";
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

export class DimensionComponent{
    constructor(type, width, height, radius, collision=false, solid=false){
        if(["rectangle, circle"].indexOf(type) != -1){
            console.error("Dimension component type must be \"circle\" or \"rectangle\". recieved: ", type);
            return;
        }
        this.componentKey = "dimension";
        this.type=type;
        this.collision = collision;         // whether to perform collision check or not
        this.solid = solid;                 // two solid entities cannot take up the same space
        this.w = width;
        this.h = height;
        this.r = radius;


    }
    onCollision(collisionData){};
}

export class HealthComponent{
    constructor(count){
        this.componentKey = "health";
        this.count = count;
    }
}


