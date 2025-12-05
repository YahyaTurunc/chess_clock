import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    HAS_SEEN_ONBOARDING: '@chess_clock_onboarding',
    ACTIVE_COLOR: '@chess_clock_active_color',
};

const DEFAULT_ACTIVE_COLOR = '#5d9948';

const COLOR_PALETTE = [
    { id: 'green', name: 'Yeşil', color: '#5d9948' },
    { id: 'rose', name: 'Gül', color: '#FDACAC' },
    { id: 'blue', name: 'Mavi', color: '#2563eb' },
    { id: 'orange', name: 'Turuncu', color: '#FF9B00' },
    { id: 'turquoise', name: 'Turkuaz', color: '#6DC3BB' },
    { id: 'gold', name: 'Altın', color: '#FFCC4C' },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [activeColor, setActiveColor] = useState(DEFAULT_ACTIVE_COLOR);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null); // null = loading
    const [customPreset, setCustomPreset] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load persisted state on mount
    useEffect(() => {
        const loadPersistedState = async () => {
            try {
                const [onboardingValue, colorValue] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING),
                    AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_COLOR),
                ]);

                setHasSeenOnboarding(onboardingValue === 'true');
                if (colorValue) {
                    setActiveColor(colorValue);
                }
            } catch (error) {
                console.log('Error loading persisted state:', error);
                setHasSeenOnboarding(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadPersistedState();
    }, []);

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
            setHasSeenOnboarding(true);
        } catch (error) {
            console.log('Error saving onboarding state:', error);
        }
    };

    const changeActiveColor = async (color) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_COLOR, color);
            setActiveColor(color);
        } catch (error) {
            console.log('Error saving color:', error);
        }
    };

    const resetToDefaults = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_COLOR, DEFAULT_ACTIVE_COLOR);
            setActiveColor(DEFAULT_ACTIVE_COLOR);
            setCustomPreset(null);
        } catch (error) {
            console.log('Error resetting defaults:', error);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                activeColor,
                hasSeenOnboarding,
                customPreset,
                isLoading,
                colorPalette: COLOR_PALETTE,
                setCustomPreset,
                changeActiveColor,
                completeOnboarding,
                resetToDefaults,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
