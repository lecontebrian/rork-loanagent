import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Platform, Alert, Share, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mic, MicOff, Send, User, Bot, Sparkles, Trash2, Share2, FileText, Settings } from 'lucide-react-native';
import ScreenMenu from '@/components/ScreenMenu';
import colors from '@/constants/colors';
import { images } from '@/constants/mediaAssets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile, creditInfo } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

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
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I understand you want to know about "${inputMessage}". Based on your credit score of ${creditInfo?.score || 700} and your financial profile, I can help you with personalized advice and recommendations.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  const toggleRecording = () => {
    if (Platform.OS === 'web') {
      console.log('Voice recording not available on web');
      return;
    }
    setIsRecording(!isRecording);
    console.log(isRecording ? 'Stopping recording' : 'Starting recording');
  };

  const quickPrompts = [
    'How can I improve my credit score?',
    'What loans am I eligible for?',
    'Help me create a budget',
    'Explain my debt-to-income ratio',
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
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <ScreenMenu
            items={[
              {
                icon: Trash2,
                label: 'Clear Conversation',
                onPress: () => {
                  Alert.alert(
                    'Clear Conversation',
                    'Are you sure you want to clear all messages?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Clear', style: 'destructive', onPress: () => setMessages([]) },
                    ]
                  );
                },
                color: colors.error,
              },
              {
                icon: FileText,
                label: 'Save Transcript',
                onPress: () => Alert.alert('Save', 'Conversation saved to your documents'),
                color: colors.info,
              },
              {
                icon: Share2,
                label: 'Share Chat',
                onPress: async () => {
                  try {
                    await Share.share({
                      message: 'Check out this AI Assistant conversation!',
                    });
                  } catch (error) {
                    console.error('Share error:', error);
                  }
                },
                color: colors.success,
              },
              {
                icon: Settings,
                label: 'Assistant Settings',
                onPress: () => router.push('/settings' as any),
                color: colors.textSecondary,
              },
            ]}
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {messages.length === 0 ? (
            <>
              <Animated.View style={[styles.welcomeCard, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={['#BF5AF2', '#8A2BE2']}
                  style={styles.welcomeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.welcomeIcon}>
                    <Image
                      source={{ uri: images.aiAgentAvatar }}
                      style={styles.aiAvatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.welcomeTitle}>Hi, {userProfile?.firstName || 'there'}!</Text>
                  <Text style={styles.welcomeText}>
                    I&apos;m your AI financial assistant. I can help you with loans, credit, budgeting, and more.
                  </Text>
                  <View style={styles.capabilitiesContainer}>
                    <View style={styles.capabilityItem}>
                      <Sparkles color="rgba(255, 255, 255, 0.9)" size={16} strokeWidth={2.5} />
                      <Text style={styles.capabilityText}>Voice & Text</Text>
                    </View>
                    <View style={styles.capabilityItem}>
                      <Sparkles color="rgba(255, 255, 255, 0.9)" size={16} strokeWidth={2.5} />
                      <Text style={styles.capabilityText}>24/7 Available</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>

              <View style={styles.quickPromptsSection}>
                <Text style={styles.sectionTitle}>Quick Start</Text>
                <View style={styles.quickPromptsList}>
                  {quickPrompts.map((prompt, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickPromptCard}
                      activeOpacity={0.8}
                      onPress={() => setInputMessage(prompt)}
                    >
                      <Text style={styles.quickPromptText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.messagesContainer}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper
                  ]}
                >
                  {message.role === 'assistant' && (
                    <View style={styles.assistantAvatar}>
                      <Bot color={colors.white} size={16} strokeWidth={2.5} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      message.role === 'user' ? styles.userMessage : styles.assistantMessage
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                    ]}>
                      {message.content}
                    </Text>
                    <Text style={[
                      styles.messageTime,
                      message.role === 'user' ? styles.userMessageTime : styles.assistantMessageTime
                    ]}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  {message.role === 'user' && (
                    <View style={styles.userAvatar}>
                      <User color={colors.white} size={16} strokeWidth={2.5} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message or use voice..."
              placeholderTextColor={colors.textTertiary}
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
              maxLength={500}
            />
            <View style={styles.inputActions}>
              {Platform.OS !== 'web' && (
                <TouchableOpacity
                  style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
                  onPress={toggleRecording}
                  activeOpacity={0.7}
                >
                  {isRecording ? (
                    <MicOff color={colors.white} size={20} strokeWidth={2.5} />
                  ) : (
                    <Mic color={colors.primary} size={20} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              )}
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  welcomeCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadowStrong,
  },
  welcomeGradient: {
    padding: 32,
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  aiAvatarImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 12,
    letterSpacing: -0.6,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  capabilitiesContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  capabilityText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  quickPromptsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  quickPromptsList: {
    gap: 12,
  },
  quickPromptCard: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow,
  },
  quickPromptText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  messagesContainer: {
    gap: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMessageWrapper: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  userMessageText: {
    color: colors.white,
  },
  assistantMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: -0.1,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  assistantMessageTime: {
    color: colors.textTertiary,
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
    gap: 10,
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
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  voiceButtonActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
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
