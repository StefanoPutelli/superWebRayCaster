import TYPES from "./utils/tile_types.js";
import conf from "./utils/config.js";

const M_PI = 3.14159265358979323846;
const INT_MAX = 2147483647;

export default class Player {
    direction = 0
    position = {
        x: 0,
        y: 0
    }
    FOV = 0;
    RESOLUTION = 0;
    dimension = { width: 0, height: 0 };
    map2D = null;
    tile_size = 1;
    map_height = 0;
    map_width = 0;
    id = null;
    constructor(conf, position, direction) {
        this.direction = direction;
        this.position.x = position.x;
        this.position.y = position.y;
        this.FOV = conf.FOV;
        this.direction = conf.initial_direction;
        this.dimension.height = conf.dimensions.height;
        this.dimension.width = parseInt(conf.dimensions.width / conf.FOV) * conf.FOV;
        this.RESOLUTION = parseInt(this.dimension.width / this.FOV);
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

    setID(id) {
        this.id = id;
        console.log("userID setted: " + this.id);
    }

    getResolution(){
        return this.RESOLUTION;
    }

    setDimensions(width, height, fov) {
        this.dimension.width = parseInt(width / fov) * fov;
        this.dimension.height = height;
        this.RESOLUTION = parseInt(this.dimension.width / this.FOV) / conf.res_optimizer;
        console.log(this.dimension.width + " " + this.dimension.height + " " + this.RESOLUTION);
    }

    getPlayerPosition() {
        return this.position;
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
        } else if (value < 0) {
            this.direction = this.direction + value < 0 ? this.direction = 360 + this.direction + value : this.direction + value;
        } else {
            return;
        }
    }

    move(key, player_speed, map2D, map_size) {
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
            let out_x = this.position.x + deltaX < 0 || this.position.x + deltaX >= map_size.width
            let out_y = this.position.y + deltaY < 0 || this.position.y + deltaY >= map_size.height
            if (!(out_x || out_y)) {
                if (map2D[parseInt(this.position.y + deltaY)][parseInt(this.position.x + deltaX)].value === '#') {
                    if (map2D[parseInt(this.position.y)][parseInt(this.position.x + deltaX)].value === '#') {
                        deltaX = 0
                    }
                    if (map2D[parseInt(this.position.y + deltaY)][parseInt(this.position.x)].value === '#') {
                        deltaY = 0
                    }
                }
            }
            this.position.x += deltaX;
            this.position.y += deltaY;
        }
    }

    rayCastInTheFov(map2D, map_size) {
        let start = parseInt(this.direction - (this.FOV / 2));
        let end = parseInt(this.direction + (this.FOV / 2));
        let fov_array = [];
        let entity_array = [];
        let last_block = {
            type: null,
            distance: null,
            block_id: null,
            block_face: null,
            fov_index: null
        };
        let fov_index = 0;
        for (let i = end; i >= start; i--) {
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
                let last_ray = fov_index === this.FOV * this.RESOLUTION - 1;
                let dX;
                let dY;
                let block_distance;
                let block_face;
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
                    let fish_eye_correction = Math.cos((fov_index / this.RESOLUTION - this.FOV / 2) * M_PI / 180);
                    if (x_distance < y_distance) {
                        dX = parseInt(this.position.x + (x_distance * cosAngle + this.tile_size / 2 * cosSign));
                        dY = parseInt(this.position.y - (x_distance * sinAngle));
                        dptX += 1;
                        block_distance = Math.abs(x_distance * fish_eye_correction);
                        block_face = cosSign === 1 ? 'W' : 'E';
                        if (dY < 0 || dY > map_size.height || dX < 0 || dX > map_size.width) {
                            console.log("invalid point")
                            fov_array.push({
                                distance: block_distance,
                                block_id: null,
                                block_face: null,
                                fov_index: null
                            });
                            break;
                        }
                        if (this.pushToFovArray(fov_array,entity_array, fov_index, last_block, map2D[dY][dX], block_distance, block_face, last_ray,this.FOV)) break;
                    } else {
                        dX = parseInt(this.position.x + (y_distance * cosAngle));
                        dY = parseInt(this.position.y - (y_distance * sinAngle + this.tile_size / 2 * sinSign));
                        dptY += 1;
                        block_distance = Math.abs(y_distance * fish_eye_correction);
                        block_face = sinSign === 1 ? 'N' : 'S';
                        if (dY < 0 || dY >= map_size.height || dX < 0 || dX >= map_size.width) {
                            console.log("invalid point")
                            fov_array.push({
                                distance: block_distance,
                                block_id: null,
                                block_face: null,
                                fov_index: null
                            });
                            break;
                        }
                        if (this.pushToFovArray(fov_array,entity_array, fov_index, last_block, map2D[dY][dX], block_distance, block_face, last_ray,this.FOV)) break;
                    }
                }
                last_block.type = map2D[dY][dX].value
                last_block.distance = block_distance
                last_block.block_id = map2D[dY][dX].block_id
                last_block.block_face = block_face
                last_block.fov_index = fov_index
                fov_index++;
            }
        }
        return {
            fov_array : fov_array,
            entity_array : entity_array
        };
    }

    get2DpointDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    }

    get2DpointAngle(x1, y1, x2, y2,fov) {
        let angle = Math.atan2(x2 - x1,y2 - y1) * 180 / M_PI;
        return  fov/2 - (((angle + 270)%360) - this.direction);
    }

    pushToFovArray(fov_array,entity_array, fov_index, last_block, map_tile, block_distance, block_face, last_ray,fov) {
        switch (map_tile.value) {
            case TYPES.WALL: {
                const curren_block = {
                    type: TYPES.WALL,
                    distance: block_distance,
                    block_id: map_tile.block_id,
                    block_face: block_face,
                    fov_index: fov_index
                }
                if (fov_index === 0) {
                    fov_array.push(curren_block);
                    return 1;
                }else if((curren_block.block_id !== last_block.block_id || curren_block.block_face !== last_block.block_face) || last_ray){
                    const last_block_push = {
                        type: last_block.type,
                        distance: last_block.distance,
                        block_id: last_block.block_id,
                        block_face: last_block.block_face,
                        fov_index: last_block.fov_index
                    }
                    fov_array.push(last_block_push);
                    fov_array.push(curren_block);
                }
                return 1;
            }
            case TYPES.OTHER_PLAYER: {
                if(this.id === map_tile.id) return 0;
                for(let i = 0; i < entity_array.length; i++){
                    if(entity_array[i].block_id === map_tile.block_id || entity_array[i].playerInfo.player_id === map_tile.id) {
                        return 0;
                    }
                }
                const player_distance = this.get2DpointDistance(this.position.x,this.position.y,map_tile.position.x,map_tile.position.y)
                const player_angle = this.get2DpointAngle(this.position.x,this.position.y,map_tile.position.x,map_tile.position.y,fov)
                entity_array.push({
                    type: TYPES.OTHER_PLAYER,
                    playerInfo: {
                        player_fov_index : parseInt(player_angle * this.RESOLUTION * conf.res_optimizer),
                        player_distance : player_distance,
                        player_id : map_tile.id,
                        username : map_tile.username
                    },
                    distance: block_distance,
                    block_id: map_tile.block_id,
                    block_face: block_face,
                    fov_index : fov_index
                });
                return 0;
            }
        }
        return 0;
    }

}