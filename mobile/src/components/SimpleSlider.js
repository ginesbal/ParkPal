import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SimpleSlider({
    value,
    onValueChange,
    minimumValue = 0,
    maximumValue = 100,
    step = 1,
    style,
    minimumTrackTintColor = '#666',
    maximumTrackTintColor = '#ddd',
    thumbTintColor = '#333',
}) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [layoutX, setLayoutX] = useState(0);

    const handleTouch = (event) => {
        if (containerWidth === 0) return;

        // Get touch position relative to screen
        const touchX = event.nativeEvent.pageX;
        // Calculate position within slider
        const relativeX = touchX - layoutX;
        // Clamp to slider bounds
        const clampedX = Math.max(0, Math.min(relativeX, containerWidth));
        // Calculate percentage
        const percentage = clampedX / containerWidth;
        // Calculate value
        const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
        const steppedValue = Math.round(rawValue / step) * step;
        const finalValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));

        onValueChange(finalValue);
    };

    const percentage = (value - minimumValue) / (maximumValue - minimumValue);
    const thumbPosition = containerWidth * percentage;

    return (
        <View
            style={[styles.container, style]}
            onLayout={(e) => {
                setContainerWidth(e.nativeEvent.layout.width);
                e.nativeEvent.target.measure((x, y, width, height, pageX, pageY) => {
                    setLayoutX(pageX);
                });
            }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleTouch}
            onResponderMove={handleTouch}
        >
            {/* Background track */}
            <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]} />

            {/* Filled track */}
            {containerWidth > 0 && (
                <View
                    style={[
                        styles.trackFilled,
                        {
                            width: thumbPosition,
                            backgroundColor: minimumTrackTintColor
                        }
                    ]}
                />
            )}

            {/* Thumb */}
            {containerWidth > 0 && (
                <View
                    style={[
                        styles.thumb,
                        {
                            left: thumbPosition - 10,
                            backgroundColor: thumbTintColor,
                        }
                    ]}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 32,
        justifyContent: 'center',
        position: 'relative',
        paddingVertical: 8,
    },
    track: {
        height: 4,
        borderRadius: 2,
        width: '100%',
    },
    trackFilled: {
        position: 'absolute',
        height: 4,
        borderRadius: 2,
    },
    thumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        top: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
});
