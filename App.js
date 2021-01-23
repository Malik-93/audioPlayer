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
      url: 'https://firebasestorage.googleapis.com/v0/b/tbportal-75e42.appspot.com/o/Sat%20Jan%2023%202021%2010%3A04%3A06%20GMT%2B0500%20(PKT)?alt=media&token=1a6ff95a-2625-4fbb-b4b4-ebb04e967fa2',
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
