import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { glass, spacing, typography } from '@/constants/theme';
import { PremiumIcon } from '@/components/PremiumIcon';

interface GlassHeaderProps {
  title?: string;
  subtitle?: string;
  /** Show a glass back button on the left. */
  showBack?: boolean;
  onBack?: () => void;
  /** Optional element rendered on the trailing edge (e.g. a menu). */
  right?: React.ReactNode;
  /** Render a large iOS-style title row below the compact bar. */
  largeTitle?: boolean;
  style?: ViewStyle;
}

/**
 * Translucent glass navigation bar. Content scrolls behind it, mirroring the
 * iOS 26 chrome. Supports a compact title and an optional large-title row.
 */
export default function GlassHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  right,
  largeTitle = false,
  style,
}: GlassHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (onBack) onBack();
    else router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top || spacing.md }, style]}>
      <BlurView
        intensity={glass.intensity.chrome}
        tint={glass.tint}
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.fill} pointerEvents="none" />
      <View style={styles.hairline} pointerEvents="none" />

      <View style={styles.bar}>
        <View style={styles.side}>
          {showBack ? (
            <Pressable onPress={handleBack} style={styles.iconButton} hitSlop={8}>
              <PremiumIcon icon={ChevronLeft} color={colors.text} size={24} strokeWidth={2.2} />
            </Pressable>
          ) : null}
        </View>

        {!largeTitle && title ? (
          <View style={styles.center} pointerEvents="none">
            <Text style={styles.compactTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
        ) : (
          <View style={styles.center} />
        )}

        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>

      {largeTitle && title ? (
        <View style={styles.largeTitleRow}>
          <Text style={styles.largeTitle}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  hairline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: glass.border,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.base,
  },
  side: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: glass.fillSoft,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: glass.border,
  },
  compactTitle: {
    ...typography.headline,
    color: colors.text,
  },
  largeTitleRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.base,
  },
  largeTitle: {
    ...typography.largeTitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.callout,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
