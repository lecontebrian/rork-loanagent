import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { FileText, Image as ImageIcon, FileType, Upload, Search, CheckCircle, Clock, Loader } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { GlassCard } from '@/components/GlassCard';
import { Spacing, Typography, Radii } from '@/constants/theme';
import { documents } from '@/mocks/loanData';
import type { DocumentItem } from '@/types';

const fileTypeIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  pdf: FileText,
  image: ImageIcon,
  doc: FileType,
};

const docTypeColors: Record<string, string> = {
  mortgage: '#16C784',
  auto: '#3B9EFF',
  insurance: '#9B6BFF',
  tax: '#F5A623',
  agreement: '#FF4D6D',
  other: '#7A8A85',
};

const statusConfig: Record<
  string,
  { icon: React.ComponentType<{ size?: number; color?: string }>; color: string; label: string }
> = {
  verified: { icon: CheckCircle, color: '#16C784', label: 'Verified' },
  pending: { icon: Clock, color: '#F5A623', label: 'Pending' },
  processing: { icon: Loader, color: '#3B9EFF', label: 'Processing' },
};

export default function DocumentsScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDocPress = (doc: DocumentItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <Text style={[Typography.title1, { color: theme.text }]}>Documents</Text>
          <Text style={[Typography.subheadline, { color: theme.textMuted, marginTop: 4 }]}>
            Securely stored and verified
          </Text>
        </View>

        {/* Upload Card */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <Pressable onPress={handleUpload}>
            <GlassCard padding={Spacing.xl} intensity={30} pressable>
              <View style={styles.uploadContent}>
                <View style={[styles.uploadIcon, { backgroundColor: `${theme.primary}22` }]}>
                  <Upload size={28} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.headline, { color: theme.text }]}>
                    Upload Document
                  </Text>
                  <Text style={[Typography.subheadline, { color: theme.textMuted, marginTop: 4 }]}>
                    PDF, images, or photos
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Search size={18} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search documents…"
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Recent Documents */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xl }}>
          <Text style={[Typography.title3, { color: theme.text, marginBottom: Spacing.md }]}>
            Recent Documents
          </Text>

          <View style={{ gap: Spacing.sm }}>
            {filteredDocs.map((doc) => {
              const FileTypeIcon = fileTypeIcons[doc.fileType] || FileText;
              const typeColor = docTypeColors[doc.type] || '#7A8A85';
              const status = statusConfig[doc.status];
              const StatusIcon = status.icon;

              return (
                <Pressable
                  key={doc.id}
                  onPress={() => handleDocPress(doc)}
                  style={({ pressed }) => [
                    styles.docCard,
                    {
                      backgroundColor: pressed ? theme.surfaceSecondary : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={[styles.docIcon, { backgroundColor: `${typeColor}22` }]}>
                    <FileTypeIcon size={22} color={typeColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[Typography.subheadline, { color: theme.text, fontWeight: '600' }]}
                      numberOfLines={2}
                    >
                      {doc.name}
                    </Text>
                    <View style={styles.docMeta}>
                      <Text style={[Typography.caption1, { color: theme.textMuted }]}>
                        {doc.date}
                      </Text>
                      <Text style={[Typography.caption1, { color: theme.textMuted }]}>·</Text>
                      <Text style={[Typography.caption1, { color: theme.textMuted }]}>
                        {doc.size}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${status.color}22` }]}>
                    <StatusIcon size={12} color={status.color} />
                    <Text style={[Typography.caption2, { color: status.color, fontWeight: '600' }]}>
                      {status.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {filteredDocs.length === 0 && (
            <View style={styles.emptyState}>
              <FileText size={48} color={theme.textMuted} />
              <Text style={[Typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: Spacing.md }]}>
                No documents found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
});
