const M_PI = 3.14159265358979323846;
const INT_MAX = 2147483647;

export class Map2D {
    map2D = [];
    height = 0;
    width = 0;

    constructor(map_text) {
        let buf = map_text.split("\n");
        let temp_map2D = buf.map((row) => row.split(''));
        let block_id_count = 0;
        for(let i = 0; i < temp_map2D.length; i++){
            let row = [];
            for(let j = 0; j < temp_map2D[i].length; j++){
                row.push({
                    value: temp_map2D[i][j],
                    block_id: block_id_count++,
                });
            }
            this.map2D.push(row);
        }
        let dim = this.setDimensions();
        this.height = dim.maxColLenght;
        this.width = dim.maxRowLenght;
    }
    setDimensions() {
        let maxRowLenght = 0;
        let maxColLenght = 0;
        this.map2D.forEach((row, i) => {
            if (row.length > maxRowLenght) {
                maxRowLenght = row.length;
            }
            if (i > maxColLenght) {
                maxColLenght = i;
            }
        })
        maxColLenght += 1;
        return { maxRowLenght, maxColLenght };
    }
    printMap() {
        this.map2D.forEach((row) => {
            console.log(row.join(''));
        })
    }

    getMap() {
        return this.map2D;
    }

    getDimensions() {
        return { height: this.height, width: this.width };
    }

}

export class Entity {
    direction = 0
    position = {
        x: 0,
        y: 0
    }
    constructor(position_, direction_){
        this.position.x = position_.x
        this.position.y = position_.y
        this.direction = direction_
    }
}

export class Player extends Entity {
    FOV = 0;
    RESOLUTION = 0;
    dimension = { width: 0, height: 0 };
    map2D = null;
    tile_size = 0;
    map_height = 0;
    map_width = 0;
    constructor(conf, map2D, position, direction) {
        super({x: position.x, y:position.y},direction);
        this.FOV = conf.FOV;
        this.direction = conf.initial_direction;
        this.dimension.height = conf.dimensions.height;
        this.dimension.width = parseInt(conf.dimensions.width/conf.FOV)*conf.FOV;
        this.RESOLUTION = parseInt(this.dimension.width / this.FOV);
        this.map2D = map2D;
        this.tile_size = conf.tile_size;
        let map_dim = this.map2D.getDimensions();
        this.map_height = map_dim.height;
        this.map_width = map_dim.width;
        console.log("RayCaster constructor");
        console.log("direction " + this.direction)
        console.log("position x " + this.position.x + " y " + this.position.y)
        console.log("FOV " + this.FOV)
        console.log("dimension height " + this.dimension.height + " width " + this.dimension.width)
        console.log("RESOLUTION " + this.RESOLUTION)
        console.log("tile_size " + this.tile_size)
        console.log("----------------------")
    }

    getDecimals(num) {
        return num % 1;
    }

    setDimensions(width, height, fov) {
        this.dimension.width = parseInt(width/fov)*fov;
        this.dimension.height = height;
        this.RESOLUTION = parseInt(this.dimension.width / this.FOV);
    }

    getPlayerPosition() {
        return this.position;
    }


    findPlayer() {
        let player = { x: 0, y: 0 };
        this.map2D.map2D.forEach((row, i) => {
            row.forEach((col, j) => {
                if (col === 'P') {
                    player.x = j;
                    player.y = i;
                }
            })
        })
        return player;
    }

    getDirVars(angle, playerX, playerY) {
        if (angle < 90) {
            return {
                "x": this.tile_size - this.getDecimals(playerX),
                "y": this.getDecimals(playerY)
            };
        } else if (angle < 180) {
            return {
                "x": this.getDecimals(playerX),
                "y": this.getDecimals(playerY)
            };
        } else if (angle < 270) {
            return {
                "x": this.getDecimals(playerX),
                "y": this.tile_size - this.getDecimals(playerY)
            };
        } else {
            return {
                "x": this.tile_size - this.getDecimals(playerX),
                "y": this.tile_size - this.getDecimals(playerY)
            };
        }
    }

