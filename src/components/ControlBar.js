import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Pause, Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react-native';

const ControlBar = ({ isPaused, onPauseToggle, onReset, onHome, isSoundEnabled, onSoundToggle }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onHome} style={styles.button}>
                <Home color="#b0b0b0" size={28} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onPauseToggle} style={styles.button}>
                {isPaused ? (
                    <Play color="#b0b0b0" size={32} fill="#b0b0b0" />
                ) : (
                    <Pause color="#b0b0b0" size={32} fill="#b0b0b0" />
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onReset} style={styles.button}>
                <RotateCcw color="#b0b0b0" size={28} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSoundToggle} style={styles.button}>
                {isSoundEnabled ? (
                    <Volume2 color="#b0b0b0" size={28} />
                ) : (
                    <VolumeX color="#b0b0b0" size={28} />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: '#312e2b',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#444',
        zIndex: 10,
    },
    button: {
        padding: 10,
    },
});

export default ControlBar;
