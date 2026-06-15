//
//  SettingsView.swift
//  LoanVaultIOS
//

import SwiftUI

struct SettingsView: View {
    @Environment(AppStore.self) private var appStore
    @State private var showResetConfirm = false

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                profileCard
                NavigationLink(value: SettingsRoute.premium) {
                    upgradeCard
                }
                .buttonStyle(.plain)

                settingsGroup("Account", items: [
                    .init(symbol: "person.fill", title: "Personal Information", tint: Theme.secondary),
                    .init(symbol: "creditcard.fill", title: "Payment Methods", tint: Theme.primary),
                    .init(symbol: "building.columns.fill", title: appStore.hasConnectedBank ? "Bank Connected" : "Connect Bank", tint: Theme.accent),
                ])

                settingsToggleGroup

                settingsGroup("Support", items: [
                    .init(symbol: "questionmark.circle.fill", title: "Help Center", tint: Theme.secondary),
                    .init(symbol: "doc.text.fill", title: "Terms & Privacy", tint: Theme.textSecondary),
                    .init(symbol: "star.fill", title: "Rate the App", tint: Theme.accent),
                ])

                Button(role: .destructive) { showResetConfirm = true } label: {
                    Text("Reset App Data")
                        .font(.headline).foregroundStyle(Theme.error)
                        .frame(maxWidth: .infinity).padding(.vertical, 16)
                        .background(Theme.error.opacity(0.12), in: .rect(cornerRadius: 15))
                }

                Text("Loan Agent v1.0.0").font(.caption2).foregroundStyle(Theme.textTertiary)
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Settings")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: SettingsRoute.self) { route in
            switch route {
            case .premium: SubscriptionView()
            }
        }
        .alert("Reset App Data?", isPresented: $showResetConfirm) {
            Button("Cancel", role: .cancel) {}
            Button("Reset", role: .destructive) {
                appStore.applications = []
                appStore.upgradeTier(.basic)
            }
        } message: {
            Text("This clears your applications and resets your subscription to Basic.")
        }
    }

    private var profileCard: some View {
        Card {
            HStack(spacing: 14) {
                Circle()
                    .fill(Theme.primaryGradient)
                    .frame(width: 56, height: 56)
                    .overlay(Text(String(appStore.userProfile?.firstName.prefix(1) ?? "U")).font(.title2.weight(.bold)).foregroundStyle(.white))
                VStack(alignment: .leading, spacing: 3) {
                    Text("\(appStore.userProfile?.firstName ?? "User") \(appStore.userProfile?.lastName ?? "")")
                        .font(.headline).foregroundStyle(Theme.text)
                    Text(appStore.userProfile?.email ?? "").font(.subheadline).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
            }
        }
        .padding(.top, 6)
    }

    private var upgradeCard: some View {
        HStack(spacing: 14) {
            IconChip(symbol: "crown.fill", tint: Theme.accent, size: 48, iconSize: 22)
            VStack(alignment: .leading, spacing: 2) {
                Text("\(appStore.subscriptionTier.displayName) Plan").font(.headline).foregroundStyle(Theme.text)
                Text("\(appStore.tokens) AI tokens remaining").font(.caption).foregroundStyle(Theme.textSecondary)
            }
            Spacer()
            Image(systemName: "chevron.right").foregroundStyle(Theme.textTertiary)
        }
        .padding(18)
        .background(Theme.premiumGradient.opacity(0.16), in: .rect(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Theme.primary.opacity(0.4), lineWidth: 1))
    }

    @ViewBuilder
    private var settingsToggleGroup: some View {
        @Bindable var store = appStore
        VStack(alignment: .leading, spacing: 10) {
            Text("Preferences").font(.caption.weight(.bold)).foregroundStyle(Theme.textSecondary).tracking(0.5)
                .padding(.leading, 4)
            Card(padding: 6) {
                VStack(spacing: 0) {
                    Toggle(isOn: $store.notificationsEnabled) {
                        HStack(spacing: 14) {
                            IconChip(symbol: "bell.fill", tint: Theme.primary, size: 38, iconSize: 16)
                            Text("Notifications").font(.subheadline.weight(.medium)).foregroundStyle(Theme.text)
                        }
                    }
                    .tint(Theme.primary)
                    .padding(12)
                }
            }
        }
    }

    private func settingsGroup(_ title: String, items: [SettingsItem]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title).font(.caption.weight(.bold)).foregroundStyle(Theme.textSecondary).tracking(0.5)
                .padding(.leading, 4)
            Card(padding: 6) {
                VStack(spacing: 0) {
                    ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                        HStack(spacing: 14) {
                            IconChip(symbol: item.symbol, tint: item.tint, size: 38, iconSize: 16)
                            Text(item.title).font(.subheadline.weight(.medium)).foregroundStyle(Theme.text)
                            Spacer()
                            Image(systemName: "chevron.right").font(.caption).foregroundStyle(Theme.textTertiary)
                        }
                        .padding(12)
                        if index < items.count - 1 {
                            Divider().overlay(Theme.border).padding(.leading, 64)
                        }
                    }
                }
            }
        }
    }
}

enum SettingsRoute: Hashable { case premium }

private struct SettingsItem {
    let symbol: String
    let title: String
    let tint: Color
}

#Preview {
    NavigationStack { SettingsView() }
        .environment(AppStore())
        .preferredColorScheme(.dark)
}
