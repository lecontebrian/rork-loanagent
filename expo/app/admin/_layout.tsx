import { Tabs } from 'expo-router';
import { LayoutDashboard, Users, Settings, FileText } from 'lucide-react-native';
import { ICON_SIZES, ICON_STROKE, PremiumIcon } from '@/components/PremiumIcon';

// Admin uses a different theme - Light Theme
const adminColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  primary: '#2563EB', // Blue-600
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: adminColors.surface,
        },
        headerTintColor: adminColors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: adminColors.surface,
          borderTopColor: adminColors.border,
        },
        tabBarActiveTintColor: adminColors.primary,
        tabBarInactiveTintColor: adminColors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <PremiumIcon icon={LayoutDashboard} color={color} size={ICON_SIZES.tab} strokeWidth={ICON_STROKE.regular} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <PremiumIcon icon={Users} color={color} size={ICON_SIZES.tab} strokeWidth={ICON_STROKE.regular} />,
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color }) => <PremiumIcon icon={FileText} color={color} size={ICON_SIZES.tab} strokeWidth={ICON_STROKE.regular} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <PremiumIcon icon={Settings} color={color} size={ICON_SIZES.tab} strokeWidth={ICON_STROKE.regular} />,
        }}
      />
    </Tabs>
  );
}