    turn(value) {
        if (value > 0) {
            this.direction = this.direction + value >= 360 ? this.direction = 0 + this.direction + value - 360 : this.direction + value;
        }else if (value < 0) {
            this.direction = this.direction + value < 0 ? this.direction = 360 + this.direction + value : this.direction + value;
        }else{
            return;
        }
    }

    move(key,player_speed) {
        let deltaX = 0;
        let deltaY = 0;
        if (key.w) {
            deltaY += -player_speed * Math.sin(this.direction * M_PI / 180);
            deltaX += player_speed * Math.cos(this.direction * M_PI / 180);
        }
        if (key.s) {
            deltaY += player_speed * Math.sin(this.direction * M_PI / 180);
            deltaX += -player_speed * Math.cos(this.direction * M_PI / 180);
        }
        if (key.a) {
            deltaY += -player_speed * Math.cos(this.direction * M_PI / 180);
            deltaX += -player_speed * Math.sin(this.direction * M_PI / 180);
        }
        if (key.d) {
            deltaY += player_speed * Math.cos(this.direction * M_PI / 180);
            deltaX += player_speed * Math.sin(this.direction * M_PI / 180);
        }
        if (deltaX !== 0 || deltaY !== 0) {
            let out_x = this.position.x + deltaX < 0 || this.position.x + deltaX >= this.map_width
            let out_y = this.position.y + deltaY < 0 || this.position.y + deltaY >= this.map_height
            if(!(out_x || out_y)){
                if (this.map2D.map2D[parseInt(this.position.y + deltaY)][parseInt(this.position.x + deltaX)].value === '#'){
                    if(this.map2D.map2D[parseInt(this.position.y)][parseInt(this.position.x + deltaX)].value === '#'){
                        deltaX = 0
                    }
                    if(this.map2D.map2D[parseInt(this.position.y + deltaY)][parseInt(this.position.x)].value === '#'){
                        deltaY = 0
                    }
                }
            }
            this.position.x += deltaX;
            this.position.y += deltaY;
        }
    }


    rayCastInTheFov() {
        let start = parseInt(this.direction - (this.FOV / 2));
        let end = parseInt(this.direction + (this.FOV / 2));
        let fov_array = []
        for (let i = end - 1; i >= start; i--) {
            for (let r = 0; r < this.RESOLUTION; r++) {
                let pre_angle = i % 360 - r / this.RESOLUTION;
                let angle = pre_angle < 0 ? pre_angle + 360 : pre_angle;
                let dirVal = this.getDirVars(angle, this.position.x, this.position.y);
                let angle_rad = (angle * M_PI / 180);
                let sinAngle = Math.sin(angle_rad);
                let cosAngle = Math.cos(angle_rad);
                let sinSign = sinAngle > 0 ? 1 : -1;
                let cosSign = cosAngle > 0 ? 1 : -1;
                let dptX = 0;
                let dptY = 0;
                let x_distance = 0;
                let y_distance = 0;
                
                while (true) {
                    if (angle === 0 || angle === 180) {
                        y_distance = INT_MAX;
                    } else {
                        y_distance = ((dirVal.y + (dptY * this.tile_size)) / Math.abs(sinAngle));
                    }
                    if (angle === 90 || angle === 270) {
                        x_distance = INT_MAX;
                    } else {
                        x_distance = ((dirVal.x + (dptX * this.tile_size)) / Math.abs(cosAngle));
                    }
                    let fov_index = (i - start) * this.RESOLUTION - r;
                    let fish_eye_correction = Math.cos((fov_index / this.RESOLUTION - this.FOV / 2) * M_PI / 180);
                    if (x_distance < y_distance) {
                        let dX = parseInt(this.position.x + (x_distance * cosAngle + this.tile_size / 2 * cosSign));
                        let dY = parseInt(this.position.y - (x_distance * sinAngle));
                        dptX += 1;
                        if(dY < 0 || dY > this.map_height || dX < 0 || dX > this.map_width){
                            fov_array.push({
                                distance: Math.abs(x_distance * fish_eye_correction),
                                block_id: null,
                                block_face: null
                            });
                            break;
                        }
                        if (this.map2D.map2D[dY][dX].value === '#' ) {
                            fov_array.push({
                                distance: Math.abs(x_distance * fish_eye_correction),
                                block_id: this.map2D.map2D[dY][dX].block_id,
                                block_face: cosSign === 1 ? 'W' : 'E'
                            });
                            break;
                        }

                    } else {
                        let dX = parseInt(this.position.x + (y_distance * cosAngle));
                        let dY = parseInt(this.position.y - (y_distance * sinAngle + this.tile_size / 2 * sinSign));
                        dptY += 1;
                        if(dY < 0 || dY >= this.map_height || dX < 0 || dX >= this.map_width){
                            fov_array.push({
                                distance: Math.abs(y_distance * fish_eye_correction),
                                block_id: null,
                                block_face: null
                            });
                            break;
                        }
                        if (this.map2D.map2D[dY][dX].value === '#') {
                            fov_array.push({
                                distance: Math.abs(y_distance * fish_eye_correction),
                                block_id: this.map2D.map2D[dY][dX].block_id,
                                block_face: sinSign === 1 ? 'N' : 'S'
                            });
                            break;
                        }
                        
                    }
                    
                }
            }
        }
        return fov_array;
    }
}

