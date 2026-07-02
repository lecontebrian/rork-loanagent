import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, FolderLock, FileText, File, Shield, Calendar, Download, Eye, Trash2, Upload, Search, Settings } from 'lucide-react-native';
import ScreenMenu from '@/components/ScreenMenu';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { Document } from '@/types';

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Drivers License',
    type: 'id',
    fileUrl: 'https://example.com/license.pdf',
    uploadDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    size: 2.5,
    encrypted: true,
  },
  {
    id: '2',
    name: 'Pay Stub - January 2025',
    type: 'income',
    fileUrl: 'https://example.com/paystub.pdf',
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    size: 1.2,
    encrypted: true,
  },
  {
    id: '3',
    name: 'Tax Return 2024',
    type: 'tax',
    fileUrl: 'https://example.com/tax.pdf',
    uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    size: 5.8,
    encrypted: true,
  },
  {
    id: '4',
    name: 'Auto Loan Agreement',
    type: 'loan',
    fileUrl: 'https://example.com/loan.pdf',
    uploadDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    size: 3.4,
    encrypted: true,
  },
];

export default function DocumentVaultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [documents] = useState(sampleDocuments);
  const [selectedType, setSelectedType] = useState<'all' | Document['type']>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const documentTypes: { value: 'all' | Document['type']; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'id', label: 'ID' },
    { value: 'income', label: 'Income' },
    { value: 'tax', label: 'Tax' },
    { value: 'loan', label: 'Loan' },
    { value: 'other', label: 'Other' },
  ];

  const filteredDocuments = selectedType === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === selectedType);

  const totalStorage = documents.reduce((sum, doc) => sum + doc.size, 0);

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'id': return Shield;
      case 'income': return FileText;
      case 'tax': return FileText;
      case 'loan': return File;
      default: return File;
    }
  };

  const getTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'id': return colors.primary;
      case 'income': return colors.success;
      case 'tax': return colors.warning;
      case 'loan': return colors.secondary;
      default: return colors.textSecondary;
    }
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
            <Text style={styles.headerTitle}>Document Vault</Text>
            <Text style={styles.headerSubtitle}>Secure Storage</Text>
          </View>
          <ScreenMenu
            items={[
              {
                icon: Upload,
                label: 'Upload Document',
                onPress: () => Alert.alert('Upload', 'Select a document to upload securely'),
                color: colors.primary,
              },
              {
                icon: Search,
                label: 'Search Documents',
                onPress: () => Alert.alert('Search', 'Search through your documents'),
                color: colors.info,
              },
              {
                icon: Shield,
                label: 'Security Settings',
                onPress: () => Alert.alert('Security', 'Manage encryption and access settings'),
                color: colors.success,
              },
              {
                icon: Settings,
                label: 'Vault Settings',
                onPress: () => router.push('/settings' as any),
                color: colors.textSecondary,
              },
            ]}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.storageCard, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['#5856D6', '#7C3AED']}
              style={styles.storageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.storageIcon}>
                <FolderLock color={colors.white} size={32} strokeWidth={2.5} />
              </View>
              <View style={styles.storageInfo}>
                <Text style={styles.storageLabel}>Total Storage Used</Text>
                <Text style={styles.storageValue}>{totalStorage.toFixed(1)} MB</Text>
                <Text style={styles.storageSubtext}>of 100 MB</Text>
              </View>
              <View style={styles.storageProgress}>
                <View style={styles.storageProgressBar}>
                  <View style={[styles.storageProgressFill, { width: `${(totalStorage / 100) * 100}%` }]} />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.securityCard}>
            <Shield color={colors.success} size={20} strokeWidth={2.5} />
            <Text style={styles.securityText}>
              All documents are encrypted with AES-256 encryption and stored securely.
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {documentTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[styles.filterChip, selectedType === type.value && styles.filterChipActive]}
                onPress={() => setSelectedType(type.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, selectedType === type.value && styles.filterChipTextActive]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>
              {selectedType === 'all' ? 'All Documents' : `${documentTypes.find(t => t.value === selectedType)?.label} Documents`}
            </Text>
            {filteredDocuments.map((document) => {
              const IconComponent = getTypeIcon(document.type);
              const typeColor = getTypeColor(document.type);

              return (
                <Animated.View
                  key={document.id}
                  style={[
                    styles.documentCard,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      }],
                    },
                  ]}
                >
                  <View style={styles.documentHeader}>
                    <View style={styles.documentInfo}>
                      <View style={[styles.documentIcon, { backgroundColor: typeColor + '20' }]}>
                        <IconComponent color={typeColor} size={24} strokeWidth={2.5} />
                      </View>
                      <View style={styles.documentDetails}>
                        <Text style={styles.documentName}>{document.name}</Text>
                        <View style={styles.documentMeta}>
                          <Text style={styles.documentMetaText}>
                            {document.size.toFixed(1)} MB
                          </Text>
                          <View style={styles.documentMetaDot} />
                          <Text style={styles.documentMetaText}>
                            {new Date(document.uploadDate).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {document.encrypted && (
                      <View style={styles.encryptedBadge}>
                        <Shield color={colors.success} size={12} strokeWidth={2.5} />
                      </View>
                    )}
                  </View>

                  {document.expiryDate && (
                    <View style={styles.expiryContainer}>
                      <Calendar color={colors.warning} size={14} strokeWidth={2.5} />
                      <Text style={styles.expiryText}>
                        Expires: {new Date(document.expiryDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.documentActions}>
                    <TouchableOpacity style={styles.documentAction} activeOpacity={0.7}>
                      <Eye color={colors.primary} size={18} strokeWidth={2.5} />
                      <Text style={styles.documentActionText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.documentAction} activeOpacity={0.7}>
                      <Download color={colors.success} size={18} strokeWidth={2.5} />
                      <Text style={styles.documentActionText}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.documentAction} activeOpacity={0.7}>
                      <Trash2 color={colors.error} size={18} strokeWidth={2.5} />
                      <Text style={styles.documentActionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          {filteredDocuments.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <FileText color={colors.textTertiary} size={32} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyText}>No documents found</Text>
              <Text style={styles.emptySubtext}>Upload your first document to get started</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  storageCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  storageGradient: {
    padding: 24,
  },
  storageIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  storageInfo: {
    marginBottom: 16,
  },
  storageLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  storageValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 4,
    letterSpacing: -1.5,
  },
  storageSubtext: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: -0.1,
  },
  storageProgress: {
    gap: 8,
  },
  storageProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  storageProgressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  securityCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.successLight,
    borderRadius: 14,
    gap: 12,
    marginBottom: 20,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  filtersContainer: {
    paddingBottom: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  documentsSection: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  documentCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowMedium,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    flex: 1,
  },
  documentIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  documentMetaText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  documentMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
  },
  encryptedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.warningLight,
    borderRadius: 10,
    marginBottom: 16,
  },
  expiryText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  documentActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  documentAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceTertiary,
  },
  documentActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
