import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Sparkles } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface CongratulationsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  showConfetti?: boolean;
}

export default function CongratulationsModal({
  visible,
  onClose,
  title,
  message,
  buttonText = 'Continue',
  showConfetti = true,
}: CongratulationsModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const confettiAnims = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(-100),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      if (showConfetti) {
        confettiAnims.forEach((anim, index) => {
          const delay = index * 50;
          const randomX = (Math.random() - 0.5) * width * 0.8;
          const randomRotation = Math.random() * 720;

          Animated.parallel([
            Animated.timing(anim.translateY, {
              toValue: height * 1.2,
              duration: 3000 + Math.random() * 1000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateX, {
              toValue: randomX,
              duration: 3000 + Math.random() * 1000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: randomRotation,
              duration: 3000 + Math.random() * 1000,
              delay,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(anim.scale, {
                toValue: 1.5,
                duration: 500,
                delay,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        });
      }
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      confettiAnims.forEach((anim) => {
        anim.translateY.setValue(-100);
        anim.translateX.setValue(0);
        anim.rotate.setValue(0);
        anim.scale.setValue(1);
      });
    }
  }, [visible, fadeAnim, scaleAnim, confettiAnims, showConfetti]);

  const confettiColors = [
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
    '#F43F5E',
    '#F97316',
    '#F59E0B',
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.blurContainer}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {showConfetti &&
            confettiAnims.map((anim, index) => {
              const rotate = anim.rotate.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.confetti,
                    {
                      backgroundColor:
                        confettiColors[index % confettiColors.length],
                      transform: [
                        { translateY: anim.translateY },
                        { translateX: anim.translateX },
                        { rotate },
                        { scale: anim.scale },
                      ],
                    },
                  ]}
                />
              );
            })}

          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.iconBackground}>
              <LinearGradient
                colors={['#30D158', '#28B349']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <CheckCircle size={64} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>
            </View>

            <View style={styles.sparklesContainer}>
              <Sparkles
                size={24}
                color="#F59E0B"
                strokeWidth={2}
                style={styles.sparkle}
              />
              <Sparkles
                size={20}
                color="#EC4899"
                strokeWidth={2}
                style={styles.sparkleSmall}
              />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>{buttonText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  iconBackground: {
    marginBottom: 32,
    borderRadius: 80,
    overflow: 'hidden',
    shadowColor: '#30D158',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  iconGradient: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparklesContainer: {
    position: 'absolute',
    top: 60,
    width: '100%',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
    right: 40,
  },
  sparkleSmall: {
    position: 'absolute',
    left: 50,
    top: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.8,
  },
  message: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  button: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});
