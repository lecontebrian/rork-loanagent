//
//  P2PMarketplaceView.swift
//  LoanVaultIOS
//

import SwiftUI

struct P2PMarketplaceView: View {
    @Environment(P2PStore.self) private var p2p
    @State private var filter: P2PRiskLevel? = nil

    private var filtered: [P2PLoanRequest] {
        guard let filter else { return p2p.loanRequests }
        return p2p.loanRequests.filter { $0.riskLevel == filter }
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                statsHeader
                NavigationLink(value: P2PRoute.wallet) {
                    walletCTA
                }
                .buttonStyle(.plain)

                filterRow

                SectionHeader(title: "Investment Opportunities")
                    .frame(maxWidth: .infinity, alignment: .leading)

                ForEach(filtered) { loan in
                    NavigationLink(value: loan) {
                        P2PLoanCard(loan: loan)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("P2P Lending")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: P2PRoute.self) { route in
            switch route {
            case .wallet: P2PWalletView()
            }
        }
        .navigationDestination(for: P2PLoanRequest.self) { P2PLoanDetailView(loan: $0) }
    }

    private var statsHeader: some View {
        HStack(spacing: 12) {
            statCard("Invested", p2p.totalInvested.asCurrency, "chart.pie.fill", Theme.primary)
            statCard("Avg. Return", "9.8%", "arrow.up.right", Theme.secondary)
        }
        .padding(.top, 6)
    }

    private func statCard(_ label: String, _ value: String, _ symbol: String, _ tint: Color) -> some View {
        Card(padding: 16) {
            VStack(alignment: .leading, spacing: 10) {
                IconChip(symbol: symbol, tint: tint, size: 38, iconSize: 17)
                Text(label).font(.caption).foregroundStyle(Theme.textSecondary)
                Text(value).font(.system(size: 22, weight: .bold)).foregroundStyle(Theme.text)
            }
        }
    }

    private var walletCTA: some View {
        HStack(spacing: 14) {
            IconChip(symbol: "wallet.bifold.fill", tint: Theme.primary, size: 48, iconSize: 22)
            VStack(alignment: .leading, spacing: 2) {
                Text("Your Wallet").font(.subheadline).foregroundStyle(Theme.textSecondary)
                Text(P2PStoreBalanceText.text).font(.title3.weight(.bold)).foregroundStyle(Theme.text)
            }
            Spacer()
            Image(systemName: "chevron.right").foregroundStyle(Theme.textTertiary)
        }
        .padding(18)
        .background(Theme.surface, in: .rect(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Theme.border, lineWidth: 1))
    }

    private var filterRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                FilterChip(title: "All", selected: filter == nil) { filter = nil }
                FilterChip(title: "Low Risk", selected: filter == .low) { filter = .low }
                FilterChip(title: "Medium", selected: filter == .medium) { filter = .medium }
                FilterChip(title: "High", selected: filter == .high) { filter = .high }
            }
        }
        .scrollClipDisabled()
    }
}

enum P2PRoute: Hashable { case wallet }

/// Helper to read balance without capturing the store directly inside CTA.
private enum P2PStoreBalanceText {
    static var text: String { "View balance & transfers" }
}

struct FilterChip: View {
    let title: String
    let selected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(selected ? .white : Theme.textSecondary)
                .padding(.horizontal, 16).padding(.vertical, 9)
                .background(selected ? Theme.primary : Theme.surface, in: .capsule)
                .overlay(Capsule().stroke(selected ? .clear : Theme.border, lineWidth: 1))
        }
    }
}

struct P2PLoanCard: View {
    let loan: P2PLoanRequest

    private var riskColor: Color {
        switch loan.riskLevel {
        case .low: return Theme.success
        case .medium: return Theme.warning
        case .high: return Theme.error
        }
    }

