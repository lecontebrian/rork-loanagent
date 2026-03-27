import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Star, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

interface ReviewPromptProps {
  visible: boolean;
  onClose: () => void;
  triggerEvent?: string; // e.g., "approval", "savings", "deal"
}

export default function ReviewPrompt({ visible, onClose, triggerEvent }: ReviewPromptProps) {
  const { rateApp, snoozeRating } = useApp();
  const [show, setShow] = useState(visible);
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShow(false));
    }
  }, [visible]);

  const handleRate = () => {
    rateApp();
    // In a real app, this would open the store review dialog
    onClose();
  };

  const handleLater = () => {
    snoozeRating();
    onClose();
  };

  if (!show) return null;

  return (
    <Modal transparent visible={show} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={colors.textTertiary} size={20} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Star color={colors.white} size={28} fill={colors.white} />
          </View>

          <Text style={styles.title}>Enjoying Loan Agent?</Text>
          <Text style={styles.message}>
            {triggerEvent === 'approval'
              ? 'Congrats on your approval! Help others find great loans by rating us.'
              : triggerEvent === 'savings'
              ? 'You just found some great savings! Would you mind rating us?'
              : 'Was this helpful? Rate us and help others find better deals.'}
          </Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Star key={i} color="#FFB347" size={32} fill="#FFB347" />
            ))}
          </View>

          <TouchableOpacity style={styles.rateButton} onPress={handleRate} activeOpacity={0.8}>
            <Text style={styles.rateButtonText}>Rate Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.laterButton} onPress={handleLater} activeOpacity={0.7}>
            <Text style={styles.laterButtonText}>Remind Me Later</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    width: width - 60,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...colors.shadowStrong,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...colors.shadow,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  rateButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  rateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  laterButton: {
    paddingVertical: 8,
  },
  laterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
