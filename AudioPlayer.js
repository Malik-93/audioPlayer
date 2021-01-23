import React, { useEffect, useState } from 'react';
import { Text, Button, View, Image, TouchableOpacity } from 'react-native';
import TrackPlayer, {
    TrackPlayerEvents,
    STATE_PLAYING,
} from 'react-native-track-player';
import {
    useTrackPlayerProgress,
    useTrackPlayerEvents,
} from 'react-native-track-player/lib/hooks';
import Slider from '@react-native-community/slider';
import styles from './styles';

export default ({ data }) => {
    // console.log("Audio Player mounted", songDetails);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const { position, duration } = useTrackPlayerProgress(1);
    const [state, setState] = useState({
        "selectedSound": {},
        "sliderMaxValue": 0
    });
    const _timerConverter = s => {
        s = parseInt(s);
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
    };
    // console.log("sliderValue", sliderValue);
    // console.log("position", position);
    // console.log("duration", duration);
    console.log("state", state);

    // const songDetails = {
    //     id: '1',
    //     url: 'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
    //     title: 'The Greatest Song',
    //     album: 'Great Album',
    //     artist: 'A Great Dude',
    //     artwork: 'https://picsum.photos/300',
    // };

    const trackPlayerInit = async () => {
        await TrackPlayer.setupPlayer();
        TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_JUMP_FORWARD,
                TrackPlayer.CAPABILITY_JUMP_BACKWARD,
            ],
        });
        // await TrackPlayer.add(data);
        // return true;
    };
    useEffect(() => {
        trackPlayerInit()
        return () => {
            
        }
    }, [])

    //this hook updates the value of the slider whenever the current position of the song changes
    useEffect(() => {
        if (!isSeeking && position && duration) {
            setState(pre => ({ ...pre, sliderMaxValue:Math.ceil((position / duration) )}))
            setSliderValue(position / duration);
        }
    }, [position, duration]);

    useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], event => {
        if (event.state === STATE_PLAYING) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    });

    const onButtonPressed = async (x) => {
        // console.log(x)
        // console.log(isPlaying)
        if (state.selectedSound.id === x.id && isPlaying) {
            setState(pre => ({ ...pre, selectedSound: x }));
            setSliderValue(position);
            await TrackPlayer.pause();
        }
        else if (state.selectedSound.id !== x.id && isPlaying) {
            setState(pre => ({ ...pre, selectedSound: x }));
            setSliderValue(0);
            await TrackPlayer.reset();
            await TrackPlayer.add(x);
            await TrackPlayer.play();
        }
        else if (state.selectedSound.id !== x.id && !isPlaying) {
            setState(pre => ({ ...pre, selectedSound: x }));
            setSliderValue(0);
            await TrackPlayer.reset();
            await TrackPlayer.add(x);
            await TrackPlayer.play();
        }
        else {
            setState(pre => ({ ...pre, selectedSound: x }));
            await TrackPlayer.add(x);
            await TrackPlayer.play();
            //setIsPlaying(true);
        }
        // else {
        //     TrackPlayer.pause();
        //     //setIsPlaying(false);
        // }
    };

    const slidingStarted = () => {
        setIsSeeking(true);
    };

    const slidingCompleted = async value => {
        await TrackPlayer.seekTo(value * duration);
        setSliderValue(value);
        setIsSeeking(false);
    };

    return data.map((x, i) => <View style={styles.mainContainer} key={i}>
        {/* <View style={styles.imageContainer}>
            <Image
                source={{
                    uri: songDetails.artwork,
                }}
                resizeMode="contain"
                style={styles.albumImage}
            />
        </View> */}

        <View style={styles.detailsContainer} key={i}>
            <Text style={styles.songTitle}>{x.type + " " + x.id}</Text>
            {/* <Text style={styles.artist}>{songDetails.artist}</Text> */}
        </View>
        <View style={styles.controlsContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text>
                    {(x.id === state.selectedSound.id) ? _timerConverter(position) + " / " + _timerConverter(duration) : "0:00 / 0:00"}
                </Text>
                <Slider
                    style={styles.progressBar}
                    minimumValue={0}
                    maximumValue={state.sliderMaxValue}
                    value={(x.id === state.selectedSound.id) ? sliderValue : 0}
                    minimumTrackTintColor="#111000"
                    maximumTrackTintColor="#000000"
                    onSlidingStart={slidingStarted}
                    onSlidingComplete={slidingCompleted}
                    thumbTintColor="#000"
                />
                <TouchableOpacity
                    onPress={() => onButtonPressed(x)}
                // style={{backgroundColor: 'black'}}
                >

                    <Image source={{ uri: (x.id === state.selectedSound.id && isPlaying) ? "https://www.seekpng.com/png/detail/179-1792518_play-stop-pause-icon-png.png" : "https://www.searchpng.com/wp-content/uploads/2019/02/Play-Black-Icon-PNG-715x673.png" }} style={{
                        height: 30,
                        width: 30,
                        right: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        // backgroundColor: 'black',

                    }} height={30} width={30} />
                </TouchableOpacity>

            </View>
            {/* <Button
                title={(x.id === state.selectedSound.id && isPlaying) ? 'Pause' : 'Play'}
                onPress={() => onButtonPressed(x)}
                style={styles.playButton}
                disabled={false}
                color="#000000"
            /> */}
        </View>
    </View>
    )
};