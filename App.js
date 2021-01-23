import React from 'react'
import AudioToolkit from './AudioToolkit';
export default function App() {
  console.log("App mounted");
  let data = [
    {
      id: 1,
      type: 'default',
      url: 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
    },
    {
      id: 2,
      type: 'default',
      url: 'http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/ateapill.ogg',
    },
    {
      id: 3,
      type: 'default',
      url: 'http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/win.ogg',
    }
  ]

  return <AudioToolkit data={data} />
  // return <AudioPlayer data={data} songDetails={data[0]} key={1} />
}
