//
//  OnboardingView.swift
//  LoanVaultIOS
//

import SwiftUI

struct OnboardingView: View {
    @Environment(AppStore.self) private var appStore
    @State private var page = 0

    private let pages: [OnboardingPage] = [
        OnboardingPage(symbol: "building.columns.fill", title: "Smarter Borrowing", subtitle: "Compare real offers from 40+ trusted lenders and find your best rate in seconds.", tint: Theme.primary, image: "vault_door_coins"),
        OnboardingPage(symbol: "chart.line.uptrend.xyaxis", title: "Build Your Credit", subtitle: "Track your score, get personalized tips, and watch your financial health grow.", tint: Theme.secondary, image: "financial_growth_vault"),
        OnboardingPage(symbol: "person.2.fill", title: "Peer-to-Peer Lending", subtitle: "Invest in vetted loans and earn returns, or fund your goals directly.", tint: Color(hex: 0xBF5AF2), image: "ai_brain_finance_nodes"),
    ]

    var body: some View {
        ZStack {
            Theme.heroGradient.ignoresSafeArea()

            VStack(spacing: 0) {
                TabView(selection: $page) {
                    ForEach(Array(pages.enumerated()), id: \.offset) { index, p in
                        OnboardingPageView(page: p).tag(index)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))

                HStack(spacing: 8) {
                    ForEach(0..<pages.count, id: \.self) { i in
                        Capsule()
                            .fill(i == page ? Theme.primary : Theme.surfaceTertiary)
                            .frame(width: i == page ? 24 : 8, height: 8)
                            .animation(.spring(response: 0.3), value: page)
                    }
                }
                .padding(.bottom, 28)

                Button {
                    if page < pages.count - 1 {
                        withAnimation { page += 1 }
                    } else {
                        appStore.completeOnboarding()
                    }
                } label: {
                    Text(page < pages.count - 1 ? "Continue" : "Get Started")
                        .font(.headline)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 17)
                        .background(Theme.primaryGradient, in: .rect(cornerRadius: 16))
                        .shadow(color: Theme.primary.opacity(0.4), radius: 12, y: 6)
                }
                .padding(.horizontal, 24)

                Button("Skip") { appStore.completeOnboarding() }
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(Theme.textSecondary)
                    .padding(.top, 16)
                    .padding(.bottom, 12)
            }
        }
    }
}

private struct OnboardingPage {
    let symbol: String
    let title: String
    let subtitle: String
    let tint: Color
    let image: String
}

private struct OnboardingPageView: View {
    let page: OnboardingPage

    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            ZStack {
                Circle()
                    .fill(page.tint.opacity(0.15))
                    .frame(width: 180, height: 180)
                Image(page.image)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 140, height: 140)
                    .clipShape(.circle)
                    .overlay(Circle().stroke(page.tint.opacity(0.3), lineWidth: 2))
            }
            VStack(spacing: 14) {
                Text(page.title)
                    .font(.system(size: 30, weight: .bold, design: .rounded))
                    .foregroundStyle(Theme.text)
                    .multilineTextAlignment(.center)
                Text(page.subtitle)
                    .font(.body)
                    .foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 36)
                    .lineSpacing(3)
            }
            Spacer()
            Spacer()
        }
    }
}

#Preview {
    OnboardingView().environment(AppStore())
}
