import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, usePathname, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBar } from '@/components/BottomTabBar';
import { useAppTheme } from '@/contexts/ThemeContext';
import type { TabConfig } from '@/types';

const tabs: TabConfig[] = [
  { name: 'home', label: 'Home', icon: 'home', route: '/(tabs)/home' },
  { name: 'loans', label: 'Loans', icon: 'loans', route: '/(tabs)/loans' },
  { name: 'ask-ai', label: 'Ask AI', icon: 'ask-ai', route: '/(tabs)/ask-ai' },
  { name: 'documents', label: 'Docs', icon: 'documents', route: '/(tabs)/documents' },
  { name: 'profile', label: 'Profile', icon: 'profile', route: '/(tabs)/profile' },
];

export default function TabLayout() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const segments = useSegments();

  // Derive active tab from segments
  const activeSegment = segments[segments.length - 1] || 'home';
  const activeRoute = `/(tabs)/${activeSegment}`;

  const handleNavigate = useCallback(
    (route: string) => {
      router.push(route as any);
    },
    [router]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.content}>
        {/* Slot is rendered by Expo Router automatically via file-based routing */}
        <TabContent />
      </View>
      <BottomTabBar tabs={tabs} activeRoute={activeRoute} onNavigate={handleNavigate} />
    </View>
  );
}

// We need to use the Slot from expo-router for the tab content
import { Slot } from 'expo-router';

function TabContent() {
  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
