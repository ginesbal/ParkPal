import { Animated, View } from 'react-native';
import FilterBar from './FilterBar';
import LocationSection from './LocationSection';
import QuickInfoBar from './QuickInfoBar';
import { styles } from './styles';

/**
 * header component - location, quick info, and filters
 */
const Header = ({
    location,
    spots,
    quickInfo,
    activeFilter,
    setActiveFilter,
    searchRadius,
    setSearchRadius,
    fadeAnim,
    slideAnim,
    onLocationPress
}) => {
    return (
        <Animated.View
            style={[
                styles.header,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={styles.mainHeader}>
                <LocationSection
                    locationName={location?.name || 'Downtown Calgary'}
                    onPress={onLocationPress}
                />

                {spots.length > 0 && (
                    <QuickInfoBar quickInfo={quickInfo} />
                )}
            </View>

            <FilterBar
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchRadius={searchRadius}
                setSearchRadius={setSearchRadius}
            />
        </Animated.View>
    );
};

export default Header;
