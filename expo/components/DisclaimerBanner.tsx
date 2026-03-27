import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Info, X } from 'lucide-react-native';
import colors from '@/constants/colors';

interface DisclaimerBannerProps {
  message: string;
  dismissible?: boolean;
  type?: 'info' | 'warning' | 'error';
}

export default function DisclaimerBanner({ 
  message, 
  dismissible = true,
  type = 'info'
}: DisclaimerBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const getColors = () => {
    switch (type) {
      case 'warning':
        return {
          background: colors.warningLight,
          icon: colors.warning,
        };
      case 'error':
        return {
          background: colors.errorLight,
          icon: colors.error,
        };
      default:
        return {
          background: colors.infoLight,
          icon: colors.info,
        };
    }
  };

  const themeColors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <Info color={themeColors.icon} size={18} strokeWidth={2} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {dismissible && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setVisible(false)}
          activeOpacity={0.7}
        >
          <X color={colors.textSecondary} size={18} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
