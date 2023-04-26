export default class ScreenRenderer {
    cleanCanvas(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawWalls(ctx, canvas, fov_array, fov) {
        const screenCenter = canvas.height / 2;
        const margin = (canvas.width - parseInt(canvas.width / fov) * fov) / 2
        for (let i = 0; i < fov_array.length - 1; i += 2) {
            ctx.beginPath();
            ctx.moveTo(fov_array[i].fov_index + margin, screenCenter + screenCenter / fov_array[i].distance);
            ctx.lineTo(fov_array[i + 1].fov_index + margin, screenCenter + screenCenter / fov_array[i + 1].distance);
            ctx.lineTo(fov_array[i + 1].fov_index + margin, screenCenter - screenCenter / fov_array[i + 1].distance);
            ctx.lineTo(fov_array[i].fov_index + margin, screenCenter - screenCenter / fov_array[i].distance);
            ctx.closePath();
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();
            // ctx.clip();
            // var img=new Image();
            // img.src="https://www.imgonline.com.ua/examples/rays-of-light-in-the-sky.jpg";
            // img.onload=function(){
            //     ctx.drawImage(img,0,0,canvas.width,canvas.height);
            // }
            // ctx.restore();
        }
    }
    drawEntities(ctx, canvas, entity_array, fov, res) {
        const screenCenter = canvas.height / 2;
        const margin = (canvas.width - parseInt(canvas.width / fov) * fov) / 2
        for (let i = 0; i < entity_array.length; i++) {
            if (entity_array[i].playerInfo.player_fov_index > 0 && entity_array[i].playerInfo.player_fov_index <= fov * res) {
                ctx.beginPath();
                ctx.arc(entity_array[i].playerInfo.player_fov_index + margin, screenCenter, screenCenter/2/entity_array[i].playerInfo.player_distance, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(255,255,0,1)";
                ctx.fill();
            }
        }
    }
    drawMap(ctx, canvas, map2D, playerX, playerY, myUserId, other_players) {
        let mapWidth = map2D[0].length;
        let mapHeight = map2D.length;
        let mapScale = canvas.height * 0.3 / mapWidth;
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, mapWidth * mapScale, mapHeight * mapScale);
        for (let i = 0; i < mapHeight; i++) {
            for (let j = 0; j < mapWidth; j++) {
                if (map2D[i][j].value === '#') {
                    ctx.fillStyle = "rgba(255, 0, 0, 1)";
                    ctx.fillRect(j * mapScale, i * mapScale, mapScale, mapScale);
                } else if (map2D[i][j].value === 'X') {
                    ctx.fillStyle = "rgba(0, 0, 255, 1)";
                    ctx.fillRect(j * mapScale, i * mapScale, mapScale, mapScale);
                } else if (map2D[i][j].value === 'Y') {
                    ctx.fillStyle = "rgba(0, 255, 255, 1)";
                    ctx.fillRect(j * mapScale, i * mapScale, mapScale, mapScale);
                }
            }
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 255, 0, 1)";
        ctx.arc(playerX * mapScale, playerY * mapScale, mapScale / 2, 0, 2 * Math.PI);
        ctx.fill();
        if (myUserId === null) return;
        const players_keys = Object.keys(other_players);
        for (let i = 0; i < players_keys.length; i++) {
            if (players_keys[i] === myUserId) continue;
            const other_playerX = other_players[players_keys[i]].x;
            const other_playerY = other_players[players_keys[i]].y;
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 255, 255, 1)";
            ctx.arc(other_playerX * mapScale, other_playerY * mapScale, mapScale / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

    }
}