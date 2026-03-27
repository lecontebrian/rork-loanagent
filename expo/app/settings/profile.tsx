import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, User as UserIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { userProfile, setUserProfile } = useApp();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [street, setStreet] = useState(userProfile?.address?.street || '');
  const [city, setCity] = useState(userProfile?.address?.city || '');
  const [state, setState] = useState(userProfile?.address?.state || '');
  const [zipCode, setZipCode] = useState(userProfile?.address?.zipCode || '');
  const [dateOfBirth, setDateOfBirth] = useState(userProfile?.dateOfBirth || '');

  const handleSave = () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setUserProfile({
      ...userProfile!,
      firstName,
      lastName,
      email,
      phone,
      address: {
        street,
        city,
        state,
        zipCode,
      },
      dateOfBirth,
    });

    Alert.alert('Success', 'Your profile has been updated successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
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
            <Text style={styles.headerTitle}>Profile Information</Text>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.avatarSection}>
              <LinearGradient
                colors={['#0A84FF', '#5E5CE6']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>
                  {firstName?.[0] || 'U'}{lastName?.[0] || ''}
                </Text>
              </LinearGradient>
              <TouchableOpacity style={styles.changePhotoButton} activeOpacity={0.7}>
                <Camera color={colors.primary} size={18} strokeWidth={2} />
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>
              <View style={styles.formGroup}>
                <InputField
                  icon={<UserIcon color={colors.textSecondary} size={20} strokeWidth={2} />}
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  required
                />
                <InputField
                  icon={<UserIcon color={colors.textSecondary} size={20} strokeWidth={2} />}
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
                  required
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
              <View style={styles.formGroup}>
                <InputField
                  icon={<Mail color={colors.textSecondary} size={20} strokeWidth={2} />}
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                />
                <InputField
                  icon={<Phone color={colors.textSecondary} size={20} strokeWidth={2} />}
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
                />
                <InputField
                  icon={<MapPin color={colors.textSecondary} size={20} strokeWidth={2} />}
                  label="Street Address"
                  value={street}
                  onChangeText={setStreet}
                  placeholder="123 Main St"
                />
                <View style={styles.addressRow}>
                  <View style={styles.addressRowItem}>
                    <InputField
                      icon={<MapPin color={colors.textSecondary} size={18} strokeWidth={2} />}
                      label="City"
                      value={city}
                      onChangeText={setCity}
                      placeholder="City"
                    />
                  </View>
                  <View style={styles.addressRowSmall}>
                    <InputField
                      icon={<MapPin color={colors.textSecondary} size={18} strokeWidth={2} />}
                      label="State"
                      value={state}
                      onChangeText={setState}
                      placeholder="CA"
                    />
                  </View>
                </View>
                <InputField
                  icon={<MapPin color={colors.textSecondary} size={20} strokeWidth={2} />}
                  label="ZIP Code"
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="90210"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
              <View style={styles.formGroup}>
                <InputField
                  icon={<Calendar color={colors.textSecondary} size={20} strokeWidth={2} />}
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="MM/DD/YYYY"
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

function InputField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  multiline = false,
  required = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputHeader}>
        <View style={styles.labelContainer}>
          {icon}
          <Text style={styles.inputLabel}>
            {label}
            {required && <Text style={styles.requiredAsterisk}> *</Text>}
          </Text>
        </View>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
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
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 28,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...colors.shadowMedium,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -1,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  changePhotoText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.primary,
    letterSpacing: -0.2,
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
  formGroup: {
    gap: 16,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...colors.shadow,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  requiredAsterisk: {
    color: colors.error,
  },
  input: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.3,
    minHeight: 24,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  bottomPadding: {
    height: 40,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addressRowItem: {
    flex: 1,
  },
  addressRowSmall: {
    width: 100,
  },
});
