import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FileCheck,
  Sparkles,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
} from "lucide-react-native";

export default function WhatItDoesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://r2-pub.rork.com/attachments/477a3nu2xa1i5hb7oe988' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>What Loan Agent Can Do for You</Text>
          <Text style={styles.subtitle}>
            Everything you need to find, compare, and secure the best loan
            options
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureCard
            icon={<FileCheck size={32} color="#6366F1" />}
            title="Unified Application"
            description="Apply for auto, home, business, personal, education, or debt consolidation loans—all from a single, verified profile."
            highlights={[
              "One profile, unlimited applications",
              "Pre-filled information",
              "Instant submission to 30+ lenders",
            ]}
          />

          <FeatureCard
            icon={<Sparkles size={32} color="#10B981" />}
            title="Intelligent Offer Matching"
            description="Our AI compares your profile with 30+ lenders and fintechs to deliver the best available offers for your needs."
            highlights={[
              "Real-time, pre-qualified rates",
              "Personalized approval odds",
              "Smart recommendations based on your profile",
            ]}
            badge="AI POWERED"
          />

          <FeatureCard
            icon={<Shield size={32} color="#8B5CF6" />}
            title="Secure and Protected"
            description="Advanced facial ID, bank-level encryption, and license scanning protect your identity."
            highlights={[
              "Biometric authentication",
              "End-to-end encryption",
              "Secure document scanning",
            ]}
          />

          <FeatureCard
            icon={<Activity size={32} color="#F59E0B" />}
            title="Financial Wellness Dashboard"
            description="Track your credit score, borrowing power, active accounts, upcoming payments, and discover refinancing opportunities."
            highlights={[
              "Real-time credit monitoring",
              "Dynamic borrowing power calculation",
              "Refinance opportunity alerts",
            ]}
            badge="AI INSIGHTS"
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/how-ai-works" as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  highlights,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
  badge?: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureHeader}>
        <View style={styles.iconContainer}>
        <Text>{icon}</Text>
      </View>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
      <View style={styles.highlights}>
        {highlights.map((highlight, index) => (
          <View key={index} style={styles.highlightItem}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#0F172A",
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
  },
  features: {
    paddingHorizontal: 24,
    gap: 20,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#6366F1",
    letterSpacing: 0.5,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#0F172A",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 16,
  },
  highlights: {
    gap: 12,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
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
