// App.js

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// screens
import HomeScreen from './src/screens/HomeScreen/index';
import MapScreen from './src/screens/MapScreen/index';
import SessionScreen from './src/screens/SessionScreen/index';

// services
import { getDeviceId } from './src/utils/device';
import { TOKENS, alpha } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const TAB_CONFIG = {
    Home: {
        label: 'Home',
        activeIcon: 'home',
        inactiveIcon: 'home-outline',
    },
    Map: {
        label: 'Map',
        activeIcon: 'map',
        inactiveIcon: 'map-outline',
    },
    Park: {
        label: 'Park',
        activeIcon: 'car',
        inactiveIcon: 'car-outline',
    },
};

function AppNavigation() {
    const insets = useSafeAreaInsets();
    const [, setDeviceId] = useState(null);
    const [, setLocation] = useState(null);
    const tabBarBottomPadding = Math.max(insets.bottom, Platform.select({ ios: 12, android: 10 }));
    const tabBarHeight = 66 + tabBarBottomPadding;

    useEffect(() => {
        (async () => {
            const id = await getDeviceId();
            setDeviceId(id);

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc.coords);
                await AsyncStorage.setItem('userLocation', JSON.stringify(loc.coords));
            }
        })();
    }, []);

    return (
        <NavigationContainer>
            <Tab.Navigator
                sceneContainerStyle={{
                    backgroundColor: TOKENS.bg,
                }}
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarIcon: ({ focused, color, size }) => {
                        const tabMeta = TAB_CONFIG[route.name];
                        return (
                            <View
                                style={[
                                    navStyles.iconBadge,
                                    focused ? navStyles.iconBadgeActive : navStyles.iconBadgeInactive,
                                ]}
                            >
                                <Ionicons
                                    name={focused ? tabMeta.activeIcon : tabMeta.inactiveIcon}
                                    size={focused ? size + 1 : size}
                                    color={color}
                                />
                            </View>
                        );
                    },
                    tabBarLabel: ({ focused, color }) => {
                        const tabMeta = TAB_CONFIG[route.name];
                        return (
                            <Text
                                style={[
                                    navStyles.label,
                                    focused ? navStyles.labelActive : navStyles.labelInactive,
                                    { color },
                                ]}
                            >
                                {tabMeta.label}
                            </Text>
                        );
                    },
                    tabBarActiveTintColor: TOKENS.primaryAlt,
                    tabBarInactiveTintColor: TOKENS.textMuted,
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: {
                        backgroundColor: TOKENS.surfaceOverlay,
                        borderTopWidth: 0,
                        borderTopColor: TOKENS.strokeLight,
                        height: tabBarHeight,
                        paddingTop: 10,
                        paddingBottom: tabBarBottomPadding,
                        paddingHorizontal: 14,
                        ...Platform.select({
                            ios: {
                                shadowColor: TOKENS.shadow,
                                shadowOpacity: 0.1,
                                shadowRadius: 24,
                                shadowOffset: { width: 0, height: -12 },
                            },
                            android: {
                                elevation: 12,
                            },
                        }),
                    },
                    tabBarLabelStyle: {
                        marginBottom: Platform.select({ ios: 2, android: 3 }),
                    },
                    tabBarIconStyle: {
                        marginTop: 0,
                    },
                    tabBarItemStyle: {
                        minHeight: 52,
                        marginHorizontal: 3,
                        marginTop: 1,
                        paddingTop: 2,
                        paddingBottom: 0,
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ tabBarLabel: 'Home' }}
                />
                <Tab.Screen
                    name="Map"
                    component={MapScreen}
                    options={{ tabBarLabel: 'Map' }}
                />
                <Tab.Screen
                    name="Park"
                    component={SessionScreen}
                    options={{ tabBarLabel: 'Park' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AppNavigation />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const navStyles = StyleSheet.create({
    iconBadge: {
        width: 40,
        height: 38,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    iconBadgeInactive: {
        backgroundColor: alpha(TOKENS.text, 0.035),
    },
    iconBadgeActive: {
        backgroundColor: TOKENS.primarySoft,
        borderWidth: 1,
        borderColor: TOKENS.focus,
        ...Platform.select({
            ios: {
                shadowColor: TOKENS.primary,
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 1,
            },
        }),
    },
    label: {
        fontSize: 11,
        letterSpacing: 0.15,
        textAlign: 'center',
    },
    labelInactive: {
        fontWeight: '600',
    },
    labelActive: {
        fontWeight: '700',
    },
});
