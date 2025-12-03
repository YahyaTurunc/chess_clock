import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10); // Tenths of a second

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // If less than 10 seconds, show tenths? Optional, but nice for blitz.
    // Standard chess clocks often show tenths under 20s or 10s.
    // Let's keep it simple for now: MM:SS.
    // If user wants high precision later we can add it.
    // Actually, let's show tenths if < 10 seconds.
    if (seconds < 10 && seconds > 0) {
        return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
    }

    return `${m}:${s.toString().padStart(2, '0')}`;
};

const ClockButton = ({ time, isActive, onPress, style, rotation = 0, moves, color }) => {
    const backgroundColor = isActive ? '#5d9948' : '#b0b0b0'; // Green if active, Grey if inactive
    const textColor = isActive ? '#ffffff' : '#312e2b'; // White text on green, Dark text on grey

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor }, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={{ transform: [{ rotate: `${rotation}deg` }], alignItems: 'center' }}>
                <Text style={[styles.timeText, { color: textColor }]}>
                    {formatTime(time)}
                </Text>
                <Text style={[styles.movesText, { color: textColor }]}>
                    Hamle: {moves}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    timeText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: width * 0.25, // Responsive font size
        includeFontPadding: false,
        lineHeight: width * 0.25,
    },
    movesText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 24,
        opacity: 0.8,
        marginTop: 10,
    },
});

export default ClockButton;
