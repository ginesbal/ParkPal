// src/screens/SessionScreen/index.js

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessionManager } from '../../hooks/useSessionManager';
import { logger } from '../../utils/loggers';
import ActiveSession from './components/ActiveSession';
import EmptyState from './components/EmptyState';
import { styles } from './SessionScreen.styles';

/**
 * SessionScreen - parking session management
 */
export default function SessionScreen() {
  const {
    // session data
    session,
    sessionState,
    timeRemaining,
    elapsedTime,
    progress,

    // actions
    startSession,
    endSession,
    extendSession,

    // form state
    vehiclePlate,
    setVehiclePlate,
    selectedRate,
    setSelectedRate,
    selectedDuration,
    setSelectedDuration,

    // computed
    totalCost,
    endTime,
  } = useSessionManager();

  // log screen mount once
  React.useEffect(() => {
    logger.log('session_screen_mount');
  }, []);

  // log state transitions
  React.useEffect(() => {
    logger.log('session_state_update', {
      hasSession: !!session,
      state: sessionState || 'idle',
      totalCost,
      endTime,
    });
  }, [session, sessionState, totalCost, endTime]);

  // wrap actions with logs
  const handleStart = React.useCallback(() => {
    logger.log('session_start_request', {
      plate: vehiclePlate || null,
      rate: selectedRate,
      durationMin: selectedDuration,
    });
    startSession();
  }, [vehiclePlate, selectedRate, selectedDuration, startSession]);

  const handleExtend = React.useCallback(() => {
    logger.log('session_extend_request', {
      currentEndTime: endTime,
      elapsedSec: elapsedTime,
    });
    extendSession();
  }, [extendSession, endTime, elapsedTime]);

  const handleEnd = React.useCallback(() => {
    logger.log('session_end_request', {
      elapsedSec: elapsedTime,
      totalCost,
    });
    endSession();
  }, [endSession, elapsedTime, totalCost]);

  // form changes (debounced-ish: only log real changes)
  const prevFormRef = React.useRef({
    plate: vehiclePlate,
    rate: selectedRate,
    duration: selectedDuration,
  });

  React.useEffect(() => {
    const prev = prevFormRef.current;

    if (vehiclePlate !== prev.plate) {
      logger.log('form_plate_changed', { plateLen: vehiclePlate?.length || 0 });
      prev.plate = vehiclePlate;
    }
    if (selectedRate !== prev.rate) {
      logger.log('form_rate_changed', { rate: selectedRate });
      prev.rate = selectedRate;
    }
    if (selectedDuration !== prev.duration) {
      logger.log('form_duration_changed', { minutes: selectedDuration });
      prev.duration = selectedDuration;
    }
  }, [vehiclePlate, selectedRate, selectedDuration]);

  // rendering branches
  if (!session) {
    // log view swap so we can trace empty vs active ui
    React.useEffect(() => {
      logger.log('session_view_empty');
    }, []);
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
          onStartSession={handleStart}
        />
      </SafeAreaView>
    );
  }

  // active session
  React.useEffect(() => {
    logger.log('session_view_active', {
      timeRemainingSec: timeRemaining,
      progress,
    });
  }, [timeRemaining, progress]);

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
        onExtend={handleExtend}
        onEnd={handleEnd}
      />
    </SafeAreaView>
  );
}
