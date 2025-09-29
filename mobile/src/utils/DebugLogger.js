// =====================================
// FILE: src/utils/DebugLogger.js
// =====================================
import AsyncStorage from '@react-native-async-storage/async-storage';

class DebugLogger {
    constructor() {
        this.logs = [];
        this.sessionId = Date.now();
        this.maxLogs = 1000; // Maximum logs to keep in memory
    }

    // Format object for logging
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

    // Log spot data specifically
    logSpotData(spot, context = '') {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type: 'SPOT_DATA',
            context,
            sessionId: this.sessionId,
            data: {
                // Basic info
                id: spot?.id,
                spot_type: spot?.spot_type,
                address: spot?.address,
                address_desc: spot?.address_desc,

                // Location
                coordinates: spot?.coordinates ? {
                    type: spot.coordinates.type,
                    coordinates: spot.coordinates.coordinates
                } : null,

                // Distance/Time
                distance: spot?.distance,
                walkingTime: spot?.walkingTime,

                // Direct fields from database
                status: spot?.status,
                global_id: spot?.global_id,
                permit_zone: spot?.permit_zone,
                price_zone: spot?.price_zone,
                html_zone_rate: spot?.html_zone_rate ?
                    (spot.html_zone_rate.substring(0, 100) + '...') : null,
                block_side: spot?.block_side,
                enforceable_time: spot?.enforceable_time,
                zone_cap: spot?.zone_cap,
                zone_length: spot?.zone_length,
                seg_cap: spot?.seg_cap,
                seg_length: spot?.seg_length,
                max_time: spot?.max_time,
                zone_type: spot?.zone_type,
                parking_restrict_type: spot?.parking_restrict_type,
                parking_restrict_time: spot?.parking_restrict_time,
                lot_name: spot?.lot_name,
                parking_type: spot?.parking_type,
                lot_num: spot?.lot_num,
                home_page: spot?.home_page,
                description: spot?.description,
                parking_zone: spot?.parking_zone,
                ctp_class: spot?.ctp_class,
                dot: spot?.dot,
                parking_restriction: spot?.parking_restriction,
                time_restriction: spot?.time_restriction,
                no_stopping: spot?.no_stopping,
                octant: spot?.octant,
                stall_type: spot?.stall_type,
                camera: spot?.camera,
                capacity: spot?.capacity,

                // Nested objects
                zone_info: this.parseJsonField(spot?.zone_info),
                metadata: this.parseJsonField(spot?.metadata),

                // Check for any other fields
                otherFields: this.getOtherFields(spot)
            }
        };

        this.addLog(logEntry);
        console.log('=== SPOT DATA LOG ===');
        console.log('Context:', context);
        console.log('Timestamp:', timestamp);
        console.log('Full Data:', JSON.stringify(logEntry.data, null, 2));

        return logEntry;
    }

    // Parse JSON fields safely
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

    // Get any fields not explicitly listed
    getOtherFields(spot) {
        if (!spot || typeof spot !== 'object') return {};

        const knownFields = [
            'id', 'spot_type', 'address', 'address_desc', 'coordinates',
            'distance', 'walkingTime', 'status', 'global_id', 'permit_zone',
            'price_zone', 'html_zone_rate', 'block_side', 'enforceable_time',
            'zone_cap', 'zone_length', 'seg_cap', 'seg_length', 'max_time',
            'zone_type', 'parking_restrict_type', 'parking_restrict_time',
            'lot_name', 'parking_type', 'lot_num', 'home_page', 'description',
            'parking_zone', 'ctp_class', 'dot', 'parking_restriction',
            'time_restriction', 'no_stopping', 'octant', 'stall_type',
            'camera', 'capacity', 'zone_info', 'metadata'
        ];

        const otherFields = {};
        Object.keys(spot).forEach(key => {
            if (!knownFields.includes(key)) {
                otherFields[key] = this.formatObject(spot[key], 0, 2);
            }
        });

        return otherFields;
    }

    // Log API response
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
                sample: Array.isArray(response?.data) && response.data.length > 0
                    ? this.formatObject(response.data[0], 0, 3)
                    : this.formatObject(response?.data, 0, 3),
                error: response?.error
            }
        };

        this.addLog(logEntry);
        console.log('=== API RESPONSE LOG ===');
        console.log('Endpoint:', endpoint);
        console.log('Context:', context);
        console.log('Response:', JSON.stringify(logEntry.data, null, 2));

        return logEntry;
    }

    // Log component state
    logComponentState(componentName, state, context = '') {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type: 'COMPONENT_STATE',
            context,
            sessionId: this.sessionId,
            data: {
                componentName,
                state: this.formatObject(state, 0, 3)
            }
        };

        this.addLog(logEntry);
        console.log(`=== ${componentName} STATE ===`);
        console.log('Context:', context);
        console.log('State:', JSON.stringify(logEntry.data.state, null, 2));

        return logEntry;
    }

    // Log card flip event
    logCardFlip(spot, isFlipped) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type: 'CARD_FLIP',
            sessionId: this.sessionId,
            data: {
                isFlipped,
                spotId: spot?.id,
                spotAddress: spot?.address || spot?.address_desc,
                hasDetails: {
                    permit_zone: !!(spot?.permit_zone || spot?.zone_info?.permit_zone),
                    max_time: !!(spot?.max_time || spot?.metadata?.max_time),
                    price_zone: !!(spot?.price_zone || spot?.zone_info?.price_zone),
                    parking_restriction: !!(spot?.parking_restriction || spot?.metadata?.parking_restriction),
                    camera: !!(spot?.camera || spot?.metadata?.camera),
                    lot_name: !!(spot?.lot_name || spot?.metadata?.lot_name)
                }
            }
        };

        this.addLog(logEntry);
        console.log('=== CARD FLIP EVENT ===');
        console.log('Flipped to:', isFlipped ? 'BACK (Details)' : 'FRONT');
        console.log('Has Details:', logEntry.data.hasDetails);

        return logEntry;
    }

    // Log general message
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
        console.log(`[${type}] ${message}`, data ? JSON.stringify(data, null, 2) : '');

        return logEntry;
    }

    // Add log to memory
    addLog(logEntry) {
        this.logs.push(logEntry);

        // Keep only the latest logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
    }

    // Export logs to file
    async exportLogs() {
        try {
            const exportData = {
                sessionId: this.sessionId,
                exportTime: new Date().toISOString(),
                totalLogs: this.logs.length,
                logs: this.logs
            };

            const fileName = `parking_debug_${this.sessionId}.json`;

            // Save to AsyncStorage (you can retrieve this later)
            await AsyncStorage.setItem(`debug_log_${this.sessionId}`, JSON.stringify(exportData));

            console.log('=== LOGS EXPORTED ===');
            console.log('File name:', fileName);
            console.log('Total logs:', this.logs.length);
            console.log('Session ID:', this.sessionId);
            console.log('To retrieve: AsyncStorage.getItem("debug_log_' + this.sessionId + '")');

            // Return the data so it can be shared or saved
            return exportData;
        } catch (error) {
            console.error('Failed to export logs:', error);
            return null;
        }
    }

    // Get all logs
    getAllLogs() {
        return this.logs;
    }

    // Clear logs
    clearLogs() {
        this.logs = [];
        console.log('=== LOGS CLEARED ===');
    }

    // Get summary of current logs
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

        console.log('=== LOG SUMMARY ===');
        console.log(JSON.stringify(summary, null, 2));

        return summary;
    }
}

// Create singleton instance
const logger = new DebugLogger();

export default logger;
export { logger }; // <-- named export added
