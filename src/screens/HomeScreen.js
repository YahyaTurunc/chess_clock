import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Settings, Plus, X } from 'lucide-react-native';
import { PRESETS } from '../utils/presets';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
    const { activeColor, customPreset, setCustomPreset } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [minutes, setMinutes] = useState('');
    const [increment, setIncrement] = useState('');

    const allPresets = customPreset
        ? [...PRESETS, customPreset]
        : PRESETS;

    const handleCreateCustom = () => {
        const mins = parseInt(minutes, 10);
        const inc = parseInt(increment, 10) || 0;

        if (isNaN(mins) || mins <= 0) {
            return;
        }

        const clampedIncrement = Math.min(Math.max(inc, 0), 60);

        const newPreset = {
            id: 'custom',
            label: clampedIncrement > 0 ? `${mins} | ${clampedIncrement}` : `${mins} dk.`,
            time: mins * 60,
            increment: clampedIncrement,
            isCustom: true,
        };

        setCustomPreset(newPreset);
        setModalVisible(false);
        setMinutes('');
        setIncrement('');
        navigation.navigate('Game', { preset: newPreset });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.presetItem}
            onPress={() => navigation.navigate('Game', { preset: item })}
        >
            <View style={[styles.radioButton, { borderColor: item.isCustom ? activeColor : '#b0b0b0' }]}>
                {item.isCustom && (
                    <View style={[styles.radioButtonInner, { backgroundColor: activeColor }]} />
                )}
            </View>
            <Text style={[styles.presetText, item.isCustom && { color: activeColor }]}>
                {item.label}
            </Text>
            {item.isCustom && (
                <Text style={styles.customBadge}>Özel</Text>
            )}
        </TouchableOpacity>
    );

    const renderFooter = () => (
        <TouchableOpacity
            style={[styles.createButton, { borderColor: activeColor }]}
            onPress={() => setModalVisible(true)}
        >
            <Plus color={activeColor} size={24} />
            <Text style={[styles.createButtonText, { color: activeColor }]}>
                Özel Süre Oluştur
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#312e2b" />

            <View style={styles.header}>
                <View style={styles.placeholder} />
                <Text style={styles.title}>Satranç Saati</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Settings color="#b0b0b0" size={28} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={allPresets}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={renderFooter}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Özel Süre</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color="#b0b0b0" size={28} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Dakika</Text>
                            <TextInput
                                style={styles.input}
                                value={minutes}
                                onChangeText={setMinutes}
                                keyboardType="number-pad"
                                placeholder="ör. 5"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Artış (saniye)</Text>
                            <TextInput
                                style={styles.input}
                                value={increment}
                                onChangeText={setIncrement}
                                keyboardType="number-pad"
                                placeholder="0-60"
                                placeholderTextColor="#666"
                            />
                            <Text style={styles.inputHint}>Her hamle sonrası eklenecek süre</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: activeColor }]}
                            onPress={handleCreateCustom}
                        >
                            <Text style={styles.submitButtonText}>Oluştur ve Başla</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#312e2b',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    placeholder: {
        width: 36,
    },
    title: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 48,
        color: '#b0b0b0',
    },
    settingsButton: {
        padding: 4,
    },
    listContent: {
        paddingLeft: 20,
        paddingRight: 20,
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
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    presetText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 32,
        color: '#ffffff',
        flex: 1,
    },
    customBadge: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 16,
        color: '#888',
        backgroundColor: '#444',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        marginTop: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        gap: 10,
    },
    createButtonText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 24,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#312e2b',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 32,
        color: '#ffffff',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 20,
        color: '#b0b0b0',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#444',
        borderRadius: 12,
        padding: 16,
        fontFamily: 'Jersey25_400Regular',
        fontSize: 24,
        color: '#ffffff',
    },
    inputHint: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 14,
        color: '#666',
        marginTop: 6,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 24,
        color: '#ffffff',
    },
});

export default HomeScreen;
