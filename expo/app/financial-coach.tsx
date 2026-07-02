import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput, Share, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Brain, TrendingUp, Target, Lightbulb, Send, User, Sparkles, BookOpen, Share2, Bell, Settings } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRorkAgent, createRorkTool } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import ScreenMenu from '@/components/ScreenMenu';

export default function FinancialCoachScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile, creditInfo, applications } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, sendMessage, error } = useRorkAgent({
    tools: {
      analyzeCreditScore: createRorkTool({
        description: "Analyze user's credit score and provide improvement recommendations",
        zodSchema: z.object({
          score: z.number().describe("Current credit score"),
          recommendations: z.array(z.string()).describe("List of actionable recommendations"),
        }),
        execute(input) {
          console.log('Credit analysis:', input);
          return 'Analysis complete';
        },
      }),
      calculateDebtToIncome: createRorkTool({
        description: "Calculate user's debt-to-income ratio",
        zodSchema: z.object({
          monthlyDebt: z.number().describe("Total monthly debt payments"),
          monthlyIncome: z.number().describe("Total monthly income"),
          ratio: z.number().describe("Calculated DTI ratio percentage"),
        }),
        execute(input) {
          console.log('DTI calculation:', input);
          return 'Calculation complete';
        },
      }),
      suggestBudget: createRorkTool({
        description: "Suggest a budget plan based on user's financial situation",
        zodSchema: z.object({
          income: z.number().describe("Monthly income"),
          suggestedCategories: z.array(z.object({
            category: z.string(),
            amount: z.number(),
            percentage: z.number(),
          })).describe("Budget categories with suggested amounts"),
        }),
        execute(input) {
          console.log('Budget suggestion:', input);
          return 'Budget created';
        },
      }),
    },
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      const context = `User Profile: ${userProfile?.firstName || 'User'}, Credit Score: ${creditInfo?.score || 'N/A'}, Annual Income: $${userProfile?.employment.annualIncome.toLocaleString() || 'N/A'}, Active Applications: ${applications.length}`;
      sendMessage(`${context}\n\nUser Question: ${inputMessage}`);
      setInputMessage('');
    }
  };

  const quickActions = [
    { id: 'credit', icon: TrendingUp, title: 'Improve Credit Score', prompt: 'How can I improve my credit score?' },
    { id: 'budget', icon: Target, title: 'Create Budget Plan', prompt: 'Help me create a budget plan based on my income' },
    { id: 'debt', icon: Lightbulb, title: 'Reduce Debt', prompt: 'What strategies can I use to reduce my debt?' },
  ];

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
            <Text style={styles.headerTitle}>Financial Coach</Text>
            <Text style={styles.headerSubtitle}>AI-Powered Insights</Text>
          </View>
          <ScreenMenu
            items={[
              {
                icon: BookOpen,
                label: 'View Learning Resources',
                onPress: () => Alert.alert('Learning Resources', 'Access financial education materials'),
                color: colors.primary,
              },
              {
                icon: Share2,
                label: 'Share Conversation',
                onPress: async () => {
                  try {
                    await Share.share({
                      message: 'Check out this AI Financial Coach!',
                    });
                  } catch (error) {
                    console.error('Share error:', error);
                  }
                },
                color: colors.success,
              },
              {
                icon: Bell,
                label: 'Set Reminders',
                onPress: () => Alert.alert('Reminders', 'Set financial coaching reminders'),
                color: colors.warning,
              },
              {
                icon: Settings,
                label: 'Coach Settings',
                onPress: () => router.push('/settings' as any),
                color: colors.textSecondary,
              },
            ]}
          />
        </View>

        <Animated.View style={[styles.coachBanner, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#FF9500', '#FF6B00']}
            style={styles.coachBannerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.coachIcon}>
              <Brain color={colors.white} size={28} strokeWidth={2.5} />
            </View>
            <View style={styles.coachInfo}>
              <Text style={styles.coachTitle}>Your AI Financial Advisor</Text>
              <Text style={styles.coachSubtitle}>Get personalized advice 24/7</Text>
            </View>
            <Sparkles color="rgba(255, 255, 255, 0.8)" size={24} strokeWidth={2} />
          </LinearGradient>
        </Animated.View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {messages.length === 0 ? (
            <>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>How can I help you today?</Text>
                <Text style={styles.welcomeSubtitle}>
                  Ask me anything about your finances, credit, budgeting, or debt management.
                </Text>
              </View>

              <View style={styles.quickActionsContainer}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                  {quickActions.map((action) => (
                    <TouchableOpacity
                      key={action.id}
                      style={styles.quickActionCard}
                      activeOpacity={0.8}
                      onPress={() => sendMessage(action.prompt)}
                    >
                      <View style={styles.quickActionIcon}>
                        <action.icon color={colors.primary} size={22} strokeWidth={2.5} />
                      </View>
                      <Text style={styles.quickActionTitle}>{action.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {creditInfo && (
                <View style={styles.insightsContainer}>
                  <Text style={styles.sectionTitle}>Your Financial Snapshot</Text>
                  <View style={styles.insightCard}>
                    <View style={styles.insightRow}>
                      <Text style={styles.insightLabel}>Credit Score</Text>
                      <Text style={styles.insightValue}>{creditInfo.score}</Text>
                    </View>
                    <View style={styles.insightRow}>
                      <Text style={styles.insightLabel}>Rating</Text>
                      <Text style={[styles.insightValue, { color: colors.success }]}>
                        {creditInfo.rating.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.insightRow}>
                      <Text style={styles.insightLabel}>Active Applications</Text>
                      <Text style={styles.insightValue}>{applications.length}</Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.messagesContainer}>
              {messages.map((message) => (
                <View key={message.id} style={styles.messageWrapper}>
                  {message.role === 'user' ? (
                    <View style={styles.userMessageContainer}>
                      <View style={styles.userMessage}>
                        {message.parts.map((part, index) => {
                          if (part.type === 'text') {
                            return (
                              <Text key={index} style={styles.userMessageText}>
                                {part.text}
                              </Text>
                            );
                          }
                          return null;
                        })}
                      </View>
                      <View style={styles.userAvatar}>
                        <User color={colors.white} size={16} strokeWidth={2.5} />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.assistantMessageContainer}>
                      <View style={styles.assistantAvatar}>
                        <Brain color={colors.white} size={16} strokeWidth={2.5} />
                      </View>
                      <View style={styles.assistantMessage}>
                        {message.parts.map((part, index) => {
                          if (part.type === 'text') {
                            return (
                              <Text key={index} style={styles.assistantMessageText}>
                                {part.text}
                              </Text>
                            );
                          }
                          if (part.type === 'tool') {
                            return (
                              <View key={index} style={styles.toolCall}>
                                <Sparkles color={colors.primary} size={14} strokeWidth={2.5} />
                                <Text style={styles.toolCallText}>
                                  {part.state === 'input-streaming' || part.state === 'input-available'
                                    ? `Analyzing ${part.toolName}...`
                                    : part.state === 'output-available'
                                    ? `Analysis complete`
                                    : 'Processing...'}
                                </Text>
                              </View>
                            );
                          }
                          return null;
                        })}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything about your finances..."
              placeholderTextColor={colors.textTertiary}
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputMessage.trim()}
              activeOpacity={0.7}
            >
              <Send color={inputMessage.trim() ? colors.white : colors.textTertiary} size={20} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
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
  coachBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...colors.shadowMedium,
  },
  coachBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  coachIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachInfo: {
    flex: 1,
  },
  coachTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  coachSubtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: -0.1,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
    ...colors.shadow,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
    ...colors.shadow,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  messagesContainer: {
    gap: 16,
  },
  messageWrapper: {
    marginBottom: 8,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 10,
  },
  userMessage: {
    maxWidth: '80%',
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  userMessageText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.white,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantMessage: {
    maxWidth: '80%',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assistantMessageText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  toolCall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  toolCallText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.error,
    letterSpacing: -0.1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceTertiary,
  },
});
