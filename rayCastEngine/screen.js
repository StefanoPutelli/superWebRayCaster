export default class ScreenRenderer {
    drawScreen(ctx, canvas, fov_array, fov) {
        const screenCenter = canvas.height / 2;
        canvas.width = canvas.width; //metodo per cancellare il canvas strano, ma funziona, forse più veloce
        const margin = (canvas.width - parseInt(canvas.width / fov) * fov) / 2
        for (let i = 0; i < fov_array.length - 1; i++) {
            if (fov_array[i + 1].block_id !== current_block || fov_array[i + 1].block_face !== currentFace || i + 1 === fov_array.length - 1) {
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
                current_block_start = i + 1;
                current_block = fov_array[i + 1].block_id;
                currentFace = fov_array[i + 1].block_face;
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
        if(myUserId === null) return;
        const players_keys = Object.keys(other_players);
        for (let i = 0; i < players_keys.length; i++) {
            if(players_keys[i] === myUserId) continue;
            const other_playerX = other_players[players_keys[i]].x;
            const other_playerY = other_players[players_keys[i]].y;
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 255, 255, 1)";
            ctx.arc(other_playerX * mapScale, other_playerY * mapScale, mapScale / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

    }
}