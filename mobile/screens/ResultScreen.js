import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function ResultScreen({ route, navigation }) {
    const { imageUri, result } = route.params;

    const { status, count } = result;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan Report</Text>
                <View style={[styles.badge, status === 'EMPTY' ? styles.badgeRed : styles.badgeGreen]}>
                    <Text style={[styles.badgeText, status === 'EMPTY' ? styles.badgeTextRed : styles.badgeTextGreen]}>{status}</Text>
                </View>
            </View>

            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: imageUri }} 
                    style={styles.image} 
                    resizeMode="cover" 
                />
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Items Detected:</Text>
                    <Text style={styles.summaryValue}>{count}</Text>
                </View>
                
                {status === 'EMPTY' && (
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>⚠️ ALERT: Shelf stock is critically low!</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity 
                style={styles.btnPrimary} 
                onPress={() => navigation.navigate('Dashboard')}
                activeOpacity={0.8}
            >
                <Text style={styles.btnText}>Return Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 },
    title: { fontSize: 28, fontWeight: '900', color: '#f8fafc', letterSpacing: 0.5 },
    badge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    badgeRed: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' },
    badgeGreen: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' },
    badgeText: { fontWeight: '800', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
    badgeTextRed: { color: '#f87171' },
    badgeTextGreen: { color: '#34d399' },
    imageContainer: { height: 350, width: '100%', backgroundColor: '#1e293b', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10, marginBottom: 30 },
    image: { width: '100%', height: '100%' },
    summaryContainer: { backgroundColor: '#1e293b', padding: 24, borderRadius: 20, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 18, color: '#94a3b8', fontWeight: '600' },
    summaryValue: { fontSize: 32, fontWeight: '900', color: '#f8fafc' },
    alertBox: { marginTop: 20, backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#ef4444' },
    alertText: { color: '#fca5a5', fontWeight: '700', fontSize: 15, letterSpacing: 0.5 },
    btnPrimary: { backgroundColor: '#3b82f6', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
    btnText: { color: 'white', fontWeight: '800', fontSize: 18, letterSpacing: 1 }
});
