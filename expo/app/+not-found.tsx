import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { GradientButton } from '@/components/GradientButton';
import { Spacing, Typography } from '@/constants/theme';

export default function NotFoundScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={[Typography.largeTitle, { color: theme.text, textAlign: 'center' }]}>
          404
        </Text>
        <Text style={[Typography.title3, { color: theme.textMuted, textAlign: 'center', marginTop: Spacing.md }]}>
          Page not found
        </Text>
        <Text style={[Typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: Spacing.sm }]}>
          The page you're looking for doesn't exist.
        </Text>
        <View style={{ marginTop: Spacing.xxl, width: '100%' }}>
          <GradientButton
            label="Go Home"
            onPress={() => router.replace('/(tabs)/home')}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    width: '100%',
  },
});
