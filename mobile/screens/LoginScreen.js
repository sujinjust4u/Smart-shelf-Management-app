import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    SafeAreaView, TextInput, KeyboardAvoidingView,
    Platform, ActivityIndicator, Alert
} from 'react-native';
import { useUser } from '../context/UserContext';

export default function LoginScreen({ navigation }) {
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const handleSignIn = () => {
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter your name to continue.');
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setUser({ name: name.trim(), email: email.trim().toLowerCase(), picture: null });
            setLoading(false);
            navigation.replace('Dashboard');
        }, 500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoIcon}>📦</Text>
                    </View>
                    <Text style={styles.appName}>Stockify</Text>
                    <Text style={styles.tagline}>Smart Shelf Monitoring</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Welcome</Text>
                    <Text style={styles.cardSubtitle}>Sign in to start monitoring shelves and receive scan reports directly to your inbox.</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Your Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Sujin"
                            placeholderTextColor="#475569"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@gmail.com"
                            placeholderTextColor="#475569"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={handleSignIn}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.signInBtn, loading && styles.btnDisabled]}
                        onPress={handleSignIn}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.signInBtnText}>Continue →</Text>
                        }
                    </TouchableOpacity>
                </View>

                <Text style={styles.disclaimer}>
                    Your email will only be used to send you shelf scan reports.
                </Text>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
    logoContainer: { alignItems: 'center', marginBottom: 48 },
    logoCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', marginBottom: 18, borderWidth: 1, borderColor: '#334155' },
    logoIcon: { fontSize: 42 },
    appName: { fontSize: 40, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
    tagline: { fontSize: 15, color: '#64748b', marginTop: 6, letterSpacing: 0.5 },
    card: { width: '100%', backgroundColor: '#1e293b', borderRadius: 24, padding: 28, borderWidth: 1, borderColor: '#334155', marginBottom: 24 },
    cardTitle: { fontSize: 24, fontWeight: '800', color: '#f8fafc', marginBottom: 8 },
    cardSubtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 28, lineHeight: 21 },
    inputGroup: { marginBottom: 18 },
    label: { fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
    input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, color: '#f8fafc', fontSize: 16 },
    signInBtn: { backgroundColor: '#3b82f6', borderRadius: 14, paddingVertical: 17, alignItems: 'center', marginTop: 8, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
    btnDisabled: { opacity: 0.7 },
    signInBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 1 },
    disclaimer: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 20 },
});

