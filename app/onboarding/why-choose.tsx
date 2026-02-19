import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CheckCircle,
  Shield,
  Users,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react-native";

export default function WhyChooseScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Why Choose Loan Agent?</Text>
          <Text style={styles.subtitle}>
            The smartest way to navigate your loan journey
          </Text>
        </View>

        <View style={styles.reasonsList}>
          <ReasonCard
            icon={<Sparkles size={32} color="#6366F1" />}
            title="AI does the hard work"
            description="You get unbiased, real-time comparisons and recommendations. No more guesswork or paperwork chaos."
            color="#6366F1"
          />

          <ReasonCard
            icon={<Users size={32} color="#10B981" />}
            title="One profile, every loan"
            description="From banks, BNPLs, credit unions—apply everywhere in one place with one scan."
            color="#10B981"
          />

          <ReasonCard
            icon={<Shield size={32} color="#8B5CF6" />}
            title="Total security"
            description="No personal info leaves your device without encryption and explicit consent."
            color="#8B5CF6"
          />

          <ReasonCard
            icon={<TrendingUp size={32} color="#F59E0B" />}
            title="Save time and money"
            description="Compare 30+ lenders instantly and discover refinance opportunities that could save you thousands."
            color="#F59E0B"
          />
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Join Thousands of Users</Text>
          <View style={styles.statsGrid}>
            <StatCard value="30+" label="Lenders Connected" />
            <StatCard value="$2.5M+" label="Saved in Interest" />
            <StatCard value="10K+" label="Active Users" />
            <StatCard value="4.9★" label="Average Rating" />
          </View>
        </View>

        <View style={styles.readySection}>
          <CheckCircle size={56} color="#10B981" />
          <Text style={styles.readyTitle}>Ready to Get Started?</Text>
          <Text style={styles.readyText}>
            Create your profile in minutes and start receiving personalized loan
            offers instantly.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/signup" as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start My Journey</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/onboarding/signup" as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ReasonCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <View style={styles.reasonCard}>
      <View style={[styles.reasonIcon, { backgroundColor: `${color}15` }]}>
        <Text>{icon}</Text>
      </View>
      <View style={styles.reasonContent}>
        <Text style={styles.reasonTitle}>{title}</Text>
        <Text style={styles.reasonDescription}>{description}</Text>
      </View>
    </View>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 180,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: "#0F172A",
    marginBottom: 12,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
  },
  reasonsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  reasonCard: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 16,
  },
  reasonIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  reasonContent: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0F172A",
    marginBottom: 6,
  },
  reasonDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  statsSection: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: "#6366F1",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
  },
  readySection: {
    marginTop: 40,
    marginHorizontal: 24,
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F0FDF4",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  readyTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#0F172A",
    marginTop: 16,
    marginBottom: 12,
  },
  readyText: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 12,
  },
  button: {
    backgroundColor: "#6366F1",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700" as const,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#6366F1",
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
