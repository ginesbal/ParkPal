// App.js

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// screens
import HomeScreen from './src/screens/HomeScreen/index';
import MapScreen from './src/screens/MapScreen/index';
import SessionScreen from './src/screens/SessionScreen/index';

// services
import { getDeviceId } from './src/utils/device';

// important: hook log mirroring before app mounts
import { logFile } from './src/utils/loggers/LogFile';
logFile.hook();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Session') {
                        iconName = focused ? 'car' : 'car-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1a1a1a',
                tabBarInactiveTintColor: '#a3a3a3',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f5f5f5',
                    paddingBottom: 30,
                    paddingTop: 8,
                    height: 80,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
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
                options={{ tabBarLabel: 'Find Parking' }}
            />
            <Tab.Screen
                name="Session"
                component={SessionScreen}
                options={{ tabBarLabel: 'Session' }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [, setDeviceId] = useState(null);
    const [, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            // important: capture a few bootstrap events
            console.log('[app] bootstrap start');

            // device id
            const id = await getDeviceId();
            setDeviceId(id);
            console.log('[app] device id ready', { id });

            // location permission + cache
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc.coords);
                await AsyncStorage.setItem('userLocation', JSON.stringify(loc.coords));
                console.log('[app] location cached', { lat: loc.coords.latitude, lon: loc.coords.longitude });
            } else {
                console.warn('[app] location permission denied');
            }

            // optional: ensure first buffer flush soon after launch
            setTimeout(() => { logFile.flushNow(); }, 1500);
        })();

        // important: flush remaining logs on unmount
        return () => { logFile.flushNow(); };
    }, []);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Main"
                        component={MainTabs}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
