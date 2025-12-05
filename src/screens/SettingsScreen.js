import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
    const { activeColor, colorPalette, changeActiveColor, resetToDefaults } = useTheme();

    const handleColorSelect = (color) => {
        changeActiveColor(color);
    };

    const handleReset = () => {
        resetToDefaults();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#b0b0b0" size={28} />
                </TouchableOpacity>
                <Text style={styles.title}>Ayarlar</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Aktif Oyuncu Rengi</Text>
                <Text style={styles.sectionSubtitle}>
                    Sırası gelen oyuncunun arka plan rengini seçin
                </Text>

                <View style={styles.colorGrid}>
                    {colorPalette.map((item) => (
                        <View key={item.id} style={styles.colorItemWrapper}>
                            <TouchableOpacity
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: item.color },
                                    activeColor === item.color && styles.colorOptionSelected,
                                ]}
                                onPress={() => handleColorSelect(item.color)}
                            >
                                {activeColor === item.color && (
                                    <Check color="#ffffff" size={32} strokeWidth={3} />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.colorLabel}>{item.name}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                    <RotateCcw color="#b0b0b0" size={24} />
                    <Text style={styles.resetButtonText}>Varsayılana Sıfırla</Text>
                </TouchableOpacity>
            </ScrollView>
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
    backButton: {
        padding: 4,
    },
    title: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 36,
        color: '#b0b0b0',
    },
    placeholder: {
        width: 36,
    },
    content: {
        padding: 24,
        flexGrow: 1,
    },
    sectionTitle: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 28,
        color: '#ffffff',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 18,
        color: '#888',
        marginBottom: 24,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 24,
    },
    colorItemWrapper: {
        width: '30%',
        alignItems: 'center',
        gap: 8,
    },
    colorOption: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 999, // Make it circular
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorOptionSelected: {
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    colorLabel: {
        textAlign: 'center',
        fontFamily: 'Jersey25_400Regular',
        fontSize: 20,
        color: '#b0b0b0',
    },
    divider: {
        height: 1,
        backgroundColor: '#444',
        marginVertical: 32,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 12,
        gap: 12,
        marginTop: 'auto',
    },
    resetButtonText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 22,
        color: '#b0b0b0',
    },
});

export default SettingsScreen;
