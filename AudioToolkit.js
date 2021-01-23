import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Player, Recorder, PlayerError } from '@react-native-community/audio-toolkit';

export default ({ data }) => {
    let initState = {
        chatPlayingVoice: false,
        chatPlayingVoiceIndex: null
    };
    const [state, setState] = useState(initState)
    const playerRefsObj = useRef({});

    const onPlayPauseAudio = (item, index) => {
        let playerRef = null;
        if (playerRefsObj.current["player-" + index]) {
            console.log('first if ran---');
            playerRef = playerRefsObj.current["player-" + index];
        }
        else {
            console.log('first else ran---');
            playerRef = new Player(item.url, { autoDestroy: false });
            playerRefsObj.current["player-" + index] = playerRef
        }
        if (state.chatPlayingVoice === false) {
            console.log('sec if ran---');
            playerRef.play().on('ended', () => {
                setState((prevState) => ({ ...prevState, chatPlayingVoice: false, chatPlayingVoiceIndex: -1 }));
            });
            setState((prevState) => ({ ...prevState, chatPlayingVoice: true, chatPlayingVoiceIndex: index }));
        }
        else if (state.chatPlayingVoice && index !== state.chatPlayingVoiceIndex) {
            console.log('yeah')
            playerRefsObj.current[`player-${state.chatPlayingVoiceIndex}`].stop();
            playerRefsObj.current[`player-${index}`].play().on('ended', () => {
                setState((prevState) => ({ ...prevState, chatPlayingVoice: false, chatPlayingVoiceIndex: -1 }));
            });
            setState((prevState) => ({ ...prevState, chatPlayingVoice: true, chatPlayingVoiceIndex: index }));

        }
        else {
            console.log('sec else ran---');
            playerRef.pause();
            setState((prevState) => ({ ...prevState, chatPlayingVoice: false, chatPlayingVoiceIndex: -1 }));
        }
    };
    console.log('state', state)
    console.log('playerRefsObj', playerRefsObj)
    return data.map((audio, index) => (
        <View key={index} style={{ justifyContent: 'center', padding: 20 }}>
            <TouchableOpacity onPress={() => onPlayPauseAudio(audio, index)}>
                <Text>{index === state.chatPlayingVoiceIndex && state.chatPlayingVoice ? 'Pause' : "Play"}</Text>
                {/* <Text>{playerRefsObj?.current?.['player-0']?._duration ?? 0}</Text> */}
            </TouchableOpacity>
        </View>
    ))
}
