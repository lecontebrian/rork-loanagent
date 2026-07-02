import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedProgressRing } from './ProgressRing';
import { GradientButton } from './GradientButton';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Spacing, Typography } from '@/constants/theme';

interface HealthScoreCardProps {
  score: number;
  status: string;
  insight: string;
  onSeeRecommendation: () => void;
}

export function HealthScoreCard({
  score,
  status,
  insight,
  onSeeRecommendation,
}: HealthScoreCardProps) {
  const { theme } = useAppTheme();

  return (
    <LinearGradient
      colors={theme.heroGradient as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, theme.shadowStrong]}
    >
      {/* Decorative orbs */}
      <View style={[styles.decoOrb, { top: -40, right: -30, width: 140, height: 140, opacity: 0.15 }]} />
      <View style={[styles.decoOrb, { bottom: -50, left: -20, width: 100, height: 100, opacity: 0.1 }]} />

      <View style={styles.headerRow}>
        <View>
          <Text style={[Typography.subheadline, { color: theme.primaryMint, fontWeight: '600' }]}>
            Loan Health Score
          </Text>
          <Text style={[Typography.title1, { color: '#FFFFFF', marginTop: 2 }]}>
            {status}
          </Text>
        </View>
        <View style={styles.scoreRing}>
          <AnimatedProgressRing progress={score} size={88} strokeWidth={8} />
          <View style={styles.scoreOverlay}>
            <Text style={[Typography.title1, { color: '#FFFFFF', fontWeight: '800' }]}>
              {score}
            </Text>
            <Text style={[Typography.caption2, { color: theme.primaryMint }]}>/ 100</Text>
          </View>
        </View>
      </View>

      {/* Insight */}
      <View style={[styles.insightBox, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
        <View style={styles.insightHeader}>
          <Sparkles size={16} color={theme.primaryMint} />
          <Text style={[Typography.caption1, { color: theme.primaryMint, fontWeight: '700', marginLeft: 6 }]}>
            AI INSIGHT
          </Text>
        </View>
        <Text style={[Typography.callout, { color: '#FFFFFF', marginTop: 8, lineHeight: 22 }]}>
          {insight}
        </Text>
      </View>

      <View style={{ marginTop: Spacing.md }}>
        <GradientButton
          label="See Recommendation"
          onPress={onSeeRecommendation}
          variant="secondary"
          size="md"
          icon={<ArrowRight size={18} color={theme.text} />}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  decoOrb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#C8FFE1',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBox: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 18,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
