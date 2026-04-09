import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Text, View } from 'react-native';
import { TOKENS } from '../../../../constants/theme';
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
    onLocationPress,
    statusMessage,
    statusTone = 'info',
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

                {statusMessage ? (
                    <View
                        style={[
                            styles.statusBanner,
                            statusTone === 'warning' ? styles.statusBannerWarning : styles.statusBannerInfo,
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={statusTone === 'warning' ? 'wifi-alert' : 'crosshairs-question'}
                            size={16}
                            color={statusTone === 'warning' ? TOKENS.warning : TOKENS.primary}
                        />
                        <Text style={styles.statusBannerText}>{statusMessage}</Text>
                    </View>
                ) : null}
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
