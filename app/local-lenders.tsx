import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput, Alert, Share, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Search, Star, Phone, Globe, Navigation, Award, Filter, Bookmark, Share2, Settings } from 'lucide-react-native';
import ScreenMenu from '@/components/ScreenMenu';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';

import { BANKS } from '@/constants/banks';

interface LocalLender {
  id: string;
  name: string;
  logo: string;
  type: 'credit-union' | 'community-bank' | 'cdfi' | 'national-bank';
  distance: string;
  rating: number;
  members: string;
  specialties: string[];
  phone: string;
  website: string;
  benefits: string[];
  brandColor: string;
}

const sampleLenders: LocalLender[] = BANKS.map((bank, index) => ({
  id: String(index + 1),
  name: bank.name,
  logo: bank.logo,
  type: 'national-bank',
  distance: `${(Math.random() * 5 + 0.5).toFixed(1)} miles`,
  rating: 4.5 + (Math.random() * 0.5),
  members: `${(Math.floor(Math.random() * 50) + 10)}M+`,
  specialties: ['Auto Loans', 'Personal Loans', 'Mortgages', 'Refinance'],
  phone: '(800) 555-0199',
  website: `www.${bank.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
  benefits: ['Nationwide access', 'Mobile banking', '24/7 Support'],
  brandColor: bank.color,
}));

export default function LocalLendersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lenders] = useState(sampleLenders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | LocalLender['type']>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const lenderTypes: { value: 'all' | LocalLender['type']; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'national-bank', label: 'National Banks' },
    { value: 'credit-union', label: 'Credit Unions' },
    { value: 'community-bank', label: 'Community Banks' },
  ];

  const filteredLenders = lenders.filter(lender => {
    const matchesSearch = lender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lender.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || lender.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeColor = (type: LocalLender['type']) => {
    switch (type) {
      case 'credit-union': return colors.primary;
      case 'community-bank': return colors.success;
      case 'cdfi': return colors.warning;
      case 'national-bank': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getTypeLabel = (type: LocalLender['type']) => {
    switch (type) {
      case 'credit-union': return 'Credit Union';
      case 'community-bank': return 'Community Bank';
      case 'cdfi': return 'CDFI';
      case 'national-bank': return 'National Bank';
      default: return type;
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
            <Text style={styles.headerTitle}>Lenders & Banks</Text>
            <Text style={styles.headerSubtitle}>Near You</Text>
          </View>
          <ScreenMenu
            items={[
              {
                icon: Filter,
                label: 'Advanced Filters',
                onPress: () => Alert.alert('Filters', 'Apply advanced search filters'),
                color: colors.primary,
              },
              {
                icon: Bookmark,
                label: 'Saved Lenders',
                onPress: () => Alert.alert('Saved', 'View your bookmarked lenders'),
                color: colors.warning,
              },
              {
                icon: Share2,
                label: 'Share Lender',
                onPress: async () => {
                  try {
                    await Share.share({
                      message: 'Check out this local lender!',
                    });
                  } catch (error) {
                    console.error('Share error:', error);
                  }
                },
                color: colors.success,
              },
              {
                icon: Settings,
                label: 'Search Settings',
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
          <Animated.View style={[styles.locationCard, { opacity: fadeAnim }]}>
            <View style={styles.locationIcon}>
              <MapPin color={colors.primary} size={24} strokeWidth={2.5} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Showing lenders near:</Text>
              <Text style={styles.locationAddress}>San Francisco, CA</Text>
            </View>
            <TouchableOpacity style={styles.changeButton} activeOpacity={0.7}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search color={colors.textTertiary} size={18} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search lenders..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {lenderTypes.map((type) => (
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

          <View style={styles.lendersSection}>
            <Text style={styles.sectionTitle}>
              {filteredLenders.length} Lenders Found
            </Text>
            {filteredLenders.map((lender) => (
              <Animated.View
                key={lender.id}
                style={[
                  styles.lenderCard,
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
                <View style={styles.lenderHeader}>
                  <View style={styles.lenderHeaderContent}>
                    <Image source={{ uri: lender.logo }} style={styles.lenderLogo} resizeMode="contain" />
                    <View style={styles.lenderInfo}>
                      <Text style={styles.lenderName}>{lender.name}</Text>
                      <View style={styles.lenderMeta}>
                        <View style={[styles.typeBadge, { backgroundColor: (lender.brandColor || getTypeBadgeColor(lender.type)) + '20' }]}>
                          <Text style={[styles.typeBadgeText, { color: lender.brandColor || getTypeBadgeColor(lender.type) }]}>
                            {getTypeLabel(lender.type)}
                          </Text>
                        </View>
                        <View style={styles.distanceBadge}>
                          <Navigation color={colors.primary} size={12} strokeWidth={2.5} />
                          <Text style={styles.distanceText}>{lender.distance}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.lenderStats}>
                  <View style={styles.statItem}>
                    <Star color={colors.warning} size={16} strokeWidth={2.5} fill={colors.warning} />
                    <Text style={styles.statValue}>{lender.rating}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Award color={lender.brandColor || colors.primary} size={16} strokeWidth={2.5} />
                    <Text style={styles.statValue}>{lender.members}</Text>
                    <Text style={styles.statLabel}>Members</Text>
                  </View>
                </View>

                <View style={styles.specialtiesContainer}>
                  <Text style={styles.specialtiesTitle}>Specialties:</Text>
                  <View style={styles.specialtiesList}>
                    {lender.specialties.map((specialty, index) => (
                      <View key={index} style={[styles.specialtyChip, { backgroundColor: (lender.brandColor || colors.primary) }]}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>Benefits:</Text>
                  {lender.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={[styles.benefitBullet, { backgroundColor: lender.brandColor || colors.success }]} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.lenderActions}>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Phone color={lender.brandColor || colors.primary} size={18} strokeWidth={2.5} />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Globe color={lender.brandColor || colors.success} size={18} strokeWidth={2.5} />
                    <Text style={styles.actionButtonText}>Website</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary, { backgroundColor: lender.brandColor || colors.primary }]} activeOpacity={0.7}>
                    <Text style={styles.actionButtonTextPrimary}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>

          {filteredLenders.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MapPin color={colors.textTertiary} size={32} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyText}>No lenders found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    ...colors.shadow,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 14,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  changeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
    letterSpacing: -0.1,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.2,
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
  lendersSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  lenderCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowMedium,
  },
  lenderHeader: {
    marginBottom: 16,
  },
  lenderHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lenderLogo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.surfaceTertiary,
  },
  lenderInfo: {
    flex: 1,
    gap: 8,
  },
  lenderName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  lenderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  lenderStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  specialtiesContainer: {
    marginBottom: 16,
  },
  specialtiesTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.1,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  benefitBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.success,
    marginTop: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  lenderActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceTertiary,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.1,
  },
  actionButtonTextPrimary: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.white,
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
