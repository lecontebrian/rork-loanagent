//
//  DashboardView.swift
//  LoanVaultIOS
//

import SwiftUI

struct DashboardView: View {
    @Environment(AppStore.self) private var appStore
    @State private var suggestedOffers: [LoanOffer] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 22) {
                header

                if appStore.refinanceSavings > 0 {
                    refinanceBanner
                }

                metricsRow

                if !suggestedOffers.isEmpty {
                    offersSection
                }

                if let credit = appStore.creditInfo {
                    creditHealthSection(credit)
                }

                if !appStore.activeLoans.isEmpty {
                    activeLoansSection
                }

                if !appStore.applications.isEmpty {
                    inProgressSection
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                NavigationLink(value: DashRoute.notifications) {
                    Image(systemName: "bell")
                        .foregroundStyle(Theme.text)
                }
            }
        }
        .navigationDestination(for: DashRoute.self) { route in
            switch route {
            case .notifications: NotificationsView()
            case .premium: SubscriptionView()
            case .credit: CreditBuilderView()
            }
        }
        .navigationDestination(for: LoanOffer.self) { LoanOfferDetailView(offer: $0) }
        .onAppear {
            if suggestedOffers.isEmpty, let score = appStore.creditInfo?.score {
                suggestedOffers = Array(MockData.generateLoanOffers(loanType: .personal, amount: 15000, creditScore: score).prefix(4))
            }
        }
    }

    private var header: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Theme.primaryGradient)
                .frame(width: 46, height: 46)
                .overlay(Image(systemName: "building.columns.fill").font(.system(size: 20, weight: .bold)).foregroundStyle(.white))
            VStack(alignment: .leading, spacing: 2) {
                Text("Welcome back").font(.subheadline).foregroundStyle(Theme.textSecondary)
                Text(appStore.userProfile?.firstName ?? "User")
                    .font(.system(size: 22, weight: .bold)).foregroundStyle(Theme.text)
            }
            Spacer()
            NavigationLink(value: DashRoute.premium) {
                HStack(spacing: 5) {
                    Image(systemName: "crown.fill").font(.caption)
                    Text(appStore.subscriptionTier.displayName).font(.caption.weight(.bold))
                }
                .foregroundStyle(Theme.accent)
                .padding(.horizontal, 12).padding(.vertical, 7)
                .background(Theme.accent.opacity(0.14), in: .capsule)
            }
        }
        .padding(.top, 6)
    }

    private var refinanceBanner: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 5) {
                Image(systemName: "bolt.fill").font(.caption2.weight(.bold))
                Text("OPPORTUNITY").font(.caption2.weight(.bold)).tracking(1)
            }
            .foregroundStyle(.white.opacity(0.9))
            Text("You Could Save").font(.subheadline.weight(.medium)).foregroundStyle(.white.opacity(0.9))
            Text("\(appStore.refinanceSavings.asMoney)/month")
                .font(.system(size: 30, weight: .bold)).foregroundStyle(.white)
            Text("by refinancing your current loans").font(.footnote).foregroundStyle(.white.opacity(0.85))
            HStack {
                Text("Explore Refinance Options").font(.subheadline.weight(.semibold))
                Image(systemName: "arrow.right").font(.caption.weight(.bold))
            }
            .foregroundStyle(.white)
            .padding(.horizontal, 16).padding(.vertical, 11)
            .background(.white.opacity(0.18), in: .capsule)
            .padding(.top, 8)
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.oceanGradient, in: .rect(cornerRadius: 22))
    }

    private var metricsRow: some View {
        HStack(spacing: 12) {
            Card(padding: 16) {
                VStack(alignment: .leading, spacing: 10) {
                    IconChip(symbol: "dollarsign", tint: Theme.success, size: 38, iconSize: 17)
                    Text("Borrowing Power").font(.caption).foregroundStyle(Theme.textSecondary)
                    Text(Double(appStore.borrowingPower).asCurrency)
                        .font(.system(size: 22, weight: .bold)).foregroundStyle(Theme.text)
                        .minimumScaleFactor(0.7).lineLimit(1)
                    HStack(spacing: 5) {
                        Circle().fill(Theme.success).frame(width: 6, height: 6)
                        Text("Based on your profile").font(.caption2).foregroundStyle(Theme.textSecondary)
                    }
                }
            }

            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    IconChip(symbol: "waveform.path.ecg", tint: .white, size: 38, iconSize: 17)
                        .overlay(RoundedRectangle(cornerRadius: 12).fill(.white.opacity(0.2)).frame(width: 38, height: 38))
                        .overlay(Image(systemName: "waveform.path.ecg").font(.system(size: 17, weight: .semibold)).foregroundStyle(.white))
                    Spacer()
                    HStack(spacing: 3) {
                        Image(systemName: appStore.creditTrend >= 0 ? "arrow.up.right" : "arrow.down.right")
                            .font(.system(size: 9, weight: .black))
                        Text("\(appStore.creditTrend >= 0 ? "+" : "")\(appStore.creditTrend)")
                            .font(.caption2.weight(.bold))
                    }
                    .foregroundStyle(.white)
                    .padding(.horizontal, 8).padding(.vertical, 4)
                    .background(.white.opacity(0.22), in: .capsule)
                }
                Text("\(appStore.creditInfo?.score ?? 0)")
                    .font(.system(size: 30, weight: .bold)).foregroundStyle(.white)
                HStack(spacing: 5) {
                    Circle().fill(.white).frame(width: 6, height: 6)
                    Text(appStore.creditInfo?.rating ?? "N/A")
                        .font(.caption2.weight(.bold)).foregroundStyle(.white)
                }
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(appStore.creditScoreColor, in: .rect(cornerRadius: 20))
        }
    }

    private var offersSection: some View {
        VStack(spacing: 14) {
            SectionHeader(title: "Top Suggested Offers")
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(suggestedOffers) { offer in
                        NavigationLink(value: offer) {
                            OfferMiniCard(offer: offer)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .scrollClipDisabled()
        }
    }

    private func creditHealthSection(_ credit: CreditInfo) -> some View {
        VStack(spacing: 14) {
            SectionHeader(title: "Credit Health Snapshot")
            Card {
                VStack(spacing: 16) {
                    HStack(spacing: 12) {
                        CreditFactorPill(label: "Payment History", value: credit.factors.paymentHistory, tint: Theme.success)
                        CreditFactorPill(label: "Utilization", value: credit.factors.creditUtilization, tint: credit.factors.creditUtilization > 50 ? Theme.warning : Theme.success)
                    }
                    HStack(spacing: 12) {
                        CreditFactorPill(label: "Credit Age", value: credit.factors.creditAge, tint: Theme.info)
                        CreditFactorPill(label: "Credit Mix", value: credit.factors.creditMix, tint: Theme.secondary)
                    }
                    if !appStore.creditTips.isEmpty {
                        Divider().overlay(Theme.border)
                        VStack(alignment: .leading, spacing: 8) {
                            HStack(spacing: 6) {
                                Image(systemName: "info.circle.fill").font(.caption).foregroundStyle(Theme.primary)
                                Text("Ways to Improve").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                            }
                            ForEach(appStore.creditTips, id: \.self) { tip in
                                HStack(alignment: .top, spacing: 8) {
                                    Circle().fill(Theme.primary).frame(width: 5, height: 5).padding(.top, 6)
                                    Text(tip).font(.footnote).foregroundStyle(Theme.textSecondary)
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }
            }
        }
    }

    private var activeLoansSection: some View {
        VStack(spacing: 14) {
            SectionHeader(title: "Active Credit Accounts")
            VStack(spacing: 12) {
                ForEach(appStore.activeLoans) { loan in
                    ActiveLoanCard(loan: loan)
                }
            }
        }
    }

    private var inProgressSection: some View {
        VStack(spacing: 14) {
            SectionHeader(title: "In Progress")
            VStack(spacing: 12) {
                ForEach(appStore.applications) { app in
                    Card {
                        HStack(spacing: 12) {
                            LenderAvatar(name: app.lender.name)
                            VStack(alignment: .leading, spacing: 3) {
                                Text(app.lender.name).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                                Text(app.loanType.rawValue.uppercased()).font(.caption2.weight(.bold)).foregroundStyle(Theme.textSecondary)
                            }
                            Spacer()
                            Text(app.status.rawValue.capitalized)
                                .font(.caption.weight(.bold))
                                .foregroundStyle(Theme.warning)
                                .padding(.horizontal, 10).padding(.vertical, 5)
                                .background(Theme.warning.opacity(0.15), in: .capsule)
                        }
                    }
                }
            }
        }
    }
}

enum DashRoute: Hashable { case notifications, premium, credit }

private struct CreditFactorPill: View {
    let label: String
    let value: Int
    let tint: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(label).font(.caption).foregroundStyle(Theme.textSecondary)
                Spacer()
                Text("\(value)%").font(.caption.weight(.bold)).foregroundStyle(tint)
            }
            ProgressBar(value: Double(value) / 100, tint: tint, height: 6)
        }
        .padding(12)
        .background(Theme.surfaceLight, in: .rect(cornerRadius: 12))
    }
}

struct OfferMiniCard: View {
    let offer: LoanOffer

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                LenderAvatar(name: offer.lender.name, size: 40)
                Spacer()
                Text("\(offer.approvalLikelihood)% Match")
                    .font(.caption2.weight(.bold)).foregroundStyle(Theme.primary)
                    .padding(.horizontal, 8).padding(.vertical, 4)
                    .background(Theme.primary.opacity(0.14), in: .capsule)
            }
            Text(offer.lender.name).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text).padding(.top, 12)
            Text("\(offer.loanType.rawValue.uppercased()) LOAN").font(.caption2.weight(.semibold)).foregroundStyle(Theme.textSecondary)
            Divider().overlay(Theme.border).padding(.vertical, 12)
            HStack {
                miniStat("APR", "\(String(format: "%.2f", offer.interestRate))%")
                Spacer()
                miniStat("Monthly", offer.monthlyPayment.asMoney)
                Spacer()
                miniStat("Term", "\(offer.termMonths)mo")
            }
            Text("View Offer")
                .font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                .frame(maxWidth: .infinity).padding(.vertical, 11)
                .background(Theme.primary, in: .rect(cornerRadius: 12))
                .padding(.top, 14)
        }
        .padding(16)
        .frame(width: 250)
        .background(Theme.surface, in: .rect(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Theme.border, lineWidth: 1))
    }

    private func miniStat(_ label: String, _ value: String) -> some View {
        VStack(spacing: 3) {
            Text(label).font(.caption2).foregroundStyle(Theme.textSecondary)
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
        }
    }
}

