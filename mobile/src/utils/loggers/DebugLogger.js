    // src/utils/loggers/DebugLogger.js
    // detailed logger for debugging parking data

    import AsyncStorage from '@react-native-async-storage/async-storage';

    class DebugLogger {
        constructor() {
            this.logs = [];
            this.sessionId = Date.now();
            this.maxLogs = 1000; // maximum logs to keep in memory
            
            // initialize session on app start
            this.initializeSession();
        }

        // initialize new session and clear old logs
        async initializeSession() {
            try {
                const previousSessionId = await AsyncStorage.getItem('debug_session_id');
                
                if (previousSessionId && previousSessionId !== this.sessionId.toString()) {
                    // clear logs from previous session
                    await AsyncStorage.removeItem(`debug_logs_${previousSessionId}`);
                    console.log(`[DebugLogger] Cleared previous session: ${previousSessionId}`);
                }
                
                await AsyncStorage.setItem('debug_session_id', this.sessionId.toString());
                console.log(`[DebugLogger] New session: ${this.sessionId}`);
            } catch (error) {
                console.error('[DebugLogger] Init failed:', error);
            }
        }

        // format object for logging
        formatObject(obj, depth = 0, maxDepth = 4) {
            if (depth > maxDepth) return '[Max Depth]';
            if (obj === null) return 'null';
            if (obj === undefined) return 'undefined';

            const type = typeof obj;

            if (type === 'function') return '[Function]';
            if (type === 'string' || type === 'number' || type === 'boolean') return obj;

            if (Array.isArray(obj)) {
                if (obj.length === 0) return '[]';
                return `[Array(${obj.length})]`;
            }

            if (type === 'object') {
                try {
                    const keys = Object.keys(obj);
                    if (keys.length === 0) return '{}';

                    const formatted = {};
                    keys.forEach(key => {
                        formatted[key] = this.formatObject(obj[key], depth + 1, maxDepth);
                    });

                    return formatted;
                } catch (e) {
                    return '[Object]';
                }
            }

            return String(obj);
        }

        // log spot data specifically
        logSpotData(spot, context = '') {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                type: 'SPOT_DATA',
                context,
                sessionId: this.sessionId,
                data: {
                    // basic info
                    id: spot?.id,
                    spot_type: spot?.spot_type,
                    address: spot?.address,
                    address_desc: spot?.address_desc,

                    // location
                    coordinates: spot?.coordinates ? {
                        type: spot.coordinates.type,
                        coordinates: spot.coordinates.coordinates
                    } : null,

                    // distance/time
                    distance: spot?.distance,
                    walkingTime: spot?.walkingTime,

                    // zone info
                    permit_zone: spot?.permit_zone,
                    price_zone: spot?.price_zone,
                    html_zone_rate: spot?.html_zone_rate ?
                        (spot.html_zone_rate.substring(0, 100) + '...') : null,
                    max_time: spot?.max_time,
                    
                    // nested objects
                    zone_info: this.parseJsonField(spot?.zone_info),
                    metadata: this.parseJsonField(spot?.metadata),
                }
            };

            this.addLog(logEntry);
            
            if (__DEV__) {
                console.log('[SPOT DATA]', context);
                console.log('Full Data:', JSON.stringify(logEntry.data, null, 2));
            }

            return logEntry;
        }

        // parse json fields safely
        parseJsonField(field) {
            if (!field) return null;
            if (typeof field === 'object') return field;
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                } catch (e) {
                    return { _raw: field, _parseError: e.message };
                }
            }
            return field;
        }

        // log api response
        logApiResponse(endpoint, response, context = '') {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                type: 'API_RESPONSE',
                context,
                sessionId: this.sessionId,
                data: {
                    endpoint,
                    status: response?.status,
                    success: response?.success,
                    dataType: Array.isArray(response?.data) ? 'array' : typeof response?.data,
                    dataLength: Array.isArray(response?.data) ? response.data.length : null,
                    error: response?.error
                }
            };

            this.addLog(logEntry);
            
            if (__DEV__) {
                console.log('[API]', endpoint, context);
                console.log('Response:', JSON.stringify(logEntry.data, null, 2));
            }

            return logEntry;
        }

        // log general message
        log(message, data = null, type = 'INFO') {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                type,
                sessionId: this.sessionId,
                message,
                data: data ? this.formatObject(data, 0, 3) : null
            };

            this.addLog(logEntry);
            
            if (__DEV__) {
                console.log(`[${type}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
            }

            return logEntry;
        }

        // add log to memory
        addLog(logEntry) {
            this.logs.push(logEntry);

            // keep only the latest logs
            if (this.logs.length > this.maxLogs) {
                this.logs = this.logs.slice(-this.maxLogs);
            }

            // auto-save every 10 logs
            if (this.logs.length % 10 === 0) {
                this.persistLogs();
            }
        }

        // persist logs to storage
        async persistLogs() {
            try {
                const logData = {
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString(),
                    totalLogs: this.logs.length,
                    logs: this.logs
                };
                
                await AsyncStorage.setItem(
                    `debug_logs_${this.sessionId}`,
                    JSON.stringify(logData)
                );
            } catch (error) {
                console.error('[DebugLogger] Persist failed:', error);
            }
        }

        // export logs for debugging
        async exportLogs() {
            try {
                await this.persistLogs();
                
                const exportData = {
                    sessionId: this.sessionId,
                    exportTime: new Date().toISOString(),
                    totalLogs: this.logs.length,
                    logs: this.logs
                };

                console.log('[EXPORT] Logs ready for export');
                console.log(`Session: ${this.sessionId}`);
                console.log(`Total logs: ${this.logs.length}`);

                return exportData;
            } catch (error) {
                console.error('[DebugLogger] Export failed:', error);
                return null;
            }
        }

        // get all logs
        getAllLogs() {
            return this.logs;
        }

        // clear logs
        clearLogs() {
            this.logs = [];
            console.log('[DebugLogger] Logs cleared');
        }

        // get summary
        getSummary() {
            const summary = {
                sessionId: this.sessionId,
                totalLogs: this.logs.length,
                logTypes: {},
                timeRange: {
                    start: this.logs[0]?.timestamp,
                    end: this.logs[this.logs.length - 1]?.timestamp
                }
            };

            this.logs.forEach(log => {
                summary.logTypes[log.type] = (summary.logTypes[log.type] || 0) + 1;
            });

            console.log('[SUMMARY]', JSON.stringify(summary, null, 2));
            return summary;
        }
    }

    // create singleton instance
    const debugLogger = new DebugLogger();

    export default debugLogger;
    export { debugLogger };