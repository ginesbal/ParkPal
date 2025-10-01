// src/utils/loggers/SimpleLogger.js
// simple logger for tracking user actions

import AsyncStorage from '@react-native-async-storage/async-storage';

class SimpleLogger {
    constructor() {
        this.logs = [];
        this.sessionId = Date.now();
        this.maxLogs = 500; // keep memory usage low
        
        // clear old logs on startup
        this.cleanup();
    }

    // main logging function
    log(action, data = null) {
        const entry = {
            time: new Date().toISOString(),
            action: action,
            data: data
        };
        
        this.logs.push(entry);
        
        // keep array size under control
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // print to console in development
        if (__DEV__) {
            console.log(`[LOG] ${action}`, data || '');
        }
        
        // auto-save every 20 logs
        if (this.logs.length % 20 === 0) {
            this.save();
        }
    }

    // save to storage
    async save() {
        try {
            const key = `simple_logs_${this.sessionId}`;
            await AsyncStorage.setItem(key, JSON.stringify(this.logs));
        } catch (error) {
            console.error('[SimpleLogger] Save failed:', error);
        }
    }

    // cleanup old session logs
    async cleanup() {
        try {
            const oldSession = await AsyncStorage.getItem('simple_last_session');
            if (oldSession && oldSession !== this.sessionId.toString()) {
                await AsyncStorage.removeItem(`simple_logs_${oldSession}`);
            }
            await AsyncStorage.setItem('simple_last_session', this.sessionId.toString());
        } catch (error) {
            // silent fail, not critical
        }
    }

    // get current logs
    getLogs() {
        return this.logs;
    }

    // clear current session
    clear() {
        this.logs = [];
    }
}

const simpleLogger = new SimpleLogger();

export default simpleLogger;
export { simpleLogger };