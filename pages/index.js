import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Player, Map2D } from '../rayCastEngine/classes.js';
import { useEffect } from 'react';

const configs = {
  FOV: 60,
  initial_direction: 0,
  dimensions: {
      width: 660,
      height: 600
  },
  tile_size: 1,
  max_fps: 30,
  player_speed: 0.05
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
const player = new Player(configs, map, {x: 2, y: 2}, 90);

//Probabilmene il fov array è al contrario

export default function Home() {

  useEffect(() => {
    setInterval(() => {
      player.rayCastInTheFov()
    }, 1000);
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <canvas id="canvas" width="800" height="600"></canvas>
      </main>
    </div>
  )
}
