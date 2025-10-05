import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require('./utils/assets/map-screenshot.jpg')}
                style={styles.screenshot}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    screenshot: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    overlay: {
        position: 'absolute',
        top: 80,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(37, 99, 235, 0.95)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    overlayText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
});