struct ActiveLoanCard: View {
    let loan: ActiveLoan

    private var progress: Double {
        1 - (loan.currentBalance / loan.originalAmount)
    }

    var body: some View {
        Card {
            VStack(spacing: 14) {
                HStack(spacing: 12) {
                    IconChip(symbol: loan.loanType.sfSymbol, tint: Theme.primary)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(loan.lender.name).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                        Text(loan.loanType.displayName).font(.caption).foregroundStyle(Theme.textSecondary)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(loan.currentBalance.asMoney).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
                        Text("balance").font(.caption2).foregroundStyle(Theme.textSecondary)
                    }
                }
                ProgressBar(value: progress, tint: Theme.primary, height: 6)
                HStack {
                    Text("\(loan.monthlyPayment.asMoney)/mo").font(.caption).foregroundStyle(Theme.textSecondary)
                    Spacer()
                    Text("\(loan.paymentsRemaining) payments left").font(.caption).foregroundStyle(Theme.textSecondary)
                }
            }
        }
    }
}

extension Int {
    /// Whole-dollar currency string (e.g. $1,250).
    var asMoney: String { Double(self).asCurrency }
}

#Preview {
    NavigationStack { DashboardView() }
        .environment(AppStore())
        .environment(P2PStore())
        .preferredColorScheme(.dark)
}
