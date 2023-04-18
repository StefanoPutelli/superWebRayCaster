import Head from 'next/head';
import { Player, Map2D, ScreenRenderer } from '../rayCastEngine/classes.js';
import { useEffect, useRef } from 'react';

const configs = {
  FOV: 60,
  initial_direction: 0,
  dimensions: {
      width: 660,
      height: 600
  },
  tile_size: 1,
  max_fps: 30,
  player_speed: 0.1
}

const map_text= (
  "###############################\n\
#  #           #  #     #     #\n\
#  ####  ####  #  #  ####  ####\n\
#           #  #     #        #\n\
#  #############  #  ####  ####\n\
#  #     #  #  #  #        #  #\n\
#  #  ####  #  ####  ####  #  #\n\
#     #  #  #     ####  #     #\n\
#        #  ####        #  ####\n\
#  #     #                 #  #\n\
#  ##########  ####  #  ####  #\n\
#           #  #  #  #        #\n\
#           ####  #  #  ####  #\n\
#  #        #  #     #  #     #\n\
#  #                 ####  #  #\n\
#  #              #     #  #  #\n\
#  #     #######  #######  ####\n\
#  ####  #  #  #        #     #\n\
####     #        #######  #  #\n\
#        #        #        #  #\n\
###############################"
)

const map = new Map2D(map_text);
const player = new Player(configs, map, {x: 2, y: 2}, 0);
const screenRenderer = new ScreenRenderer();

//Probabilmene il fov array è al contrario

export default function Home() {

  const canv = useRef(null);
  const ctx = useRef(null);

  const keyPressed = useRef({})
  const mouseTurned = useRef(0);

  const lastTime = useRef(0);

  function checkTurn(){
    player.turn(mouseTurned.current);
    mouseTurned.current = 0;
  }

  function setSize(height, width, fov){
    canv.current.width = width;
    canv.current.height = height;
    ctx.current.imageSmoothingEnabled = false;
    player.setDimensions(canv.current.width, canv.current.height,fov);
  }

  useEffect(() => {
    async function lockPointer() {
      canv.current.requestPointerLock({
          unadjustedMovement: true,
        });
    }
    function handler(){
      canv.current = document.getElementById('canvas');
      ctx.current = canv.current.getContext('2d');
      setSize(window.innerHeight, window.innerWidth, configs.FOV);
      canv.current.addEventListener("click", lockPointer);
    }
    if (document.readyState === "complete") {
      handler();
    } else {
      window.addEventListener("load", handler);
      return () => document.removeEventListener("load", handler);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if(!ctx.current || !canv.current) return;
      setSize(window.innerHeight, window.innerWidth, configs.FOV);
    })
  })

  useEffect(() => {
    console.log("movement activated")
    const handleMouseMove = (e) => {
      if(!ctx.current || !canv.current) return;
      mouseTurned.current += e.movementX * -0.1;
    }
    const handleKeyDown = (e) => {
      if(!ctx.current || !canv.current) return;
      keyPressed.current[e.key] = true;
    }
    const handleKeyUp = (e) => {
      if(!ctx.current || !canv.current) return;
      delete keyPressed.current[e.key];
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    }
  });

  useEffect(() => {
    setInterval(() => {
      if(!ctx.current || !canv.current) return;
      const fov_array = player.rayCastInTheFov();
      player.move(keyPressed.current,configs.player_speed);
      checkTurn();
      screenRenderer.drawScreen(ctx.current, canv.current, fov_array,configs.FOV);
      screenRenderer.drawMap(ctx.current,canv.current, map.map2D, player.position.x, player.position.y)
    }, 1000/50);
  })

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <canvas id="canvas" style={{height: "100vh",width: "100vw", position: "absolute", top: "0", left: "0"}}></canvas>
      <div style={{position: "absolute", right: "0", top: "0", color:"black"}}>
        <p>WASD to move</p>
        <p>Mouse to turn</p>
        <p>Click to lock mouse</p>
      </div>
    </>
  )
}
