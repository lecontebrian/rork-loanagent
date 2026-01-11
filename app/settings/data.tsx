import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Database, Download, Trash2, HardDrive, CloudOff, RefreshCw } from 'lucide-react-native';
import colors from '@/constants/colors';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DataStorageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export all your data in a portable format',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => Alert.alert('Success', 'Your data has been exported and will be sent to your email') 
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files and cached data. Your personal data will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: () => Alert.alert('Success', 'Cache has been cleared successfully') 
        }
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'This will delete your browsing and activity history',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'History has been cleared') 
        }
      ]
    );
  };

  const handleBackupData = () => {
    Alert.alert(
      'Backup Data',
      'Create a backup of your data to restore later',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Backup Now', 
          onPress: () => Alert.alert('Success', 'Backup created successfully') 
        }
      ]
    );
  };

  const handleRestoreData = () => {
    Alert.alert(
      'Restore Data',
      'Restore your data from a previous backup',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => Alert.alert('Info', 'No backups available') }
      ]
    );
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
            <Text style={styles.headerTitle}>Data & Storage</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.storageCard}>
              <View style={styles.storageHeader}>
                <HardDrive color={colors.primary} size={24} strokeWidth={2} />
                <Text style={styles.storageTitle}>Storage Used</Text>
              </View>
              <Text style={styles.storageAmount}>48.2 MB</Text>
              <Text style={styles.storageSubtitle}>of 500 MB available</Text>
              <View style={styles.storageBar}>
                <View style={[styles.storageBarFill, { width: '9.6%' }]} />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
              <View style={styles.settingsGroup}>
                <DataItem
                  icon={<Download color={colors.primary} size={20} strokeWidth={2} />}
                  title="Export Data"
                  subtitle="Download all your data"
                  onPress={handleExportData}
                />
                <DataItem
                  icon={<Database color={colors.primary} size={20} strokeWidth={2} />}
                  title="Backup Data"
                  subtitle="Create a backup of your data"
                  onPress={handleBackupData}
                />
                <DataItem
                  icon={<RefreshCw color={colors.primary} size={20} strokeWidth={2} />}
                  title="Restore Data"
                  subtitle="Restore from a previous backup"
                  onPress={handleRestoreData}
                  showDivider
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CLEAR DATA</Text>
              <View style={styles.settingsGroup}>
                <DataItem
                  icon={<CloudOff color={colors.warning} size={20} strokeWidth={2} />}
                  title="Clear Cache"
                  subtitle="Remove temporary files (48.2 MB)"
                  onPress={handleClearCache}
                  warning
                />
                <DataItem
                  icon={<Trash2 color={colors.error} size={20} strokeWidth={2} />}
                  title="Clear History"
                  subtitle="Delete browsing and activity history"
                  onPress={handleClearHistory}
                  danger
                  showDivider
                />
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Your data is stored securely and encrypted. You can export or delete your data at any time. Backups are stored locally on your device.
              </Text>
            </View>

            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function DataItem({
  icon,
  title,
  subtitle,
  onPress,
  warning = false,
  danger = false,
  showDivider = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  warning?: boolean;
  danger?: boolean;
  showDivider?: boolean;
}) {
  const getBackgroundColor = () => {
    if (danger) return '#FFE6E6';
    if (warning) return colors.warningLight;
    return colors.primaryTint;
  };

  return (
    <>
      <TouchableOpacity style={styles.dataItem} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.dataIcon, { backgroundColor: getBackgroundColor() }]}>
          {icon}
        </View>
        <View style={styles.dataContent}>
          <Text style={[styles.dataTitle, (danger || warning) && styles.dataTitleWarning]}>
            {title}
          </Text>
          <Text style={styles.dataSubtitle}>{subtitle}</Text>
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
  storageCard: {
    marginHorizontal: 28,
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    ...colors.shadowMedium,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  storageAmount: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -1,
  },
  storageSubtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  storageBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  section: {
    marginTop: 32,
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
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dataIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dataContent: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  dataTitleWarning: {
    color: colors.text,
  },
  dataSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSecondary,
    marginLeft: 74,
  },
  infoBox: {
    marginHorizontal: 28,
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...colors.shadow,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  bottomPadding: {
    height: 40,
  },
});