    var body: some View {
        Card {
            VStack(spacing: 14) {
                HStack(spacing: 12) {
                    LenderAvatar(name: loan.borrowerName)
                    VStack(alignment: .leading, spacing: 3) {
                        HStack(spacing: 5) {
                            Text(loan.borrowerName).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
                            if loan.verified {
                                Image(systemName: "checkmark.seal.fill").font(.caption2).foregroundStyle(Theme.secondary)
                            }
                        }
                        Text(loan.purpose).font(.caption).foregroundStyle(Theme.textSecondary)
                    }
                    Spacer()
                    Text(loan.riskLevel.displayName)
                        .font(.caption2.weight(.bold)).foregroundStyle(riskColor)
                        .padding(.horizontal, 9).padding(.vertical, 5)
                        .background(riskColor.opacity(0.14), in: .capsule)
                }

                HStack {
                    stat("Amount", loan.amount.asCurrency)
                    Spacer()
                    stat("Rate", "\(String(format: "%.1f", loan.interestRate))%", Theme.primary)
                    Spacer()
                    stat("Term", "\(loan.termMonths) mo")
                }

                VStack(spacing: 6) {
                    ProgressBar(value: loan.fundingProgress / loan.fundingGoal, tint: Theme.primary, height: 7)
                    HStack {
                        Text("\(Int(loan.fundingProgress / loan.fundingGoal * 100))% funded")
                            .font(.caption2).foregroundStyle(Theme.textSecondary)
                        Spacer()
                        Text(loan.remainingTime).font(.caption2).foregroundStyle(Theme.textSecondary)
                    }
                }
            }
        }
    }

    private func stat(_ label: String, _ value: String, _ color: Color = Theme.text) -> some View {
        VStack(spacing: 3) {
            Text(label).font(.caption2).foregroundStyle(Theme.textSecondary)
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(color)
        }
    }
}

struct P2PLoanDetailView: View {
    @Environment(P2PStore.self) private var p2p
    @Environment(\.dismiss) private var dismiss
    let loan: P2PLoanRequest

    @State private var investAmount: String = "500"
    @State private var showResult = false
    @State private var resultMessage = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                Card {
                    VStack(spacing: 14) {
                        HStack(spacing: 12) {
                            LenderAvatar(name: loan.borrowerName, size: 56)
                            VStack(alignment: .leading, spacing: 3) {
                                HStack(spacing: 5) {
                                    Text(loan.borrowerName).font(.headline).foregroundStyle(Theme.text)
                                    if loan.verified {
                                        Image(systemName: "checkmark.seal.fill").font(.caption).foregroundStyle(Theme.secondary)
                                    }
                                }
                                Text("Credit Score \(loan.creditScore)").font(.caption).foregroundStyle(Theme.textSecondary)
                            }
                            Spacer()
                        }
                        Text(loan.description).font(.subheadline).foregroundStyle(Theme.textSecondary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }

                Card {
                    HStack {
                        stat("Amount", loan.amount.asCurrency)
                        Spacer()
                        stat("Rate", "\(String(format: "%.1f", loan.interestRate))%", Theme.primary)
                        Spacer()
                        stat("Term", "\(loan.termMonths) mo")
                    }
                }

                Card {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Invest in this loan").font(.headline).foregroundStyle(Theme.text)
                        HStack {
                            Text("$").font(.title2.weight(.bold)).foregroundStyle(Theme.textSecondary)
                            TextField("0", text: $investAmount)
                                .keyboardType(.numberPad)
                                .font(.title2.weight(.bold))
                                .foregroundStyle(Theme.text)
                        }
                        .padding(14)
                        .background(Theme.surfaceLight, in: .rect(cornerRadius: 12))
                        Text("Available balance: \(p2p.balance.asCurrency)")
                            .font(.caption).foregroundStyle(Theme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                PrimaryButton(title: "Invest Now", systemImage: "arrow.right") {
                    let amount = Double(investAmount) ?? 0
                    if p2p.invest(in: loan.id, amount: amount) {
                        resultMessage = "You invested \(amount.asCurrency) in \(loan.borrowerName)'s loan."
                    } else {
                        resultMessage = "Investment failed. Check your balance and amount."
                    }
                    showResult = true
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Loan Details")
        .navigationBarTitleDisplayMode(.inline)
        .alert("P2P Investment", isPresented: $showResult) {
            Button("OK") { if resultMessage.hasPrefix("You invested") { dismiss() } }
        } message: { Text(resultMessage) }
    }

    private func stat(_ label: String, _ value: String, _ color: Color = Theme.text) -> some View {
        VStack(spacing: 3) {
            Text(label).font(.caption2).foregroundStyle(Theme.textSecondary)
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(color)
        }
    }
}

#Preview {
    NavigationStack { P2PMarketplaceView() }
        .environment(P2PStore())
        .preferredColorScheme(.dark)
}
