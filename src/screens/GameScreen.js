import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { useChessClock } from '../hooks/useChessClock';
import ClockButton from '../components/ClockButton';
import ControlBar from '../components/ControlBar';

const GameScreen = ({ route, navigation }) => {
    const { preset } = route.params;
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const soundRef = useRef(null);

    const {
        whiteTime,
        blackTime,
        activePlayer,
        isPaused,
        whiteMoves,
        blackMoves,
        gameStatus,
        resetGame,
        togglePause,
        switchTurn,
    } = useChessClock(preset.time, preset.increment);

    // Load sound
    useEffect(() => {
        async function loadSound() {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/tick1.mp3'),
                    { isLooping: true }
                );
                soundRef.current = sound;
            } catch (error) {
                console.log('Error loading sound', error);
            }
        }
        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    // Manage sound playback
    useEffect(() => {
        const manageSound = async () => {
            if (!soundRef.current) return;

            if (isSoundEnabled && gameStatus === 'running' && !isPaused) {
                const status = await soundRef.current.getStatusAsync();
                if (!status.isPlaying) {
                    await soundRef.current.playAsync();
                }
            } else {
                const status = await soundRef.current.getStatusAsync();
                if (status.isPlaying) {
                    await soundRef.current.pauseAsync();
                }
            }
        };
        manageSound();
    }, [isSoundEnabled, gameStatus, isPaused]);

    // Handle hardware back button
    useEffect(() => {
        const backAction = () => {
            if (gameStatus === 'running' || gameStatus === 'paused') {
                Alert.alert('Oyundan Çık?', 'Çıkmak istediğinize emin misiniz? Oyun kaybedilecek.', [
                    { text: 'İptal', onPress: () => null, style: 'cancel' },
                    { text: 'EVET', onPress: () => navigation.goBack() },
                ]);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [gameStatus, navigation]);

    const handleHome = () => {
        if (gameStatus === 'running' || gameStatus === 'paused') {
            Alert.alert('Oyundan Çık?', 'Çıkmak istediğinize emin misiniz?', [
                { text: 'İptal', style: 'cancel' },
                { text: 'EVET', onPress: () => navigation.goBack() },
            ]);
        } else {
            navigation.goBack();
        }
    };

    const handleReset = () => {
        Alert.alert('Oyunu Sıfırla?', 'Saatleri sıfırlamak istediğinize emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'EVET', onPress: resetGame },
        ]);
    };


    return (
        <View style={styles.container}>
            {/* Opponent (Black) - Top, Rotated */}
            <ClockButton
                time={blackTime}
                isActive={activePlayer === 'black'}
                onPress={() => switchTurn('black')}
                rotation={180}
                moves={blackMoves}
                style={styles.topButton}
            />

            {/* Control Bar */}
            <ControlBar
                isPaused={isPaused}
                onPauseToggle={togglePause}
                onReset={handleReset}
                onHome={handleHome}
                isSoundEnabled={isSoundEnabled}
                onSoundToggle={() => setIsSoundEnabled(prev => !prev)}
            />

            {/* Player (White) - Bottom */}
            <ClockButton
                time={whiteTime}
                isActive={activePlayer === 'white'}
                onPress={() => switchTurn('white')}
                moves={whiteMoves}
                style={styles.bottomButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#312e2b',
    },
    topButton: {
        flex: 1,
    },
    bottomButton: {
        flex: 1,
    },
});

export default GameScreen;
