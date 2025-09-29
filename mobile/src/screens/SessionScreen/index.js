import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSessionManager } from '../../hooks/useSessionManager';
import EmptyState from './components/EmptyState';
import ActiveSession from './components/ActiveSession';
import { styles } from './SessionScreen.styles';

/**
 * SessionScreen - Main parking session management screen
 * Handles both empty state (start session) and active session views
 */
export default function SessionScreen() {
  const {
    // Session data
    session,
    sessionState,
    timeRemaining,
    elapsedTime,
    progress,
    
    // Session actions
    startSession,
    endSession,
    extendSession,
    
    // Form state for new sessions
    vehiclePlate,
    setVehiclePlate,
    selectedRate,
    setSelectedRate,
    selectedDuration,
    setSelectedDuration,
    
    // Computed values
    totalCost,
    endTime,
  } = useSessionManager();

  if (!session) {
    return (
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.container}>
        <StatusBar style="dark" />
        <EmptyState
          vehiclePlate={vehiclePlate}
          setVehiclePlate={setVehiclePlate}
          selectedRate={selectedRate}
          setSelectedRate={setSelectedRate}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          onStartSession={startSession}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar style="dark" />
      <ActiveSession
        session={session}
        sessionState={sessionState}
        timeRemaining={timeRemaining}
        elapsedTime={elapsedTime}
        progress={progress}
        totalCost={totalCost}
        endTime={endTime}
        onExtend={extendSession}
        onEnd={endSession}
      />
    </SafeAreaView>
  );
}