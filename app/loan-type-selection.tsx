import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, Bell } from 'lucide-react-native';
import colors from '@/constants/colors';
import { mortgageTypes, autoLoanTypes, personalLoanTypes, LoanTypeDetail } from '@/constants/loanTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useEffect, useState } from 'react';

export default function LoanTypeSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category: 'auto' | 'home' | 'personal' }>();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getLoanTypes = (): { types: LoanTypeDetail[], title: string, subtitle: string } => {
    switch (category) {
      case 'home':
        return {
          types: mortgageTypes,
          title: 'Select Mortgage Type',
          subtitle: 'Choose the mortgage that fits your homebuying needs',
        };
      case 'auto':
        return {
          types: autoLoanTypes,
          title: 'Select Auto Loan Type',
          subtitle: 'Choose the right financing for your vehicle',
        };
      case 'personal':
        return {
          types: personalLoanTypes,
          title: 'Select Personal Loan Type',
          subtitle: 'Tell us what you need the loan for',
        };
      default:
        return { types: personalLoanTypes, title: 'Select Loan Type', subtitle: 'Choose your loan purpose' };
    }
  };

  const { types, title, subtitle } = getLoanTypes();

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setTimeout(() => {
      router.push(`/onboarding/loan-amount?type=${category}&subtype=${typeId}` as any);
    }, 200);
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
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <Bell color={colors.text} size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.typesContainer}>
              {types.map((type, index) => {
                const isSelected = selectedType === type.id;
                
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      isSelected && styles.typeCardSelected,
                      { borderColor: type.color + '20' },
                    ]}
                    onPress={() => handleSelectType(type.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.typeHeader}>
                      <View style={[styles.typeIcon, { backgroundColor: type.color + '15' }]}>
                        <View style={[styles.typeIconDot, { backgroundColor: type.color }]} />
                      </View>
                      <View style={styles.typeHeaderText}>
                        <Text style={styles.typeName}>{type.name}</Text>
                        <Text style={styles.typeAmount}>
                          ${(type.minAmount / 1000).toFixed(0)}K - ${type.maxAmount >= 1000000 
                            ? `${(type.maxAmount / 1000000).toFixed(1)}M` 
                            : `${(type.maxAmount / 1000).toFixed(0)}K`}
                        </Text>
                      </View>
                      {isSelected && (
                        <CheckCircle2 color={colors.primary} size={24} strokeWidth={2.5} />
                      )}
                    </View>

                    <Text style={styles.typeDescription}>{type.description}</Text>

                    <View style={styles.typeTerms}>
                      <View style={styles.termBadge}>
                        <Text style={styles.termText}>{type.typicalTerm}</Text>
                      </View>
                    </View>

                    <View style={styles.bestForSection}>
                      <Text style={styles.bestForTitle}>Best For:</Text>
                      {type.bestFor.slice(0, 3).map((item, idx) => (
                        <View key={idx} style={styles.bestForItem}>
                          <View style={[styles.bestForDot, { backgroundColor: type.color }]} />
                          <Text style={styles.bestForText}>{item}</Text>
                        </View>
                      ))}
                    </View>

                    {type.requirements.length > 0 && (
                      <View style={styles.requirementsSection}>
                        <Text style={styles.requirementsTitle}>Requirements:</Text>
                        <Text style={styles.requirementsText}>
                          {type.requirements.slice(0, 2).join(' • ')}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 40 }} />
          </Animated.View>
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  notificationButton: {
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 25,
    marginBottom: 28,
    letterSpacing: -0.3,
  },
  typesContainer: {
    gap: 16,
  },
  typeCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    ...colors.shadow,
  },
  typeCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  typeHeaderText: {
    flex: 1,
  },
  typeName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  typeAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  typeDescription: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  typeTerms: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  termBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  termText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  bestForSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 12,
  },
  bestForTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  bestForItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  bestForDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bestForText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  requirementsSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  requirementsText: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
});
