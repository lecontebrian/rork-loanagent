//
//  BudgetTrackerView.swift
//  LoanVaultIOS
//

import SwiftUI

struct BudgetTrackerView: View {
    @State private var categories = MockData.budgetCategories()
    private let transactions = MockData.recentTransactions()

    private var totalBudgeted: Double { categories.reduce(0) { $0 + $1.budgeted } }
    private var totalSpent: Double { categories.reduce(0) { $0 + $1.spent } }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                summaryCard
                SectionHeader(title: "Categories").frame(maxWidth: .infinity, alignment: .leading)
                VStack(spacing: 12) {
                    ForEach(categories) { cat in
                        BudgetCategoryRow(category: cat)
                    }
                }
                SectionHeader(title: "Recent Transactions").frame(maxWidth: .infinity, alignment: .leading)
                VStack(spacing: 12) {
                    ForEach(transactions) { tx in
                        Card(padding: 14) {
                            HStack(spacing: 12) {
                                IconChip(symbol: tx.isIncome ? "arrow.down.left" : "cart.fill", tint: tx.isIncome ? Theme.success : Theme.secondary)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(tx.description).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                                    Text(tx.category).font(.caption).foregroundStyle(Theme.textSecondary)
                                }
                                Spacer()
                                Text("\(tx.isIncome ? "+" : "-")\(tx.amount.asCurrencyPrecise)")
                                    .font(.subheadline.weight(.bold))
                                    .foregroundStyle(tx.isIncome ? Theme.success : Theme.text)
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Budget")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var summaryCard: some View {
        Card {
            VStack(spacing: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 3) {
                        Text("Spent this month").font(.caption).foregroundStyle(Theme.textSecondary)
                        Text(totalSpent.asCurrency).font(.system(size: 30, weight: .bold)).foregroundStyle(Theme.text)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 3) {
                        Text("Budget").font(.caption).foregroundStyle(Theme.textSecondary)
                        Text(totalBudgeted.asCurrency).font(.headline).foregroundStyle(Theme.textSecondary)
                    }
                }
                ProgressBar(value: totalSpent / totalBudgeted, tint: totalSpent > totalBudgeted ? Theme.error : Theme.primary, height: 10)
                HStack {
                    Text("\(Int(totalSpent / totalBudgeted * 100))% used").font(.caption).foregroundStyle(Theme.textSecondary)
                    Spacer()
                    Text("\((totalBudgeted - totalSpent).asCurrency) left").font(.caption.weight(.semibold)).foregroundStyle(Theme.primary)
                }
            }
            .padding(.top, 4)
        }
    }
}

private struct BudgetCategoryRow: View {
    let category: BudgetCategory
    private var tint: Color { Color(hex: category.colorHex) }
    private var over: Bool { category.spent > category.budgeted }

    var body: some View {
        Card(padding: 16) {
            VStack(spacing: 10) {
                HStack(spacing: 12) {
                    IconChip(symbol: category.sfSymbol, tint: tint, size: 40, iconSize: 18)
                    Text(category.name).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text)
                    Spacer()
                    Text("\(category.spent.asCurrency) / \(category.budgeted.asCurrency)")
                        .font(.caption.weight(.semibold)).foregroundStyle(over ? Theme.error : Theme.textSecondary)
                }
                ProgressBar(value: category.spent / category.budgeted, tint: over ? Theme.error : tint, height: 6)
            }
        }
    }
}

#Preview {
    NavigationStack { BudgetTrackerView() }
        .preferredColorScheme(.dark)
}
