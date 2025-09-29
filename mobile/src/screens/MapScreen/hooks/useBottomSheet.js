import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Easing } from 'react-native';

export const useBottomSheet = ({ collapsedOffset }) => {
    const [isSheetExpanded, setIsSheetExpanded] = useState(false);
    const [viewMode, setViewMode] = useState('map');

    // Core animations
    const bottomSheetTranslateY = useRef(new Animated.Value(collapsedOffset)).current;
    const controlsOpacity = useRef(new Animated.Value(1)).current;
    const controlsTranslateY = useRef(new Animated.Value(0)).current;
    const selectedAnim = useRef(new Animated.Value(0)).current;
    const pinDropAnim = useRef(new Animated.Value(0)).current;

    // Track if we're currently dragging
    const isDragging = useRef(false);

    // Re-initialize when collapsed offset changes
    useEffect(() => {
        if (!isDragging.current) {
            bottomSheetTranslateY.setValue(collapsedOffset);
            setIsSheetExpanded(false);
            setViewMode('map');
        }
    }, [collapsedOffset, bottomSheetTranslateY]);

    // Control animations
    const showControls = useCallback(() => {
        Animated.parallel([
            Animated.timing(controlsOpacity, { 
                toValue: 1, 
                duration: 200, 
                useNativeDriver: true 
            }),
            Animated.timing(controlsTranslateY, { 
                toValue: 0, 
                duration: 200, 
                useNativeDriver: true 
            }),
        ]).start();
    }, [controlsOpacity, controlsTranslateY]);

    const hideControls = useCallback(() => {
        Animated.parallel([
            Animated.timing(controlsOpacity, { 
                toValue: 0, 
                duration: 200, 
                useNativeDriver: true 
            }),
            Animated.timing(controlsTranslateY, { 
                toValue: -50, 
                duration: 200, 
                useNativeDriver: true 
            }),
        ]).start();
    }, [controlsOpacity, controlsTranslateY]);

    // Sheet animations with smooth timing curves
    const expandSheet = useCallback(() => {
        setIsSheetExpanded(true);
        setViewMode('list');
        Animated.parallel([
            Animated.timing(bottomSheetTranslateY, { 
                toValue: 0, 
                duration: 400,  // Smooth duration
                useNativeDriver: false, 
                easing: Easing.inOut(Easing.cubic)  // Smooth easing curve
            }),
            Animated.timing(controlsOpacity, { 
                toValue: 0, 
                duration: 200, 
                useNativeDriver: true 
            }),
            Animated.timing(controlsTranslateY, { 
                toValue: -50, 
                duration: 200, 
                useNativeDriver: true 
            }),
        ]).start();
    }, [bottomSheetTranslateY, controlsOpacity, controlsTranslateY]);

    const collapseSheet = useCallback(() => {
        setIsSheetExpanded(false);
        setViewMode('map');
        Animated.parallel([
            Animated.timing(bottomSheetTranslateY, {
                toValue: collapsedOffset,
                duration: 400,  // Smooth duration
                useNativeDriver: false,
                easing: Easing.inOut(Easing.cubic)  // Smooth easing curve
            }),
            Animated.timing(controlsOpacity, { 
                toValue: 1, 
                duration: 300, 
                delay: 200,  // Delay for better UX
                useNativeDriver: true 
            }),
            Animated.timing(controlsTranslateY, { 
                toValue: 0, 
                duration: 300, 
                delay: 200,
                useNativeDriver: true 
            }),
        ]).start();
    }, [collapsedOffset, bottomSheetTranslateY, controlsOpacity, controlsTranslateY]);

    // Simple toggle function
    const toggleSheet = useCallback(() => {
        if (isSheetExpanded) {
            collapseSheet();
        } else {
            expandSheet();
        }
    }, [isSheetExpanded, expandSheet, collapseSheet]);

    // Import Easing at the top
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Very sensitive to vertical movement
                const isVerticalSwipe = Math.abs(gestureState.dy) > 3;
                const isMainlyVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
                return isVerticalSwipe && isMainlyVertical;
            },
            onPanResponderGrant: () => {
                isDragging.current = true;
                // Stop any animations and prepare for drag
                bottomSheetTranslateY.stopAnimation();
                bottomSheetTranslateY.extractOffset();
            },
            onPanResponderMove: (_, gestureState) => {
                // Direct mapping of drag to sheet position
                const clampedValue = Math.max(0, Math.min(collapsedOffset, gestureState.dy));
                bottomSheetTranslateY.setValue(clampedValue);
            },
            onPanResponderRelease: (_, gestureState) => {
                isDragging.current = false;
                bottomSheetTranslateY.flattenOffset();
                
                const currentPosition = bottomSheetTranslateY._value;
                const velocity = gestureState.vy;
                
                // Smooth release with velocity-based animation
                if (velocity < -0.3) {
                    // Strong upward swipe - expand with smooth animation
                    Animated.timing(bottomSheetTranslateY, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                        easing: Easing.out(Easing.cubic)
                    }).start(() => {
                        setIsSheetExpanded(true);
                        setViewMode('list');
                        hideControls();
                    });
                } else if (velocity > 0.3) {
                    // Strong downward swipe - collapse with smooth animation
                    Animated.timing(bottomSheetTranslateY, {
                        toValue: collapsedOffset,
                        duration: 300,
                        useNativeDriver: false,
                        easing: Easing.out(Easing.cubic)
                    }).start(() => {
                        setIsSheetExpanded(false);
                        setViewMode('map');
                        showControls();
                    });
                } else {
                    // Position-based: 30% threshold makes it easier to expand
                    if (currentPosition < collapsedOffset * 0.3) {
                        expandSheet();
                    } else {
                        collapseSheet();
                    }
                }
            },
        })
    ).current;
    
    // Recreate pan responder when dependencies change
    useEffect(() => {
        // Dependencies are handled via refs, so no need to recreate
    }, [collapsedOffset, expandSheet, collapseSheet, hideControls, showControls]);

    const panHandlers = useMemo(() => panResponder.panHandlers, [panResponder]);

    return {
        isSheetExpanded,
        setIsSheetExpanded,
        viewMode,
        setViewMode,
        bottomSheetTranslateY,
        controlsOpacity,
        controlsTranslateY,
        selectedAnim,
        pinDropAnim,
        expandSheet,
        collapseSheet,
        showControls,
        hideControls,
        panHandlers,
        toggleSheet,
    };
};