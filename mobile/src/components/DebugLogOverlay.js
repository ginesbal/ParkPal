// In-app debug overlay for reading debug logs without leaving the app.
//
// Why: console output in Expo Go goes to the Metro terminal, which is easy
// to miss. This overlay renders the most recent DBG / KBD logger entries
// directly on screen so the repro-and-read loop is tight.
//
// Usage: drop <DebugLogOverlay /> anywhere inside a screen (absolute-
// positioned). Tap the header to collapse; tap "clear" to wipe.
//
// Gated on __DEV__ — renders nothing in production.

import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { logger } from '../utils/loggers';

const INTERESTING_TYPES = new Set(['DBG', 'KBD']);
const MAX_VISIBLE = 30;

export default function DebugLogOverlay() {
    const [open, setOpen] = useState(true);
    const [entries, setEntries] = useState([]);
    const mountedAt = useRef(Date.now()).current;

    useEffect(() => {
        if (!__DEV__) return undefined;
        // Poll the logger so we don't need to wire a subscription API.
        // 250ms is fast enough to feel live without wasting battery.
        const id = setInterval(() => {
            const all = logger.getLogs?.() || [];
            const filtered = all.filter((e) => INTERESTING_TYPES.has(e.type));
            setEntries(filtered.slice(-MAX_VISIBLE));
        }, 250);
        return () => clearInterval(id);
    }, []);

    if (!__DEV__) return null;

    return (
        <View style={styles.container} pointerEvents="box-none">
            <View style={styles.panel} pointerEvents="auto">
                <Pressable onPress={() => setOpen((o) => !o)} style={styles.header}>
                    <Text style={styles.headerText}>
                        {open ? '▼' : '▶'} debug ({entries.length})
                    </Text>
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation?.();
                            logger.clear?.();
                            setEntries([]);
                        }}
                        hitSlop={8}
                    >
                        <Text style={styles.clearText}>clear</Text>
                    </Pressable>
                </Pressable>
                {open && (
                    <ScrollView
                        style={styles.body}
                        contentContainerStyle={styles.bodyContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {entries.length === 0 ? (
                            <Text style={styles.emptyText}>
                                tap the search bar — events will appear here
                            </Text>
                        ) : (
                            entries
                                .slice()
                                .reverse()
                                .map((e, i) => {
                                    const relMs = new Date(e.time).getTime() - mountedAt;
                                    return (
                                        <Text key={i} style={styles.line}>
                                            <Text style={styles.tMark}>+{relMs}ms </Text>
                                            <Text style={styles.tagMark}>[{e.type}] </Text>
                                            <Text style={styles.actionMark}>{e.action}</Text>
                                            {e.data ? (
                                                <Text style={styles.dataMark}>
                                                    {' '}{formatData(e.data)}
                                                </Text>
                                            ) : null}
                                        </Text>
                                    );
                                })
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

function formatData(d) {
    try {
        const s = JSON.stringify(d);
        return s.length > 180 ? s.slice(0, 180) + '…' : s;
    } catch {
        return '';
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 90,
        right: 6,
        width: 300,
        zIndex: 9999,
    },
    panel: {
        backgroundColor: 'rgba(20,20,20,0.9)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    headerText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Menlo',
        fontWeight: '600',
    },
    clearText: {
        color: '#f99',
        fontSize: 11,
        fontFamily: 'Menlo',
    },
    body: {
        maxHeight: 260,
    },
    bodyContent: {
        padding: 8,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontFamily: 'Menlo',
        fontStyle: 'italic',
    },
    line: {
        color: '#eee',
        fontSize: 10,
        fontFamily: 'Menlo',
        lineHeight: 14,
        marginBottom: 2,
    },
    tMark: { color: '#7adcff' },
    tagMark: { color: '#ffd479' },
    actionMark: { color: '#fff', fontWeight: '600' },
    dataMark: { color: 'rgba(255,255,255,0.7)' },
});
