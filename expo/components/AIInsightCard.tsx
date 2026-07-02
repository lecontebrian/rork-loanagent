import { View, StyleSheet, Text } from 'react-native';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Spacing, Typography } from '@/constants/theme';
import type { AIInsight } from '@/types';

interface AIInsightCardProps {
  insight: AIInsight;
  onPress?: () => void;
  compact?: boolean;
}

const typeIcons = {
  savings: TrendingUp,
  refinance: Sparkles,
  warning: AlertTriangle,
  tip: Lightbulb,
};

const typeColors = {
  savings: '#16C784',
  refinance: '#3B9EFF',
  warning: '#F5A623',
  tip: '#16C784',
};

export function AIInsightCard({ insight, onPress, compact = false }: AIInsightCardProps) {
  const { theme } = useAppTheme();
  const Icon = typeIcons[insight.type];
  const color = typeColors[insight.type];

  return (
    <GlassCard padding={Spacing.lg} intensity={30} onPress={onPress} pressable={!!onPress}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: `${color}22` }]}>
          <Icon size={18} color={color} />
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={[Typography.caption1, { color: color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }]}>
            {insight.title}
          </Text>
        </View>
        {onPress && <ArrowRight size={16} color={theme.textMuted} />}
      </View>

      <Text style={[Typography.callout, { color: theme.text, marginTop: Spacing.sm, lineHeight: 22 }]}>
        {insight.body}
      </Text>

      {!compact && insight.savingAmount > 0 && (
        <View style={[styles.savingsBox, { backgroundColor: `${theme.primary}15` }]}>
          <Text style={[Typography.caption1, { color: theme.textMuted }]}>Potential Savings</Text>
          <Text style={[Typography.title2, { color: theme.primary, fontWeight: '800' }]}>
            ${insight.savingAmount.toLocaleString()}
          </Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
