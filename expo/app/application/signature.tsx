import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Edit3, RotateCcw } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



type PathPoint = { x: number; y: number };

export default function SignatureScreen() {
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
  // const { addApplication } = useApp();
  
  const [paths, setPaths] = useState<PathPoint[][]>([]);
  const [currentPath, setCurrentPath] = useState<PathPoint[]>([]);
  const canvasRef = useRef<View>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        setPaths((prev) => [...prev, currentPath]);
        setCurrentPath([]);
      },
    })
  ).current;

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const handleSubmit = () => {
    const signatureData = JSON.stringify({ paths, timestamp: new Date().toISOString() });
    
    const completeFormData = {
      ...formData,
      signatureDataUrl: signatureData,
      signatureDate: new Date().toISOString(),
    };
    
    router.push(`/application/summary?data=${encodeURIComponent(JSON.stringify(completeFormData))}` as any);
  };

  const hasSignature = paths.length > 0 || currentPath.length > 0;

  const renderPath = (path: PathPoint[], index: number) => {
    if (path.length < 2) return null;
    


    return (
      <View
        key={index}
        style={[
          StyleSheet.absoluteFill,
          {
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: 2,
            width: 1,
            height: 1,
          }
        ]}
      />
    );
  };

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
            <Text style={styles.headerTitle}>Electronic Signature</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Edit3 color={colors.primary} size={40} strokeWidth={2} />
              </View>
            </View>

            <Text style={styles.title}>Sign Your Application</Text>
            <Text style={styles.subtitle}>
              Draw your signature below to complete your application
            </Text>

            <View style={styles.signatureContainer}>
              <View
                style={styles.signatureCanvas}
                ref={canvasRef}
                {...panResponder.panHandlers}
              >
                {!hasSignature && (
                  <View style={styles.signaturePlaceholder}>
                    <Edit3 color={colors.textTertiary} size={32} strokeWidth={1.5} />
                    <Text style={styles.placeholderText}>Sign here</Text>
                  </View>
                )}
                {paths.map((path, index) => renderPath(path, index))}
                {currentPath.length > 0 && renderPath(currentPath, -1)}
              </View>
              <View style={styles.signatureLine} />
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
              disabled={!hasSignature}
            >
              <RotateCcw 
                color={hasSignature ? colors.error : colors.textTertiary} 
                size={20} 
                strokeWidth={2} 
              />
              <Text style={[
                styles.clearButtonText,
                !hasSignature && styles.clearButtonTextDisabled
              ]}>
                Clear Signature
              </Text>
            </TouchableOpacity>

            <View style={styles.legalText}>
              <Text style={styles.legalTextContent}>
                By signing this application electronically, I certify that all information provided is true and accurate. 
                I authorize Loan Agent and its partners to verify the information and obtain credit reports as necessary.
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !hasSignature && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!hasSignature}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={hasSignature ? ['#30D158', '#28B349'] : [colors.textTertiary, colors.textTertiary]}
              style={styles.submitButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitButtonText}>Submit Application</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
    marginBottom: 32,
    letterSpacing: -0.2,
  },
  signatureContainer: {
    marginBottom: 24,
  },
  signatureCanvas: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  signaturePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    letterSpacing: -0.2,
  },
  signatureLine: {
    height: 2,
    backgroundColor: colors.border,
    marginTop: -2,
    marginHorizontal: 40,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.error,
    letterSpacing: -0.2,
  },
  clearButtonTextDisabled: {
    color: colors.textTertiary,
  },
  legalText: {
    padding: 20,
    backgroundColor: colors.infoLight,
    borderRadius: 14,
    marginTop: 24,
  },
  legalTextContent: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  footer: {
    padding: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
});
