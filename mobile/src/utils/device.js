import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

export const getDeviceId = async () => {
    try {
        // check if we already have a stored device ID
        let deviceId = await AsyncStorage.getItem('deviceId');

        if (!deviceId) {
            // generate a unique device ID
            deviceId = `${Device.brand}-${Device.modelName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            await AsyncStorage.setItem('deviceId', deviceId);
        }

        return deviceId;
    } catch (error) {
        console.error('Error getting device ID:', error);
        // fallback to a random ID
        return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};