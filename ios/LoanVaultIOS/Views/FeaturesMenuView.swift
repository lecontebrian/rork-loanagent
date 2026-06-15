//
//  FeaturesMenuView.swift
//  LoanVaultIOS
//

import SwiftUI

struct FeaturesMenuView: View {
    private let features: [Feature] = [
        Feature(id: "coach", title: "AI Financial Coach", subtitle: "Get personalized financial advice 24/7", symbol: "brain.head.profile", colors: [Color(hex: 0xFF9500), Color(hex: 0xFF6B00)], route: .aiAssistant),
        Feature(id: "p2p", title: "P2P Lending", subtitle: "Invest in loans and earn returns", symbol: "person.2.fill", colors: [Color(hex: 0x5E5CE6), Color(hex: 0xBF5AF2)], route: .p2p),
        Feature(id: "budget", title: "Budget Tracker", subtitle: "Track expenses and manage your budget", symbol: "wallet.bifold.fill", colors: [Color(hex: 0x30D158), Color(hex: 0x28B349)], route: .budget),
        Feature(id: "simulator", title: "Loan Simulator", subtitle: "Simulate what-if scenarios for loans", symbol: "slider.horizontal.3", colors: [Color(hex: 0x0A84FF), Color(hex: 0x0066D6)], route: .simulator),
        Feature(id: "credit", title: "Credit Builder", subtitle: "Improve and repair your credit score", symbol: "chart.line.uptrend.xyaxis", colors: [Color(hex: 0xFF375F), Color(hex: 0xFF1744)], route: .credit),
        Feature(id: "vault", title: "Document Vault", subtitle: "Securely store your financial documents", symbol: "lock.doc.fill", colors: [Color(hex: 0x5856D6), Color(hex: 0x7C3AED)], route: .vault),
        Feature(id: "local", title: "Local Lenders", subtitle: "Find credit unions and local lenders", symbol: "mappin.and.ellipse", colors: [Color(hex: 0x32ADE6), Color(hex: 0x0891B2)], route: .localLenders),
        Feature(id: "premium", title: "Go Premium", subtitle: "Unlock everything with Plus or Pro", symbol: "crown.fill", colors: [Theme.primary, Theme.secondary], route: .premium),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("All Features").font(.system(size: 28, weight: .bold)).foregroundStyle(Theme.text)
                    Text("Comprehensive financial tools").font(.subheadline).foregroundStyle(Theme.textSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 6)

                ForEach(features) { feature in
                    NavigationLink(value: feature.route) {
                        FeatureCard(feature: feature)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Tools")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: FeatureRoute.self) { route in
            switch route {
            case .aiAssistant: AIAssistantView()
            case .p2p: P2PMarketplaceView()
            case .budget: BudgetTrackerView()
            case .simulator: LoanSimulatorView()
            case .credit: CreditBuilderView()
            case .vault: DocumentVaultView()
            case .localLenders: LocalLendersView()
            case .premium: SubscriptionView()
            }
        }
    }
}

enum FeatureRoute: Hashable {
    case aiAssistant, p2p, budget, simulator, credit, vault, localLenders, premium
}

struct Feature: Identifiable {
    let id: String
    let title: String
    let subtitle: String
    let symbol: String
    let colors: [Color]
    let route: FeatureRoute
}

private struct FeatureCard: View {
    let feature: Feature

    var body: some View {
        HStack(spacing: 18) {
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(.white.opacity(0.18))
                .frame(width: 60, height: 60)
                .overlay(
                    Image(systemName: feature.symbol)
                        .font(.system(size: 26, weight: .semibold))
                        .foregroundStyle(.white)
                )
            VStack(alignment: .leading, spacing: 5) {
                Text(feature.title).font(.system(size: 19, weight: .bold)).foregroundStyle(.white)
                Text(feature.subtitle).font(.subheadline).foregroundStyle(.white.opacity(0.9)).lineLimit(2)
            }
            Spacer()
        }
        .padding(22)
        .background(
            LinearGradient(colors: feature.colors, startPoint: .topLeading, endPoint: .bottomTrailing),
            in: .rect(cornerRadius: 22)
        )
    }
}

#Preview {
    NavigationStack { FeaturesMenuView() }
        .environment(AppStore())
        .environment(P2PStore())
        .preferredColorScheme(.dark)
}
