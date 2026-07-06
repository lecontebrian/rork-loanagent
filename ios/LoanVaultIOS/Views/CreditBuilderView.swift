//
//  CreditBuilderView.swift
//  LoanVaultIOS
//

import SwiftUI

struct CreditBuilderView: View {
    @Environment(AppStore.self) private var appStore

    private let actions: [(String, String, String, Color)] = [
        ("Lower Credit Utilization", "Keep balances under 30% of your limit", "creditcard.fill", Theme.primary),
        ("On-Time Payments", "Set autopay to never miss a due date", "calendar.badge.checkmark", Theme.secondary),
        ("Become an Authorized User", "Piggyback on a trusted account's history", "person.badge.plus", Color(hex: 0xBF5AF2)),
        ("Dispute Errors", "Challenge inaccurate items on your report", "exclamationmark.bubble.fill", Theme.warning),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                scoreRing
                Color.clear
                    .frame(height: 130)
                    .overlay {
                        Image("credit_score_gauge")
                            .resizable()
                            .scaledToFill()
                            .allowsHitTesting(false)
                    }
                    .clipShape(.rect(cornerRadius: 20))
                SectionHeader(title: "Score Factors").frame(maxWidth: .infinity, alignment: .leading)
                if let f = appStore.creditInfo?.factors {
                    Card {
                        VStack(spacing: 14) {
                            factorRow("Payment History", f.paymentHistory, Theme.success)
                            factorRow("Credit Utilization", f.creditUtilization, f.creditUtilization > 50 ? Theme.warning : Theme.success)
                            factorRow("Credit Age", f.creditAge, Theme.info)
                            factorRow("Credit Mix", f.creditMix, Theme.secondary)
                            factorRow("New Credit", f.newCredit, Theme.primary)
                        }
                    }
                }
                SectionHeader(title: "Recommended Actions").frame(maxWidth: .infinity, alignment: .leading)
                VStack(spacing: 12) {
                    ForEach(actions, id: \.0) { action in
                        Card(padding: 16) {
                            HStack(spacing: 14) {
                                IconChip(symbol: action.2, tint: action.3)
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(action.0).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                                    Text(action.1).font(.caption).foregroundStyle(Theme.textSecondary)
                                }
                                Spacer()
                                Image(systemName: "chevron.right").font(.caption).foregroundStyle(Theme.textTertiary)
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Credit Builder")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var scoreRing: some View {
        Card {
            VStack(spacing: 16) {
                ZStack {
                    Circle().stroke(Theme.surfaceTertiary, lineWidth: 14).frame(width: 170, height: 170)
                    Circle()
                        .trim(from: 0, to: scoreProgress)
                        .stroke(appStore.creditScoreColor, style: StrokeStyle(lineWidth: 14, lineCap: .round))
                        .frame(width: 170, height: 170)
                        .rotationEffect(.degrees(-90))
                    VStack(spacing: 4) {
                        Text("\(appStore.creditInfo?.score ?? 0)").font(.system(size: 48, weight: .bold)).foregroundStyle(Theme.text)
                        Text(appStore.creditInfo?.rating ?? "N/A").font(.caption.weight(.bold)).foregroundStyle(appStore.creditScoreColor)
                    }
                }
                HStack(spacing: 5) {
                    Image(systemName: appStore.creditTrend >= 0 ? "arrow.up.right" : "arrow.down.right").font(.caption2.weight(.bold))
                    Text("\(appStore.creditTrend >= 0 ? "+" : "")\(appStore.creditTrend) pts in 6 months")
                        .font(.caption.weight(.semibold))
                }
                .foregroundStyle(appStore.creditTrend >= 0 ? Theme.success : Theme.error)
                .padding(.horizontal, 12).padding(.vertical, 6)
                .background((appStore.creditTrend >= 0 ? Theme.success : Theme.error).opacity(0.14), in: .capsule)
            }
            .frame(maxWidth: .infinity)
            .padding(.top, 6)
        }
    }

    private var scoreProgress: CGFloat {
        let score = Double(appStore.creditInfo?.score ?? 300)
        return CGFloat(min(1, max(0, (score - 300) / 550)))
    }

    private func factorRow(_ label: String, _ value: Int, _ tint: Color) -> some View {
        VStack(alignment: .leading, spacing: 7) {
            HStack {
                Text(label).font(.subheadline).foregroundStyle(Theme.text)
                Spacer()
                Text("\(value)%").font(.subheadline.weight(.bold)).foregroundStyle(tint)
            }
            ProgressBar(value: Double(value) / 100, tint: tint, height: 7)
        }
    }
}

#Preview {
    NavigationStack { CreditBuilderView() }
        .environment(AppStore())
        .preferredColorScheme(.dark)
}
