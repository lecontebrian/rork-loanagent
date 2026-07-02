import { Pressable, View, StyleSheet, Text } from 'react-native';
import { Home, CreditCard, Sparkles, FileText, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/theme';
import type { TabConfig } from '@/types';

interface BottomTabBarProps {
  tabs: TabConfig[];
  activeRoute: string;
  onNavigate: (route: string) => void;
}

const tabIcons: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  home: Home,
  loans: CreditCard,
  'ask-ai': Sparkles,
  documents: FileText,
  profile: User,
};

export function BottomTabBar({ tabs, activeRoute, onNavigate }: BottomTabBarProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Find center tab (Ask AI)
  const centerIndex = Math.floor(tabs.length / 2);
  const isCenter = (index: number) => index === centerIndex;
  const isActive = (route: string) => activeRoute === route;

  const handlePress = (route: string, center: boolean) => {
    Haptics.impactAsync(center ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
    onNavigate(route);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
      <BlurView
        intensity={50}
        tint={theme.isDark ? 'dark' : 'light'}
        style={[
          styles.bar,
          {
            backgroundColor: theme.glassBg,
            borderColor: theme.glassBorder,
          },
        ]}
      >
        {tabs.map((tab, index) => {
          const Icon = tabIcons[tab.route] || Home;
          const active = isActive(tab.route);
          const center = isCenter(index);

          if (center) {
            return (
              <Pressable
                key={tab.route}
                style={styles.centerButtonWrapper}
                onPress={() => handlePress(tab.route, true)}
              >
                <View style={[styles.centerButton, theme.glowShadow, { backgroundColor: theme.primary }]}>
                  <Icon size={28} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text
                  style={[
                    Typography.caption2,
                    {
                      color: active ? theme.primary : theme.textMuted,
                      fontWeight: '600',
                      marginTop: 4,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.route}
              style={styles.tabItem}
              onPress={() => handlePress(tab.route, false)}
            >
              <View style={[styles.tabIconBox, active && { backgroundColor: `${theme.primary}15` }]}>
                <Icon
                  size={22}
                  color={active ? theme.primary : theme.textMuted}
                  strokeWidth={active ? 2.5 : 2}
                />
              </View>
              <Text
                style={[
                  Typography.caption2,
                  {
                    color: active ? theme.primary : theme.textMuted,
                    fontWeight: active ? '600' : '400',
                    marginTop: 4,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 6,
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  tabIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: -20,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
