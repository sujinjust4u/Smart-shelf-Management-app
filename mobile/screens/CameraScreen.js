import React, { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { uploadImageForDetection } from '../services/api';
import { useUser } from '../context/UserContext';

export default function CameraScreen({ navigation }) {
    const { user } = useUser();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef(null);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginBottom: 20, color: 'white', fontSize: 18 }}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setImageUri(photo.uri);
        }
    };

    const retakePicture = () => {
        setImageUri(null);
    };

    const analyzeImage = async () => {
        setLoading(true);
        try {
            const result = await uploadImageForDetection(imageUri, user?.email);
            setLoading(false);
            navigation.navigate('Result', { imageUri, result });
        } catch (error) {
            setLoading(false);
            alert("Failed to analyze image. Please ensure backend is running.");
        }
    };

    if (imageUri) {
        return (
            <SafeAreaView style={styles.container}>
                <Image source={{ uri: imageUri }} style={styles.preview} />
                <View style={styles.overlayBottom}>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={retakePicture}>
                            <Text style={styles.btnText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.btn, styles.btnPrimary, loading && styles.btnDisabled]} 
                            onPress={analyzeImage}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>Analyze</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <View style={styles.cameraOverlay}>
                <View style={styles.captureAreaContainer}>
                    <View style={styles.captureFrame} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    permissionBtn: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 40 },
    permissionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    camera: { flex: 1 },
    cameraOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingBottom: 40 },
    captureAreaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    captureFrame: { width: '80%', height: '50%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 20 },
    buttonContainer: { flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
    captureButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.3)', justifyContent: 'center', alignItems: 'center' },
    captureInner: { width: 66, height: 66, borderRadius: 33, backgroundColor: 'white' },
    preview: { flex: 1, resizeMode: 'cover', borderRadius: 20, margin: 10 },
    overlayBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 30, backgroundColor: 'rgba(0,0,0,0.6)', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    btn: { flex: 1, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginHorizontal: 8 },
    btnPrimary: { backgroundColor: '#3b82f6' },
    btnSecondary: { backgroundColor: '#334155' },
    btnDisabled: { opacity: 0.7 },
    btnText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 }
});
