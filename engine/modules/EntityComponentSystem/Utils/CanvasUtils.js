
export function drawImageCenter(ctx, image, x, y, r, transform){
    // ctx.setTransform(...transform);
    var cornerX = x - image.width/2 + transform[4];
    var cornerY = y - image.height/2 + transform[5];
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(r);
    ctx.drawImage(image, cornerX-x, cornerY-y);
} 

export function drawRectCenter(ctx, x, y, w, h, r){

    //x & y is the logical position
    //cornerX and cornerY is the canvas position
    var cornerX = x-w/2;
    var cornerY = y-h/2;

    // console.log(x, y, cornerX, cornerY, w, h, r);
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(r);

    ctx.beginPath();
    ctx.rect(cornerX-x, cornerY-y, w, h);
    ctx.stroke();
}

export function fillRectCenter(ctx, x, y, w, h, r){

    //x & y is the logical position
    //cornerX and cornerY is the canvas position
    var cornerX = x-w/2;
    var cornerY = y-h/2;

    // console.log(x, y, cornerX, cornerY, w, h, r);
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(r);

    ctx.fillRect(cornerX-x, cornerY-y, w, h);
}

export function drawCircleCenter(ctx, x, y, r){
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(x, y, r, 0, 2* Math.PI);
    ctx.stroke();
}