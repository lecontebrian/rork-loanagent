//
//  SubscriptionView.swift
//  LoanVaultIOS
//

import SwiftUI

struct SubscriptionView: View {
    @Environment(AppStore.self) private var appStore
    @State private var selected: SubscriptionTier = .plus
    @State private var showConfirm = false

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                hero
                ForEach(SubscriptionTier.allCases, id: \.self) { tier in
                    PlanCard(tier: tier, selected: selected == tier, current: appStore.subscriptionTier == tier) {
                        withAnimation(.spring(response: 0.3)) { selected = tier }
                    }
                }
                PrimaryButton(title: appStore.subscriptionTier == selected ? "Current Plan" : "Upgrade to \(selected.displayName)",
                              gradient: Theme.premiumGradient) {
                    appStore.upgradeTier(selected)
                    showConfirm = true
                }
                .disabled(appStore.subscriptionTier == selected)
                .opacity(appStore.subscriptionTier == selected ? 0.6 : 1)

                Text("Cancel anytime. Prices in USD. Auto-renews monthly.")
                    .font(.caption2).foregroundStyle(Theme.textTertiary)
                    .multilineTextAlignment(.center)
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Premium")
        .navigationBarTitleDisplayMode(.inline)
        .alert("You're all set!", isPresented: $showConfirm) {
            Button("Great") {}
        } message: {
            Text("Welcome to \(selected.displayName). You now have \(selected.tokens) AI tokens.")
        }
    }

    private var hero: some View {
        VStack(spacing: 12) {
            Color.clear
                .frame(height: 160)
                .overlay {
                    Image("gold_coin_vault_crown")
                        .resizable()
                        .scaledToFill()
                        .allowsHitTesting(false)
                }
                .clipShape(.rect(cornerRadius: 24))
                .overlay(alignment: .bottom) {
                    Image(systemName: "crown.fill")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundStyle(Theme.accent)
                        .padding(.bottom, 8)
                }
            Text("Unlock Your Full Potential").font(.system(size: 24, weight: .bold)).foregroundStyle(Theme.text)
                .multilineTextAlignment(.center)
            Text("Get more AI tokens, smarter offers, and premium tools.")
                .font(.subheadline).foregroundStyle(Theme.textSecondary).multilineTextAlignment(.center)
        }
        .padding(.top, 6)
    }
}

private struct PlanCard: View {
    let tier: SubscriptionTier
    let selected: Bool
    let current: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    VStack(alignment: .leading, spacing: 3) {
                        HStack(spacing: 8) {
                            Text(tier.displayName).font(.title3.weight(.bold)).foregroundStyle(Theme.text)
                            if tier == .plus {
                                Text("POPULAR").font(.caption2.weight(.bold)).foregroundStyle(.white)
                                    .padding(.horizontal, 8).padding(.vertical, 3)
                                    .background(Theme.primary, in: .capsule)
                            }
                            if current {
                                Text("CURRENT").font(.caption2.weight(.bold)).foregroundStyle(Theme.secondary)
                                    .padding(.horizontal, 8).padding(.vertical, 3)
                                    .background(Theme.secondary.opacity(0.16), in: .capsule)
                            }
                        }
                        HStack(alignment: .firstTextBaseline, spacing: 2) {
                            Text(tier.monthlyPrice).font(.system(size: 26, weight: .bold)).foregroundStyle(Theme.text)
                            if tier != .basic { Text("/mo").font(.subheadline).foregroundStyle(Theme.textSecondary) }
                        }
                    }
                    Spacer()
                    Image(systemName: selected ? "checkmark.circle.fill" : "circle")
                        .font(.title2).foregroundStyle(selected ? Theme.primary : Theme.surfaceTertiary)
                }
                VStack(alignment: .leading, spacing: 9) {
                    ForEach(tier.features, id: \.self) { feature in
                        HStack(spacing: 10) {
                            Image(systemName: "checkmark").font(.caption.weight(.bold)).foregroundStyle(Theme.primary)
                            Text(feature).font(.subheadline).foregroundStyle(Theme.textSecondary)
                        }
                    }
                }
            }
            .padding(20)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.surface, in: .rect(cornerRadius: 22))
            .overlay(RoundedRectangle(cornerRadius: 22).stroke(selected ? Theme.primary : Theme.border, lineWidth: selected ? 2 : 1))
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    NavigationStack { SubscriptionView() }
        .environment(AppStore())
        .preferredColorScheme(.dark)
}
