import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { MoreVertical, X, LucideIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { glass } from '@/constants/theme';
import { ICON_SIZES, ICON_STROKE, PremiumIcon, PremiumIconContainer } from '@/components/PremiumIcon';
import { useState, useRef, useEffect } from 'react';

export interface ScreenMenuItem {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  color?: string;
}

interface ScreenMenuProps {
  items: ScreenMenuItem[];
}

export default function ScreenMenu({ items }: ScreenMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, scaleAnim]);

  const openMenu = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setIsVisible(true);
  };

  const handleItemPress = (onPress: () => void) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    setIsVisible(false);
    setTimeout(() => {
      onPress();
    }, 200);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={openMenu}
        activeOpacity={0.7}
      >
        <BlurView intensity={glass.intensity.chrome} tint={glass.tint} experimentalBlurMethod="dimezisBlurView" style={styles.menuButtonBlur} />
        <PremiumIcon icon={MoreVertical} color={colors.text} size={ICON_SIZES.header} strokeWidth={ICON_STROKE.regular} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <BlurView intensity={glass.intensity.chrome} tint={glass.tint} experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.modalFill]} pointerEvents="none" />
            <View style={[StyleSheet.absoluteFill, styles.modalBorder]} pointerEvents="none" />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Actions</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
                activeOpacity={0.7}
              >
                <PremiumIcon icon={X} color={colors.textSecondary} size={ICON_SIZES.action} strokeWidth={ICON_STROKE.regular} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleItemPress(item.onPress)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemIcon}>
                    <PremiumIconContainer icon={item.icon} color={item.color || colors.primary} size={ICON_SIZES.action} containerSize={44} radius={14} backgroundColor={(item.color || colors.primary) + '18'} borderColor={(item.color || colors.primary) + '30'} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: glass.border,
    ...colors.shadow,
  },
  menuButtonBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: glass.fillSoft,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  modalFill: {
    backgroundColor: glass.fillStrong,
  },
  modalBorder: {
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: glass.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItems: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: glass.fillSoft,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: glass.border,
    gap: 14,
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
});
