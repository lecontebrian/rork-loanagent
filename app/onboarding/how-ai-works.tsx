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
  Brain,
  Target,
  TrendingUp,
  Bell,
  Zap,
  ArrowRight,
} from "lucide-react-native";

export default function HowAIWorksScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.heroIcon}>
            <Brain size={48} color="#6366F1" />
          </View>
          <Text style={styles.title}>How the AI Works For You</Text>
          <Text style={styles.subtitle}>
            Powered by advanced machine learning to deliver personalized
            financial insights
          </Text>
        </View>

        <View style={styles.features}>
          <AIFeatureCard
            icon={<Target size={28} color="#6366F1" />}
            title="Smart Matching"
            description="Our intelligent system analyzes your credit, income, loan goals, and payment history to instantly match you with top offers and savings opportunities."
            details={[
              "Analyzes 50+ data points from your profile",
              "Compares against 30+ lenders in real-time",
              "Calculates your approval probability",
              "Ranks offers by best fit and savings",
            ]}
            gradient={["#EEF2FF", "#E0E7FF"]}
          />

          <AIFeatureCard
            icon={<TrendingUp size={28} color="#10B981" />}
            title="Credit Health Coach"
            description="AI insights show you ways to boost your score, save on interest, and budget for your future. Get tips, alerts, and financial simulations based on your data."
            details={[
              "Real-time credit score tracking",
              "Personalized improvement recommendations",
              "Debt-to-income ratio optimization",
              "What-if scenario simulations",
            ]}
            gradient={["#ECFDF5", "#D1FAE5"]}
          />

          <AIFeatureCard
            icon={<Bell size={28} color="#F59E0B" />}
            title="Personalized Notifications"
            description="Receive timely alerts for refinance deals, payment reminders, and loan milestones—tailored to your exact profile."
            details={[
              "Refinance opportunity alerts",
              "Payment due reminders",
              "Rate drop notifications",
              "Credit score change alerts",
            ]}
            gradient={["#FFFBEB", "#FEF3C7"]}
          />

          <AIFeatureCard
            icon={<Zap size={28} color="#8B5CF6" />}
            title="Instant Processing"
            description="Our AI engine processes your application in seconds, delivering pre-qualified offers faster than traditional methods."
            details={[
              "Instant credit analysis",
              "Real-time offer generation",
              "Automated document verification",
              "Fast-track approval for qualified applicants",
            ]}
            gradient={["#F5F3FF", "#EDE9FE"]}
          />
        </View>

        <View style={styles.confidenceSection}>
          <Text style={styles.confidenceTitle}>Trusted AI Technology</Text>
          <Text style={styles.confidenceText}>
            Our AI models are trained on millions of loan applications and
            continuously updated with the latest market data to ensure you get
            the most accurate and beneficial recommendations.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/why-choose" as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AIFeatureCard({
  icon,
  title,
  description,
  details,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  gradient: [string, string];
}) {
  return (
    <View style={styles.aiFeatureCard}>
      <View
        style={[
          styles.aiIconContainer,
          { backgroundColor: gradient[0], borderColor: gradient[1] },
        ]}
      >
        <Text>{icon}</Text>
      </View>
      <View style={styles.aiContent}>
        <Text style={styles.aiFeatureTitle}>{title}</Text>
        <Text style={styles.aiFeatureDescription}>{description}</Text>
        <View style={styles.detailsList}>
          {details.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <View style={styles.bullet} />
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#E0E7FF",
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#0F172A",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
    textAlign: "center",
  },
  features: {
    paddingHorizontal: 24,
    gap: 24,
  },
  aiFeatureCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  aiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  aiContent: {
    gap: 12,
  },
  aiFeatureTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0F172A",
  },
  aiFeatureDescription: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
  },
  detailsList: {
    gap: 10,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6366F1",
    marginTop: 7,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  confidenceSection: {
    marginTop: 32,
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  confidenceTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0F172A",
    marginBottom: 12,
  },
  confidenceText: {
    fontSize: 15,
    color: "#475569",
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
});
