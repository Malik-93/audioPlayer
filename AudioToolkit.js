import React, { useRef, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Player } from '@react-native-community/audio-toolkit';

export default ({ data }) => {
    let initState = {
        chatPlayingVoice: false,
        chatPlayingVoiceIndex: null,
        duration: 0,
        postion: 0
    };

    const [state, setState] = useState(initState)
    const playerRefsObj = useRef({});
    const _timerConverter = s => {
        s = parseInt(s);
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
    };
    useEffect(() => {
        var myInterval = null
        if (state.chatPlayingVoice && playerRefsObj.current) {
            myInterval = setInterval(() => {
                console.log('interval ran--')
                setState(pre => ({ ...pre, duration: playerRefsObj.current[`player-${state.chatPlayingVoiceIndex}`]._duration, postion: playerRefsObj.current[`player-${state.chatPlayingVoiceIndex}`].currentTime / playerRefsObj.current[`player-${state.chatPlayingVoiceIndex}`]._duration }))
            }, 1000);
        } else {
            clearInterval(myInterval);
        }
    }, [state.chatPlayingVoice])
    const _onPlayPauseAudio = (item, index) => {
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
            <TouchableOpacity onPress={() => _onPlayPauseAudio(audio, index)}>
                <Text>{index === state.chatPlayingVoiceIndex && state.chatPlayingVoice ? 'Pause' : "Play"}</Text>
                <Text>
                    {index === state.chatPlayingVoiceIndex ? _timerConverter(state.postion) + " / " + _timerConverter(state.duration) : "0:00 / 0:00"}
                </Text>
            </TouchableOpacity>
        </View>
    ))
}
