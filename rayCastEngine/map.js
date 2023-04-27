export default class Map2D {
    map2D = [];
    size = {
        height : 0,
        width : 0
    }
    myID = null;
    constructor(map_text) {
        let buf = map_text.split("\n");
        let temp_map2D = buf.map((row) => row.split(''));
        let block_id_count = 0;
        for (let i = 0; i < temp_map2D.length; i++) {
            let row = [];
            for (let j = 0; j < temp_map2D[i].length; j++) {
                row.push({
                    value: temp_map2D[i][j],
                    block_id: block_id_count++,
                    position: {
                        x: 0,
                        y: 0
                    },
                    id : null,
                    username : null
                });
            }
            this.map2D.push(row);
        }
        let dim = this.setDimensions();
        this.size.height = dim.maxColLenght;
        this.size.width = dim.maxRowLenght;
    }
    setDimensions() {
        let maxRowLenght = 0;
        let maxColLenght = 0;
        this.map2D.forEach((row) => {
            if (row.length > maxRowLenght) {
                maxRowLenght = row.length;
            }
        })
        maxColLenght = this.map2D.length;
        return { maxRowLenght, maxColLenght};
    }
    printMap() {
        this.map2D.forEach((row) => {
            console.log(row.join(''));
        })
    }
    setID(id) {
        this.myID = id;
    }
    getMap() {
        return this.map2D;
    }
    getDimensions() {
        return this.size
    }
    getFullMap(player_to_insert){
        let map = JSON.parse(JSON.stringify(this.map2D));
        if(this.myID === null) return map;
        const keys = Object.keys(player_to_insert);
        for(let i = 0; i < keys.length; i++){
            if(keys[i] === this.myID) continue;
            const thing_x_int = parseInt(player_to_insert[keys[i]].x);
            const thing_y_int = parseInt(player_to_insert[keys[i]].y);
            map[thing_y_int][thing_x_int].value = player_to_insert[keys[i]].value;
            map[thing_y_int][thing_x_int].position.x = player_to_insert[keys[i]].x;
            map[thing_y_int][thing_x_int].position.y = player_to_insert[keys[i]].y;
            map[thing_y_int][thing_x_int].username = player_to_insert[keys[i]].username;
            map[thing_y_int][thing_x_int].id = player_to_insert[keys[i]].id;
        }
        return map;
    }

}