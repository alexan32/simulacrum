
class Controller{

    constructor(){
        this.pressed = {};
        this.mouseX = 0;
        this.mouseY = 0;

        // KEYBOARD 
        window.addEventListener("keydown", this.onKeyDownEvent.bind(this));
        window.addEventListener("keyup", this.onKeyUpEvent.bind(this));
        
        const CANVAS = document.getElementById("canvas");

        // MOUSE
        CANVAS.addEventListener("mousemove", this.onMouseMove.bind(this));
        CANVAS.addEventListener("mousedown", this.onMouseDown.bind(this));
        CANVAS.addEventListener("mouseup", this.onMouseUp.bind(this));

        // PREVENT RIGHT CLICK MENU
        CANVAS.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
        });
    }

    onKeyDownEvent(event){
        this.pressed[event.code] = true;
    }

    onKeyUpEvent(event){
        delete this.pressed[event.code];
    }

    onMouseDown(event){
        this.pressed[`MOUSE_${event.button}`] = true;
    }

    onMouseUp(event){
        delete this.pressed[`MOUSE_${event.button}`];
    }

    onMouseMove(event){
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
    }

}

export const controller = new Controller();