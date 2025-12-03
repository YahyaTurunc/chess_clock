import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { PRESETS } from '../utils/presets';

const HomeScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.presetItem}
            onPress={() => navigation.navigate('Game', { preset: item })}
        >
            <View style={styles.radioButton}>
                <View style={styles.radioButtonInner} />
            </View>
            <Text style={styles.presetText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#312e2b" />
            <View style={styles.header}>
                <Text style={styles.title}>Satranç Saati</Text>
            </View>
            <FlatList
                data={PRESETS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#312e2b',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    title: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 48,
        color: '#b0b0b0',
    },
    listContent: {
        padding: 20,
    },
    presetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#b0b0b0',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'transparent', // Unselected state
    },
    presetText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 32,
        color: '#ffffff',
    },
});

export default HomeScreen;
