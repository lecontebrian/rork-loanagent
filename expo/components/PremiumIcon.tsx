import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import colors from '@/constants/colors';

export const ICON_SIZES = {
  tab: 22,
  header: 21,
  action: 20,
  card: 24,
  hero: 34,
} as const;

export const ICON_STROKE = {
  regular: 1.85,
  emphasized: 2.15,
} as const;

type IconTone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'white';

type PremiumIconProps = {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  testID?: string;
};

type IconContainerProps = PremiumIconProps & {
  containerSize?: number;
  radius?: number;
  tone?: IconTone;
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
};

const toneColors: Record<IconTone, string> = {
  primary: colors.primary,
  secondary: colors.secondary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.error,
  neutral: colors.textSecondary,
  white: colors.white,
};

const toneBackgrounds: Record<IconTone, string> = {
  primary: 'rgba(25, 197, 52, 0.13)',
  secondary: 'rgba(29, 155, 240, 0.13)',
  success: 'rgba(25, 197, 52, 0.13)',
  warning: 'rgba(255, 212, 0, 0.15)',
  danger: 'rgba(244, 33, 46, 0.13)',
  neutral: 'rgba(231, 233, 234, 0.08)',
  white: 'rgba(255, 255, 255, 0.18)',
};

export function PremiumIcon({ icon: Icon, size = ICON_SIZES.action, color = colors.text, strokeWidth = ICON_STROKE.regular, filled = false, testID }: PremiumIconProps) {
  return <Icon color={color} size={size} strokeWidth={strokeWidth} fill={filled ? color : 'none'} testID={testID} />;
}

export function PremiumIconContainer({
  icon,
  size = ICON_SIZES.action,
  color,
  strokeWidth = ICON_STROKE.regular,
  filled = false,
  containerSize = 44,
  radius = 14,
  tone = 'primary',
  backgroundColor,
  borderColor,
  style,
  testID,
}: IconContainerProps) {
  const iconColor = color ?? toneColors[tone];
  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: radius,
          backgroundColor: backgroundColor ?? toneBackgrounds[tone],
          borderColor: borderColor ?? 'rgba(255, 255, 255, 0.08)',
        },
        style,
      ]}
    >
      <PremiumIcon icon={icon} size={size} color={iconColor} strokeWidth={strokeWidth} filled={filled} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
