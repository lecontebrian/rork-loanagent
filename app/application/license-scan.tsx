import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Platform, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, CheckCircle, Scan, Home } from 'lucide-react-native';
import colors from '@/constants/colors';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CongratulationsModal from '@/components/CongratulationsModal';

export default function LicenseScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const formData = React.useMemo(() => {
    if (!params.data) return null;
    try {
      const dataStr = Array.isArray(params.data) ? params.data[0] : params.data;
      if (typeof dataStr === 'string' && dataStr !== '[object Object]') {
        return JSON.parse(decodeURIComponent(dataStr));
      }
    } catch (e) {
      console.error('Error parsing params.data', e);
    }
    return null;
  }, [params.data]);
  const insets = useSafeAreaInsets();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  
  const cameraRef = useRef<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleStartScan = async () => {
    if (!permission) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to scan your driver\'s license.');
        return;
      }
    }
    
    if (permission && !permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }
    
    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (cameraRef.current && Platform.OS !== 'web') {
      try {
        setScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        if (!photo || !photo.uri) {
          throw new Error('Failed to capture photo');
        }
        
        setCapturedImage(photo.uri);
        setShowCamera(false);
        
        setTimeout(() => {
          const mockExtractedData = {
            licenseNumber: 'D1234567',
            state: 'CA',
            expirationDate: '2028-12-31',
            dateOfBirth: '1990-05-15',
            firstName: formData?.employmentInfo?.currentEmployer?.split(' ')[0] || 'John',
            lastName: formData?.employmentInfo?.currentEmployer?.split(' ')[1] || 'Doe',
          };
          setExtractedData(mockExtractedData);
          setScanning(false);
        }, 2000);
        
      } catch (error) {
        console.error('Error capturing photo:', error);
        setScanning(false);
        setShowCamera(false);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  const handleManualEntry = () => {
    const mockData = {
      licenseNumber: '',
      state: '',
      expirationDate: '',
      dateOfBirth: '',
    };
    setExtractedData(mockData);
  };

  const handleContinue = () => {
    // In a real app, we would save this data
    const updatedFormData = {
      ...formData,
      driversLicense: {
        ...extractedData,
        scannedImageUri: capturedImage,
      },
    };
    console.log('License data captured:', updatedFormData);
    
    setShowCongratulations(true);
  };

  const handleCongratsClose = () => {
    setShowCongratulations(false);
    setTimeout(() => {
      router.push('/dashboard' as any);
    }, 300);
  };

  if (showCamera) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera}
            facing="back"
            ref={cameraRef}
          >
            <View style={[styles.cameraOverlay, { paddingTop: insets.top }]}>
              <View style={styles.cameraHeader}>
                <TouchableOpacity
                  style={styles.cameraBackButton}
                  onPress={() => setShowCamera(false)}
                  activeOpacity={0.7}
                >
                  <ArrowLeft color={colors.white} size={24} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.cameraTitle}>Position License in Frame</Text>
                <View style={{ width: 44 }} />
              </View>

              <View style={styles.scanFrame}>
                <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
              </View>

              <View style={styles.cameraFooter}>
                <Text style={styles.cameraInstruction}>
                  Place your driver&apos;s license within the frame
                </Text>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={handleCapture}
                  disabled={scanning}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#0A84FF', '#5E5CE6']}
                    style={styles.captureButtonGradient}
                  >
                    <Camera color={colors.white} size={28} strokeWidth={2} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>ID Verification</Text>
          </View>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/dashboard' as any)}
            activeOpacity={0.7}
          >
            <Home color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.mainContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Scan color={colors.primary} size={40} strokeWidth={2} />
              </View>
            </View>

            <Text style={styles.title}>Scan Your Driver&apos;s License</Text>
            <Text style={styles.subtitle}>
              We&apos;ll use your driver&apos;s license to verify your identity and auto-fill your information
            </Text>

            {capturedImage && capturedImage.trim() !== '' && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                {scanning && (
                  <View style={styles.scanningOverlay}>
                    <View style={styles.scanningIndicator} />
                    <Text style={styles.scanningText}>Extracting information...</Text>
                  </View>
                )}
                {extractedData && !scanning && (
                  <View style={styles.extractedDataOverlay}>
                    <CheckCircle color={colors.success} size={32} strokeWidth={2} />
                    <Text style={styles.extractedText}>Information Captured</Text>
                  </View>
                )}
              </View>
            )}

            {extractedData && (
              <View style={styles.extractedDataContainer}>
                <DataField label="License Number" value={extractedData.licenseNumber} />
                <DataField label="State" value={extractedData.state} />
                <DataField label="Expiration Date" value={extractedData.expirationDate} />
                <DataField label="Date of Birth" value={extractedData.dateOfBirth} />
              </View>
            )}

            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>Tips for best results:</Text>
              <TipItem text="Place license on a flat surface" />
              <TipItem text="Ensure good lighting" />
              <TipItem text="Avoid glare and shadows" />
              <TipItem text="Capture all four corners" />
            </View>

            {!capturedImage && (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleStartScan}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#0A84FF', '#5E5CE6']}
                  style={styles.scanButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Camera color={colors.white} size={24} strokeWidth={2} />
                  <Text style={styles.scanButtonText}>Scan License</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {capturedImage && !extractedData && (
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => {
                  setCapturedImage(null);
                  setExtractedData(null);
                  setShowCamera(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            )}

            {extractedData && (
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#30D158', '#28B349']}
                  style={styles.continueButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.manualButton}
              onPress={handleManualEntry}
              activeOpacity={0.7}
            >
              <Text style={styles.manualButtonText}>Enter Information Manually</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <CongratulationsModal
        visible={showCongratulations}
        onClose={handleCongratsClose}
        title="Congratulations!"
        message="Your driver's license has been successfully verified."
        buttonText="Back to Dashboard"
      />
    </>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dataField}>
      <Text style={styles.dataFieldLabel}>{label}</Text>
      <Text style={styles.dataFieldValue}>{value}</Text>
    </View>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <View style={styles.tipItem}>
      <View style={styles.tipDot} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  homeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  mainContent: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadowMedium,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    letterSpacing: -0.2,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.surfaceTertiary,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scanningIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.primary,
    borderTopColor: 'transparent',
  },
  scanningText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
  extractedDataOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  extractedText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.success,
  },
  extractedDataContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
    marginBottom: 24,
  },
  dataField: {
    gap: 6,
  },
  dataFieldLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  dataFieldValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  tips: {
    padding: 20,
    backgroundColor: colors.infoLight,
    borderRadius: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  scanButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...colors.shadowMedium,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  scanButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  retakeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
    letterSpacing: -0.2,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...colors.shadowMedium,
  },
  continueButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  manualButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  manualButtonText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cameraBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  scanFrame: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 100,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 16,
    position: 'relative' as const,
  },
  scanCorner: {
    position: 'absolute' as const,
    width: 40,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 4,
  },
  scanCornerTopLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 16,
  },
  scanCornerTopRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 16,
  },
  scanCornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  scanCornerBottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 24,
  },
  cameraInstruction: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  captureButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
