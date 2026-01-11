import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Car, Home, CreditCard, GraduationCap } from 'lucide-react-native';
import colors from '@/constants/colors';
import React, { useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const loanTypes = [
  {
    id: 'auto',
    name: 'Auto Loan',
    icon: Car,
    description: 'Refinance your car loan',
    color: colors.primary,
  },
  {
    id: 'home',
    name: 'Mortgage',
    icon: Home,
    description: 'Refinance your home mortgage',
    color: colors.secondary,
  },
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: CreditCard,
    description: 'Refinance personal debt',
    color: colors.warning,
  },
  {
    id: 'student',
    name: 'Student Loan',
    icon: GraduationCap,
    description: 'Refinance education loans',
    color: '#5E5CE6',
  },
];

export default function RefinanceLoanTypeScreen() {
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

  const handleSelectType = (typeId: string) => {
    router.push(`/refinance/current-loan?type=${typeId}` as any);
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
            <Text style={styles.headerTitle}>Loan Type</Text>
          </View>
          <View style={{ width: 44 }} />
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
            <Text style={styles.title}>What loan do you want to refinance?</Text>
            <Text style={styles.description}>
              Select the type of loan you&apos;d like to refinance
            </Text>

            <View style={styles.loanTypesContainer}>
              {loanTypes.map((type, index) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.loanTypeCard}
                  onPress={() => handleSelectType(type.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.loanTypeIcon, { backgroundColor: type.color + '15' }]}>
                    <type.icon color={type.color} size={28} strokeWidth={2} />
                  </View>
                  <View style={styles.loanTypeContent}>
                    <Text style={styles.loanTypeName}>{type.name}</Text>
                    <Text style={styles.loanTypeDescription}>{type.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
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
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  description: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 25,
    marginBottom: 36,
    letterSpacing: -0.3,
  },
  loanTypesContainer: {
    gap: 14,
  },
  loanTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  loanTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  loanTypeContent: {
    flex: 1,
  },
  loanTypeName: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  loanTypeDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});
