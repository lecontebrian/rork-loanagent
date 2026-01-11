import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactUsScreen() {
  const router = useRouter();
  const { userProfile } = useApp();
  const insets = useSafeAreaInsets();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting us. We will respond to your inquiry within 24 hours.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const handleCategoryChange = () => {
    Alert.alert(
      'Select Category',
      'Choose the category that best describes your inquiry',
      [
        { text: 'General Question', onPress: () => setCategory('general') },
        { text: 'Loan Application', onPress: () => setCategory('loan') },
        { text: 'Technical Issue', onPress: () => setCategory('technical') },
        { text: 'Account Issue', onPress: () => setCategory('account') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const getCategoryLabel = () => {
    if (category === 'loan') return 'Loan Application';
    if (category === 'technical') return 'Technical Issue';
    if (category === 'account') return 'Account Issue';
    return 'General Question';
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
            <Text style={styles.headerTitle}>Contact Us</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.infoSection}>
              <View style={styles.infoIcon}>
                <MessageSquare color={colors.primary} size={32} strokeWidth={2} />
              </View>
              <Text style={styles.infoTitle}>Get in Touch</Text>
              <Text style={styles.infoSubtitle}>
                Have a question or need help? Send us a message and we&apos;ll respond as soon as possible.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>YOUR INFORMATION</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>
                  {userProfile?.firstName || 'User'} {userProfile?.lastName || ''}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {userProfile?.email || 'user@example.com'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MESSAGE DETAILS</Text>
              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={handleCategoryChange}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectLabel}>Category</Text>
                  <Text style={styles.selectValue}>{getCategoryLabel()}</Text>
                </TouchableOpacity>

                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>Subject</Text>
                  <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Brief description of your inquiry"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Provide detailed information about your inquiry..."
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Send color={colors.white} size={20} strokeWidth={2} />
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>

            <View style={styles.contactInfo}>
              <Text style={styles.contactInfoTitle}>Other Ways to Reach Us</Text>
              <View style={styles.contactItem}>
                <Mail color={colors.textSecondary} size={16} strokeWidth={2} />
                <Text style={styles.contactText}>support@loanagent.com</Text>
              </View>
              <View style={styles.contactItem}>
                <MessageSquare color={colors.textSecondary} size={16} strokeWidth={2} />
                <Text style={styles.contactText}>Response time: Within 24 hours</Text>
              </View>
            </View>

            <View style={styles.bottomPadding} />
          </View>
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
    paddingBottom: 40,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 28,
  },
  infoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
  infoBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    ...colors.shadow,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  formGroup: {
    gap: 16,
  },
  selectBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...colors.shadow,
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  selectValue: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  inputBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...colors.shadow,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 12,
    letterSpacing: -0.1,
  },
  input: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.3,
    minHeight: 24,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    marginHorizontal: 28,
    marginTop: 32,
    gap: 8,
    ...colors.shadowMedium,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.3,
  },
  contactInfo: {
    marginTop: 32,
    marginHorizontal: 28,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    ...colors.shadow,
  },
  contactInfoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  bottomPadding: {
    height: 40,
  },
});
