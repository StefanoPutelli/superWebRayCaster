import Head from 'next/head';
import ScreenRenderer from '../rayCastEngine/screen.js';
import Map2D from '../rayCastEngine/map.js';
import Player from '../rayCastEngine/player.js';
import { useEffect, useRef } from 'react';
import JoyStick from "./comp/joystick"
import TYPES from '../rayCastEngine/utils/tile_types.js';

import useWebSocket from 'react-use-websocket';

const WS_URL = "wss://stepo.cloud/ws";
const FPS = 0.5;

const configs = {
  FOV: 60,
  initial_direction: -90,
  dimensions: {
    width: 660,
    height: 600
  },
  tile_size: 1,
  max_fps: 30,
  player_speed: 0.1
}

const map_text = (
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
const player = new Player(configs, { x: 2, y: 2 }, 0);

const other_players = {};

const screenRenderer = new ScreenRenderer();

//Probabilmene il fov array è al contrario

function updateData(event) {
  const data = JSON.parse(event.data);
  if (data.type === "userdisconnected") {
    delete other_players[data.userID];
    return;
  } else if (data.type === "playerupdate") {
    other_players[data.userID] = {
      value: TYPES.OTHER_PLAYER,
      x: data.data.x,
      y: data.data.y,
    }
  } else if (data.type === "userconnected") {
    console.log(data.data.username + " connected");
  } else if (data.type === 'selfconnected') {
    player.setID(data.userID)
    map.setID(data.userID);
  }
}

export default function Home() {

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => console.log("connected"),
    onMessage: updateData,
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true
  });

  const canv = useRef(null);
  const ctx = useRef(null);

  const keyPressed = useRef({})
  const mouseTurned = useRef(0);

  const drag_lenght = useRef(0);

  function checkTurn() {
    player.turn(mouseTurned.current);
    mouseTurned.current = 0;
  }

  function setSize(height, width, fov) {
    canv.current.width = width;
    canv.current.height = height;
    ctx.current.imageSmoothingEnabled = false;
    player.setDimensions(canv.current.width, canv.current.height, fov);
  }

  useEffect(() => {
    async function lockPointer() {
      canv.current.requestPointerLock = canv.current.requestPointerLock ||
        canv.current.mozRequestPointerLock ||
        canv.current.webkitRequestPointerLock;
      canv.current.requestPointerLock();
    }
    function handler() {
      canv.current = document.getElementById('canvas');
      ctx.current = canv.current.getContext('2d');
      setSize(window.innerHeight, window.innerWidth, configs.FOV);
      canv.current.addEventListener("click", lockPointer);
      sendJsonMessage({ type: "userconnected", username: "guest" });
    }
    if (document.readyState === "complete") {
      handler();
    } else {
      window.addEventListener("load", handler);
      return () => document.removeEventListener("load", handler);
    }
  });

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!ctx.current || !canv.current) return;
      setSize(window.innerHeight, window.innerWidth, configs.FOV);
    })
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ctx.current || !canv.current) return;
      mouseTurned.current += e.movementX * -0.1;
    }
    const handleKeyDown = (e) => {
      if (!ctx.current || !canv.current) return;
      keyPressed.current[e.key] = true;
    }
    const handleKeyUp = (e) => {
      if (!ctx.current || !canv.current) return;
      delete keyPressed.current[e.key];
    }
    const handleScroll = (e) => {
      e.preventDefault();
    }
    const touchStart = (e) => {
      drag_lenght.current = e.touches[0].clientX;
    }
    const touchMove = (e) => {
      mouseTurned.current += (e.touches[0].clientX - drag_lenght.current) * 0.1;
      drag_lenght.current = e.touches[0].clientX;
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchmove', touchMove);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
    }
  });

  useEffect(() => {
    setInterval(() => {
      sendJsonMessage({ type: "playerupdate", data: { username: "guest", x: player.position.x, y: player.position.y } });
    }, 1000 / FPS)
  })

  useEffect(() => {
    setInterval(() => {
      if (!ctx.current || !canv.current) return;
      const map2D = map.getFullMap(other_players);
      const map_size = map.getDimensions();
      const fov_array = player.rayCastInTheFov(map2D,map_size);
      player.move(keyPressed.current, configs.player_speed, map2D, map_size);
      checkTurn();
      screenRenderer.drawScreen(ctx.current, canv.current, fov_array, configs.FOV);
      screenRenderer.drawMap(ctx.current, canv.current, map.map2D, player.position.x, player.position.y, player.id, other_players)
    }, 1000 / FPS);
  })


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; user-scalable=0;" />

      </Head>
      <canvas id="canvas" style={{ height: "100svh", width: "100vw", position: "absolute", top: "0", left: "0", zIndex: "-1" }}></canvas>
      <JoyStick key_pressed={keyPressed} />
      <div style={{ position: "absolute", right: "0", top: "0", color: "black" }}>
        <p>WASD to move</p>
        <p>Mouse to turn</p>
        <p>Click to lock mouse</p>
      </div>
      <style jsx global>{`
        body {
          overscroll-behavior: contain;
        }
      `}</style>
    </>
  )
}
