import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Palette, Globe, Type, Volume2, Vibrate } from 'lucide-react-native';
import colors from '@/constants/colors';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppPreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('english');
  const [currency, setCurrency] = useState('usd');
  const [textSize, setTextSize] = useState('medium');

  const handleThemeChange = () => {
    Alert.alert(
      'Theme',
      'Choose your preferred theme',
      [
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'System', onPress: () => setTheme('system') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => setLanguage('english') },
        { text: 'Spanish', onPress: () => setLanguage('spanish') },
        { text: 'French', onPress: () => setLanguage('french') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCurrencyChange = () => {
    Alert.alert(
      'Currency',
      'Select your preferred currency',
      [
        { text: 'USD ($)', onPress: () => setCurrency('usd') },
        { text: 'EUR (€)', onPress: () => setCurrency('eur') },
        { text: 'GBP (£)', onPress: () => setCurrency('gbp') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleTextSizeChange = () => {
    Alert.alert(
      'Text Size',
      'Choose your preferred text size',
      [
        { text: 'Small', onPress: () => setTextSize('small') },
        { text: 'Medium', onPress: () => setTextSize('medium') },
        { text: 'Large', onPress: () => setTextSize('large') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System Default';
  };

  const getLanguageLabel = () => {
    if (language === 'spanish') return 'Spanish';
    if (language === 'french') return 'French';
    return 'English';
  };

  const getCurrencyLabel = () => {
    if (currency === 'eur') return 'EUR (€)';
    if (currency === 'gbp') return 'GBP (£)';
    return 'USD ($)';
  };

  const getTextSizeLabel = () => {
    if (textSize === 'small') return 'Small';
    if (textSize === 'large') return 'Large';
    return 'Medium';
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>App Preferences</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>APPEARANCE</Text>
              <View style={styles.settingsGroup}>
                <SelectItem
                  icon={<Palette color={colors.primary} size={20} strokeWidth={2} />}
                  title="Theme"
                  value={getThemeLabel()}
                  onPress={handleThemeChange}
                />
                <SelectItem
                  icon={<Type color={colors.primary} size={20} strokeWidth={2} />}
                  title="Text Size"
                  value={getTextSizeLabel()}
                  onPress={handleTextSizeChange}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LOCALIZATION</Text>
              <View style={styles.settingsGroup}>
                <SelectItem
                  icon={<Globe color={colors.primary} size={20} strokeWidth={2} />}
                  title="Language"
                  value={getLanguageLabel()}
                  onPress={handleLanguageChange}
                />
                <SelectItem
                  icon={<Globe color={colors.primary} size={20} strokeWidth={2} />}
                  title="Currency"
                  value={getCurrencyLabel()}
                  onPress={handleCurrencyChange}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACCESSIBILITY</Text>
              <View style={styles.settingsGroup}>
                <SelectItem
                  icon={<Volume2 color={colors.primary} size={20} strokeWidth={2} />}
                  title="Sound Effects"
                  value="On"
                  onPress={() => Alert.alert('Sound Effects', 'Toggle sound effects on or off')}
                />
                <SelectItem
                  icon={<Vibrate color={colors.primary} size={20} strokeWidth={2} />}
                  title="Haptic Feedback"
                  value="On"
                  onPress={() => Alert.alert('Haptic Feedback', 'Toggle haptic feedback on or off')}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function SelectItem({
  icon,
  title,
  value,
  onPress,
  showDivider = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  onPress: () => void;
  showDivider?: boolean;
}) {
  return (
    <>
      <TouchableOpacity style={styles.selectItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.selectIcon}>
          {icon}
        </View>
        <View style={styles.selectContent}>
          <Text style={styles.selectTitle}>{title}</Text>
          <Text style={styles.selectValue}>{value}</Text>
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...colors.shadow,
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  selectIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: colors.primaryTint,
  },
  selectContent: {
    flex: 1,
  },
  selectTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  selectValue: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSecondary,
    marginLeft: 74,
  },
  bottomPadding: {
    height: 40,
  },
});
