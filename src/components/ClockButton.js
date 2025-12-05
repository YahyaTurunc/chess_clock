import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    if (seconds < 10 && seconds > 0) {
        return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
    }

    return `${m}:${s.toString().padStart(2, '0')}`;
};

const ClockButton = ({ time, isActive, onPress, style, rotation = 0, moves }) => {
    const { activeColor } = useTheme();
    const backgroundColor = isActive ? activeColor : '#b0b0b0';
    const textColor = isActive ? '#ffffff' : '#312e2b';

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
        fontSize: width * 0.25,
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