export class ScreenRenderer{
    drawScreen(ctx,canvas,fov_array,fov) {
        const screenCenter = canvas.height / 2;
        canvas.width = canvas.width; //metodo per cancellare il canvas strano, ma funziona, forse più veloce
        const margin = (canvas.width - parseInt(canvas.width/fov)*fov)/2
        let current_block = fov_array[0].block_id;
        let currentFace = fov_array[0].block_face;
        let current_block_start = 0;
        for(let i = 0; i < fov_array.length-1; i++) {
            if(fov_array[i+1].block_id !== current_block || fov_array[i+1].block_face !== currentFace || i+1 === fov_array.length-1) {
                ctx.beginPath();
                ctx.moveTo(current_block_start + margin, screenCenter + screenCenter / fov_array[current_block_start].distance);
                ctx.lineTo(i + margin, screenCenter + screenCenter / fov_array[i].distance);
                ctx.lineTo(i + margin, screenCenter - screenCenter / fov_array[i].distance);
                ctx.lineTo(current_block_start + margin, screenCenter - screenCenter / fov_array[current_block_start].distance);
                ctx.closePath();
                ctx.fillStyle = current_block === null ? "rgba(0,0,0,0)" : current_block.color;
                ctx.fill();
                // ctx.clip();
                // var img=new Image();
                // img.src="https://www.imgonline.com.ua/examples/rays-of-light-in-the-sky.jpg";
                // img.onload=function(){
                //     ctx.drawImage(img,0,0,canvas.width,canvas.height);
                // }
                // ctx.restore();
                current_block_start = i+1;
                current_block = fov_array[i+1].block_id;
                currentFace = fov_array[i+1].block_face;
            }
        }

    }
    drawMap(ctx,canvas, map2D, playerX, playerY) {
        let mapWidth = map2D[0].length;
        let mapHeight = map2D.length;
        let mapScale = canvas.height * 0.3 / mapWidth;
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, mapWidth * mapScale, mapHeight * mapScale);
        for(let i = 0; i < mapHeight; i++) {
            for(let j = 0; j < mapWidth; j++) {
                if(map2D[i][j].value === '#') {
                    ctx.fillStyle = "rgba(255, 0, 0, 1)";
                    ctx.fillRect(j * mapScale, i * mapScale, mapScale, mapScale);
                } else if(map2D[i][j].value === 'X') {
                    ctx.fillStyle = "rgba(0, 0, 255, 1)";
                    ctx.fillRect(j * mapScale, i * mapScale, mapScale, mapScale);
                } else if(map2D[i][j].value === 'Y') {
                    ctx.fillStyle = "rgba(0, 255, 255, 1)";
                    ctx.fillRect(j * mapScale, i * mapScale, mapScale, mapScale);
                }
            }
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 255, 0, 1)";
        ctx.arc(playerX*mapScale, playerY*mapScale, mapScale/2, 0, 2 * Math.PI);
        ctx.fill();
    }
}