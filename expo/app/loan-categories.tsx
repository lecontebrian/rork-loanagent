import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Car, Home, Wallet, Briefcase, GraduationCap, Repeat, Bell } from 'lucide-react-native';
import colors from '@/constants/colors';
import { loanCategories } from '@/mocks/loanData';
import { LoanType } from '@/types';
import { categoryImages } from '@/constants/mediaAssets';
import React, { useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';

const iconMap: Record<string, any> = {
  car: Car,
  home: Home,
  wallet: Wallet,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  repeat: Repeat,
};

export default function LoanCategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const handleSelectCategory = (loanType: LoanType) => {
    if (loanType === 'auto' || loanType === 'home' || loanType === 'personal') {
      router.push(`/loan-type-selection?category=${loanType}` as any);
    } else {
      router.push(`/onboarding/loan-amount?type=${loanType}` as any);
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
            <Text style={styles.headerTitle}>Loan Types</Text>
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
            <Text style={styles.title}>What do you need?</Text>
            <Text style={styles.description}>
              Choose the type of loan that fits your goals
            </Text>

            <View style={styles.grid}>
              {loanCategories.map((category, index) => {
                const Icon = iconMap[category.icon];
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryCard, { opacity: fadeAnim }]}
                    onPress={() => handleSelectCategory(category.id)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(index) + '15' }]}>
                      {categoryImages[category.id] ? (
                        <Image
                          source={{ uri: categoryImages[category.id] }}
                          style={styles.categoryImage}
                          resizeMode="contain"
                        />
                      ) : (
                        Icon && <Icon color={getCategoryColor(index)} size={28} strokeWidth={2} />
                      )}
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                    <View style={styles.categoryAmountContainer}>
                      <Text style={styles.categoryAmount}>
                        ${category.minAmount >= 1000000 ? `${(category.minAmount / 1000000).toFixed(1)}M` : `${(category.minAmount / 1000).toFixed(0)}K`} - ${category.maxAmount >= 1000000 ? `${(category.maxAmount / 1000000).toFixed(1)}M` : `${(category.maxAmount / 1000).toFixed(0)}K`}
                      </Text>
                    </View>
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

function getCategoryColor(index: number): string {
  const colorArray = [colors.primary, colors.secondary, colors.warning, '#FF453A', '#5E5CE6', '#30D158'];
  return colorArray[index % colorArray.length];
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
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.8,
  },
  description: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 25,
    marginBottom: 36,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    width: '47.5%',
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  categoryImage: {
    width: 36,
    height: 36,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  categoryDescription: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
    letterSpacing: -0.1,
  },
  categoryAmountContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSecondary,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
});
