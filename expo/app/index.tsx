import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function IndexScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  useEffect(() => {
    router.replace('/(tabs)/home');
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: theme.bg }} />;
}
