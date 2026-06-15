//
//  LoanSimulatorView.swift
//  LoanVaultIOS
//

import SwiftUI

struct LoanSimulatorView: View {
    @State private var amount: Double = 20000
    @State private var rate: Double = 7.5
    @State private var termMonths: Double = 36

    private var monthlyRate: Double { rate / 100 / 12 }
    private var monthlyPayment: Double {
        let p = pow(1 + monthlyRate, termMonths)
        guard monthlyRate > 0 else { return amount / termMonths }
        return (amount * monthlyRate * p) / (p - 1)
    }
    private var totalPayment: Double { monthlyPayment * termMonths }
    private var totalInterest: Double { totalPayment - amount }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                resultCard
                Card {
                    VStack(spacing: 22) {
                        sliderRow("Loan Amount", value: $amount, range: 1000...100000, step: 1000, display: amount.asCurrency)
                        sliderRow("Interest Rate (APR)", value: $rate, range: 2...25, step: 0.1, display: "\(String(format: "%.1f", rate))%")
                        sliderRow("Term", value: $termMonths, range: 12...84, step: 6, display: "\(Int(termMonths)) months")
                    }
                }
                Card {
                    VStack(spacing: 14) {
                        breakdownRow("Principal", amount.asCurrency, Theme.secondary)
                        Divider().overlay(Theme.border)
                        breakdownRow("Total Interest", totalInterest.asCurrency, Theme.warning)
                        Divider().overlay(Theme.border)
                        breakdownRow("Total Repayment", totalPayment.asCurrency, Theme.text)
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Loan Simulator")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var resultCard: some View {
        VStack(spacing: 6) {
            Text("Estimated Monthly Payment").font(.subheadline).foregroundStyle(.white.opacity(0.85))
            Text(monthlyPayment.asCurrencyPrecise).font(.system(size: 42, weight: .bold)).foregroundStyle(.white)
        }
        .padding(.vertical, 28)
        .frame(maxWidth: .infinity)
        .background(Theme.primaryGradient, in: .rect(cornerRadius: 24))
        .shadow(color: Theme.primary.opacity(0.35), radius: 16, y: 8)
        .padding(.top, 6)
    }

    private func sliderRow(_ label: String, value: Binding<Double>, range: ClosedRange<Double>, step: Double, display: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(label).font(.subheadline).foregroundStyle(Theme.textSecondary)
                Spacer()
                Text(display).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
            }
            Slider(value: value, in: range, step: step).tint(Theme.primary)
        }
    }

    private func breakdownRow(_ label: String, _ value: String, _ color: Color) -> some View {
        HStack {
            Text(label).font(.subheadline).foregroundStyle(Theme.textSecondary)
            Spacer()
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(color)
        }
    }
}

#Preview {
    NavigationStack { LoanSimulatorView() }
        .preferredColorScheme(.dark)
}
