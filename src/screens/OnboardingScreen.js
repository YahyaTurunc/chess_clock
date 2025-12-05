import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { Clock, Sliders, Palette } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        icon: Clock,
        title: 'Zaman Seçimi',
        description: 'Bullet, Blitz ve Rapid gibi standart satranç zaman kontrollerinden birini seçin.',
    },
    {
        id: '2',
        icon: Sliders,
        title: 'Özel Süre',
        description: 'Kendi özel sürenizi ve hamle başı ek sürenizi (increment) oluşturun.',
    },
    {
        id: '3',
        icon: Palette,
        title: 'Kişiselleştirme',
        description: 'Ayarlar menüsünden aktif oyuncu rengini kendi zevkinize göre değiştirin.',
    },
];

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const { completeOnboarding, activeColor } = useTheme();

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        }
    };

    const handleGetStarted = async () => {
        await completeOnboarding();
        navigation.replace('Home');
    };

    const renderSlide = ({ item }) => {
        const IconComponent = item.icon;
        return (
            <View style={styles.slide}>
                <View style={[styles.iconContainer, { backgroundColor: activeColor }]}>
                    <IconComponent color="#ffffff" size={80} strokeWidth={1.5} />
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        { backgroundColor: index === currentIndex ? activeColor : '#555' },
                    ]}
                />
            ))}
        </View>
    );

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const isLastSlide = currentIndex === slides.length - 1;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />

            {renderDots()}

            <View style={styles.buttonContainer}>
                {isLastSlide ? (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: activeColor }]}
                        onPress={handleGetStarted}
                    >
                        <Text style={styles.buttonText}>Başla</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: activeColor }]}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>İleri</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#312e2b',
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    title: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 42,
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 22,
        color: '#b0b0b0',
        textAlign: 'center',
        lineHeight: 32,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 6,
    },
    buttonContainer: {
        paddingHorizontal: 40,
        paddingBottom: 40,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Jersey25_400Regular',
        fontSize: 24,
        color: '#ffffff',
    },
});

export default OnboardingScreen;
