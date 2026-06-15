//
//  DocumentVaultView.swift
//  LoanVaultIOS
//

import SwiftUI

struct DocumentVaultView: View {
    private let documents: [VaultDoc] = [
        .init(name: "Driver's License", type: "ID · PDF", symbol: "person.text.rectangle.fill", tint: Theme.secondary, size: "1.2 MB"),
        .init(name: "Pay Stub - March", type: "Income · PDF", symbol: "dollarsign.square.fill", tint: Theme.primary, size: "840 KB"),
        .init(name: "2024 Tax Return", type: "Tax · PDF", symbol: "doc.text.fill", tint: Theme.warning, size: "2.4 MB"),
        .init(name: "Auto Loan Agreement", type: "Loan · PDF", symbol: "car.fill", tint: Color(hex: 0xBF5AF2), size: "1.6 MB"),
        .init(name: "Bank Statement", type: "Income · PDF", symbol: "building.columns.fill", tint: Theme.accent, size: "920 KB"),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                Card {
                    HStack(spacing: 14) {
                        IconChip(symbol: "lock.shield.fill", tint: Theme.primary, size: 48, iconSize: 22)
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Bank-Level Encryption").font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
                            Text("Your documents are encrypted end-to-end.").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        Spacer()
                    }
                }

                SectionHeader(title: "Your Documents").frame(maxWidth: .infinity, alignment: .leading)
                VStack(spacing: 12) {
                    ForEach(documents) { doc in
                        Card(padding: 16) {
                            HStack(spacing: 14) {
                                IconChip(symbol: doc.symbol, tint: doc.tint)
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(doc.name).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                                    Text("\(doc.type) · \(doc.size)").font(.caption).foregroundStyle(Theme.textSecondary)
                                }
                                Spacer()
                                Image(systemName: "lock.fill").font(.caption).foregroundStyle(Theme.primary)
                            }
                        }
                    }
                }

                PrimaryButton(title: "Upload Document", systemImage: "plus") {}
            }
            .padding(.horizontal, 18)
            .padding(.top, 6)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Document Vault")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct VaultDoc: Identifiable {
    let id = UUID()
    let name: String
    let type: String
    let symbol: String
    let tint: Color
    let size: String
}

#Preview {
    NavigationStack { DocumentVaultView() }
        .preferredColorScheme(.dark)
}
