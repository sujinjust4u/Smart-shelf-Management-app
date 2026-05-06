import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, StatusBar, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getStats, getHistory } from '../services/api';

export default function DashboardScreen({ navigation }) {
    const { user } = useUser();
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const statsData = await getStats();
            setStats(statsData);
            const historyData = await getHistory();
            setHistory(historyData);
        } catch (e) {
            console.log('Failed to fetch data');
        }
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyCard}>
            <View>
                <Text style={styles.historyDate}>{new Date(item.timestamp).toLocaleString()}</Text>
                <Text style={styles.historyDetail}>Items detected: <Text style={{color: '#fff', fontWeight: 'bold'}}>{item.item_count}</Text></Text>
            </View>
            <View style={[styles.statusBadge, item.status === 'EMPTY' ? styles.badgeRed : styles.badgeGreen]}>
                <Text style={[styles.badgeText, item.status === 'EMPTY' ? styles.badgeTextRed : styles.badgeTextGreen]}>{item.status}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
            
            <View style={styles.heroSection}>
                <View style={styles.heroRow}>
                    <View>
                        <Text style={styles.heroTitle}>Hello, {user?.name?.split(' ')[0] || 'Admin'} 👋</Text>
                        <Text style={styles.heroSubtitle}>Real-time stock monitoring</Text>
                    </View>
                    {user?.picture ? (
                        <Image source={{ uri: user.picture }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>{(user?.name?.[0] || 'A').toUpperCase()}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { borderLeftColor: '#3b82f6', borderLeftWidth: 4 }]}>
                    <Text style={styles.statLabel}>Total Checks</Text>
                    <Text style={styles.statValue}>{stats?.total_checks || 0}</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#ef4444', borderLeftWidth: 4 }]}>
                    <Text style={styles.statLabel}>Empty Alerts</Text>
                    <Text style={[styles.statValue, { color: '#ef4444' }]}>{stats?.empty_shelves || 0}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.scanButton} 
                onPress={() => navigation.navigate('Camera')}
                activeOpacity={0.8}
            >
                <Text style={styles.scanButtonText}>Capture Shelf</Text>
            </TouchableOpacity>

            <View style={styles.listHeaderContainer}>
                <Text style={styles.sectionTitle}>Recent Scans</Text>
            </View>
            
            <FlatList
                data={history}
                keyExtractor={item => item.id?.toString() || Math.random().toString()}
                renderItem={renderHistoryItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor="#38bdf8" />}
                ListEmptyComponent={<Text style={styles.emptyText}>No recent scans available.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 20 },
    heroSection: { marginTop: 20, marginBottom: 30 },
    heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    heroTitle: { fontSize: 28, fontWeight: '900', color: '#f8fafc', letterSpacing: 0.5 },
    avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#3b82f6' },
    avatarPlaceholder: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
    avatarInitial: { color: '#fff', fontWeight: '800', fontSize: 20 },
    heroSubtitle: { fontSize: 16, color: '#94a3b8', marginTop: 4 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    statCard: { flex: 1, backgroundColor: '#1e293b', padding: 20, borderRadius: 16, marginHorizontal: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
    statLabel: { fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: '600' },
    statValue: { fontSize: 36, fontWeight: 'bold', color: '#f8fafc' },
    scanButton: { backgroundColor: '#3b82f6', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 30, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
    scanButtonText: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
    listHeaderContainer: { marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
    listContainer: { paddingBottom: 30 },
    historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: 20, borderRadius: 16, marginBottom: 12 },
    historyDate: { fontSize: 15, fontWeight: '700', color: '#f8fafc', marginBottom: 4 },
    historyDetail: { fontSize: 14, color: '#94a3b8' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
    badgeRed: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' },
    badgeGreen: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' },
    badgeText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    badgeTextRed: { color: '#f87171' },
    badgeTextGreen: { color: '#34d399' },
    emptyText: { color: '#64748b', textAlign: 'center', marginTop: 20, fontSize: 16 }
});
