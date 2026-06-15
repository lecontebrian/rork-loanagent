//
//  P2PWalletView.swift
//  LoanVaultIOS
//

import SwiftUI

struct P2PWalletView: View {
    @Environment(P2PStore.self) private var p2p
    @State private var sheet: WalletSheet?

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                balanceCard
                actionsRow
                SectionHeader(title: "Recent Activity")
                    .frame(maxWidth: .infinity, alignment: .leading)
                VStack(spacing: 12) {
                    ForEach(p2p.transactions) { tx in
                        TransactionRow(tx: tx)
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Wallet")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $sheet) { which in
            WalletActionSheet(kind: which)
                .presentationDetents([.medium])
        }
    }

    private var balanceCard: some View {
        VStack(spacing: 8) {
            Text("Available Balance").font(.subheadline).foregroundStyle(.white.opacity(0.85))
            Text(p2p.balance.asCurrencyPrecise).font(.system(size: 40, weight: .bold)).foregroundStyle(.white)
            HStack(spacing: 24) {
                miniStat("Sent", p2p.totalSent.asCurrency)
                Rectangle().fill(.white.opacity(0.25)).frame(width: 1, height: 28)
                miniStat("Received", p2p.totalReceived.asCurrency)
            }
            .padding(.top, 8)
        }
        .padding(.vertical, 28)
        .frame(maxWidth: .infinity)
        .background(Theme.primaryGradient, in: .rect(cornerRadius: 24))
        .shadow(color: Theme.primary.opacity(0.35), radius: 18, y: 8)
        .padding(.top, 6)
    }

    private func miniStat(_ label: String, _ value: String) -> some View {
        VStack(spacing: 3) {
            Text(label).font(.caption).foregroundStyle(.white.opacity(0.8))
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(.white)
        }
    }

    private var actionsRow: some View {
        HStack(spacing: 12) {
            walletAction("Add", "plus", Theme.primary) { sheet = .add }
            walletAction("Send", "arrow.up", Theme.secondary) { sheet = .send }
            walletAction("Withdraw", "arrow.down", Theme.accent) { sheet = .withdraw }
        }
    }

    private func walletAction(_ title: String, _ symbol: String, _ tint: Color, _ action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 8) {
                IconChip(symbol: symbol, tint: tint, size: 50, iconSize: 20)
                Text(title).font(.caption.weight(.semibold)).foregroundStyle(Theme.text)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(Theme.surface, in: .rect(cornerRadius: 18))
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(Theme.border, lineWidth: 1))
        }
    }
}

enum WalletSheet: Identifiable {
    case add, send, withdraw
    var id: Int { hashValue }
}

struct TransactionRow: View {
    let tx: P2PTransaction

    private var symbol: String {
        switch tx.type {
        case .sent: return "arrow.up.right"
        case .received: return "arrow.down.left"
        case .investment: return "chart.line.uptrend.xyaxis"
        case .pending: return "clock"
        }
    }

    private var tint: Color {
        switch tx.type {
        case .received: return Theme.success
        case .sent: return Theme.error
        case .investment: return Theme.secondary
        case .pending: return Theme.warning
        }
    }

    private var amountText: String {
        let sign = tx.type == .received ? "+" : "-"
        return "\(sign)\(tx.amount.asCurrency)"
    }

    var body: some View {
        Card(padding: 14) {
            HStack(spacing: 12) {
                IconChip(symbol: symbol, tint: tint)
                VStack(alignment: .leading, spacing: 2) {
                    Text(tx.counterparty).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                    Text(tx.note ?? tx.type.rawValue.capitalized).font(.caption).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text(amountText).font(.subheadline.weight(.bold)).foregroundStyle(tint)
                    Text(tx.date, style: .relative).font(.caption2).foregroundStyle(Theme.textSecondary)
                }
            }
        }
    }
}

struct WalletActionSheet: View {
    @Environment(P2PStore.self) private var p2p
    @Environment(\.dismiss) private var dismiss
    let kind: WalletSheet

    @State private var amount = ""
    @State private var recipient = ""
    @State private var note = ""

    private var title: String {
        switch kind {
        case .add: return "Add Funds"
        case .send: return "Send Money"
        case .withdraw: return "Withdraw"
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    HStack {
                        Text("$").font(.system(size: 36, weight: .bold)).foregroundStyle(Theme.textSecondary)
                        TextField("0", text: $amount)
                            .keyboardType(.decimalPad)
                            .font(.system(size: 36, weight: .bold))
                            .foregroundStyle(Theme.text)
                    }
                    .padding(18)
                    .background(Theme.surfaceLight, in: .rect(cornerRadius: 16))

                    if kind == .send {
                        styledField("Recipient name or @handle", text: $recipient)
                        styledField("What's it for? (optional)", text: $note)
                    }

                    PrimaryButton(title: title) { perform() }
                    Spacer()
                }
                .padding(20)
            }
            .background(Theme.background)
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cancel") { dismiss() }.foregroundStyle(Theme.textSecondary)
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    private func styledField(_ placeholder: String, text: Binding<String>) -> some View {
        TextField("", text: text, prompt: Text(placeholder).foregroundStyle(Theme.textSecondary))
            .foregroundStyle(Theme.text)
            .padding(15)
            .background(Theme.surfaceLight, in: .rect(cornerRadius: 12))
    }

    private func perform() {
        let value = Double(amount) ?? 0
        switch kind {
        case .add: p2p.addFunds(value)
        case .send: _ = p2p.sendMoney(to: recipient.isEmpty ? "Recipient" : recipient, amount: value, note: note)
        case .withdraw: _ = p2p.withdraw(value)
        }
        dismiss()
    }
}

#Preview {
    NavigationStack { P2PWalletView() }
        .environment(P2PStore())
        .preferredColorScheme(.dark)
}
