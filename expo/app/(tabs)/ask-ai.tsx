import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Send, Mic, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';
import { AIOrb } from '@/components/AIOrb';
import { GlassCard } from '@/components/GlassCard';
import { Spacing, Typography, Radii } from '@/constants/theme';
import { aiSuggestedPrompts, getAIResponse } from '@/mocks/loanData';
import type { AIChatMessage } from '@/types';

export default function AskAIScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList<AIChatMessage>>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setInputText('');

      const userMsg: AIChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const response = getAIResponse(trimmed);
        const aiMsg: AIChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1400);
    },
    [isTyping]
  );

  const handlePrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const renderMessage = ({ item }: { item: AIChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <AIOrb size={32} pulsing={false} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: theme.primary }]
              : [styles.aiBubble, { backgroundColor: theme.surface, borderColor: theme.border }],
          ]}
        >
          <Text
            style={[
              Typography.callout,
              {
                color: isUser ? '#FFFFFF' : theme.text,
                lineHeight: 22,
              },
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    return (
      <View style={[styles.messageRow, styles.aiRow]}>
        <View style={styles.aiAvatar}>
          <AIOrb size={32} pulsing active />
        </View>
        <View style={[styles.aiBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.typingDots}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[Typography.caption1, { color: theme.textMuted, marginLeft: 8 }]}>
              Loan Agent is analyzing…
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <AIOrb size={40} pulsing active />
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={[Typography.headline, { color: theme.text }]}>Loan Agent AI</Text>
          <Text style={[Typography.caption1, { color: theme.primary }]}>
            ● Online — Ready to help
          </Text>
        </View>
      </View>

      {/* Messages or Empty State */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <AIOrb size={100} pulsing active />
          <Text style={[Typography.title2, { color: theme.text, textAlign: 'center', marginTop: Spacing.xl }]}>
            Hi {''}Brian! I'm your AI Loan Agent 👋
          </Text>
          <Text style={[Typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: Spacing.sm, paddingHorizontal: Spacing.xl }]}>
            Ask me anything about your loans, payments, or refinancing options.
          </Text>

          {/* Suggested prompts */}
          <View style={styles.suggestedPrompts}>
            {aiSuggestedPrompts.map((prompt, index) => (
              <Pressable
                key={index}
                onPress={() => handlePrompt(prompt)}
                style={({ pressed }) => [
                  styles.promptChip,
                  {
                    backgroundColor: pressed ? theme.surfaceSecondary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Sparkles size={14} color={theme.primary} />
                <Text style={[Typography.subheadline, { color: theme.text, flex: 1 }]}>
                  {prompt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.lg,
            paddingBottom: Spacing.md,
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={renderTypingIndicator}
        />
      )}

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              marginBottom: insets.bottom > 0 ? insets.bottom : 8,
            },
          ]}
        >
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={[styles.micBtn, { backgroundColor: `${theme.primary}22` }]}
          >
            <Mic size={20} color={theme.primary} />
          </Pressable>
          <TextInput
            style={[styles.textInput, { color: theme.text }]}
            placeholder="Ask your Loan Agent…"
            placeholderTextColor={theme.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isTyping}
          />
          <Pressable
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim() || isTyping}
            style={[
              styles.sendBtn,
              {
                backgroundColor: inputText.trim() && !isTyping ? theme.primary : theme.surfaceTertiary,
              },
            ]}
          >
            <Send size={18} color={inputText.trim() && !isTyping ? '#FFFFFF' : theme.textMuted} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  suggestedPrompts: {
    marginTop: Spacing.xxl,
    width: '100%',
    gap: 10,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    maxWidth: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    marginRight: 8,
    marginTop: 2,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '82%',
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 1,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 28,
    borderWidth: 1,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 10,
    maxHeight: 100,
    minHeight: 40,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
