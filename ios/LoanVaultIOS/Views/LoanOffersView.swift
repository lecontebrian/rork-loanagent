//
//  LoanOffersView.swift
//  LoanVaultIOS
//

import SwiftUI

struct LoanOffersView: View {
    @Environment(AppStore.self) private var appStore
    let category: LoanCategory

    @State private var amount: Double
    @State private var offers: [LoanOffer] = []

    init(category: LoanCategory) {
        self.category = category
        let mid = Double((category.minAmount + category.maxAmount) / 2)
        _amount = State(initialValue: min(Double(category.maxAmount), max(Double(category.minAmount), (mid / 1000).rounded() * 1000)))
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                amountCard
                if offers.isEmpty {
                    ProgressView().tint(Theme.primary).padding(.top, 40)
                } else {
                    SectionHeader(title: "\(offers.count) Offers Found")
                        .frame(maxWidth: .infinity, alignment: .leading)
                    ForEach(offers) { offer in
                        NavigationLink(value: offer) {
                            LoanOfferRow(offer: offer)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle(category.name)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear(perform: refresh)
    }

    private var amountCard: some View {
        Card {
            VStack(alignment: .leading, spacing: 14) {
                Text("Loan Amount").font(.subheadline).foregroundStyle(Theme.textSecondary)
                Text(amount.asCurrency).font(.system(size: 34, weight: .bold)).foregroundStyle(Theme.text)
                Slider(value: $amount, in: Double(category.minAmount)...Double(category.maxAmount), step: 1000) { editing in
                    if !editing { refresh() }
                }
                .tint(Theme.primary)
                HStack {
                    Text(Double(category.minAmount).compact).font(.caption).foregroundStyle(Theme.textSecondary)
                    Spacer()
                    Text(Double(category.maxAmount).compact).font(.caption).foregroundStyle(Theme.textSecondary)
                }
            }
        }
    }

    private func refresh() {
        let score = appStore.creditInfo?.score ?? 700
        offers = MockData.generateLoanOffers(loanType: category.id, amount: amount, creditScore: score)
    }
}

struct LoanOfferRow: View {
    let offer: LoanOffer

    var body: some View {
        Card {
            VStack(spacing: 14) {
                HStack(spacing: 12) {
                    LenderAvatar(name: offer.lender.name)
                    VStack(alignment: .leading, spacing: 3) {
                        Text(offer.lender.name).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
                        HStack(spacing: 4) {
                            Image(systemName: "star.fill").font(.system(size: 9)).foregroundStyle(Theme.accent)
                            Text(String(format: "%.1f", offer.lender.rating)).font(.caption2).foregroundStyle(Theme.textSecondary)
                            Text("· \(offer.processingTime)").font(.caption2).foregroundStyle(Theme.textSecondary)
                        }
                    }
                    Spacer()
                    Text("\(offer.approvalLikelihood)%")
                        .font(.caption.weight(.bold)).foregroundStyle(Theme.primary)
                        .padding(.horizontal, 9).padding(.vertical, 5)
                        .background(Theme.primary.opacity(0.14), in: .capsule)
                }
                Divider().overlay(Theme.border)
                HStack {
                    stat("APR", "\(String(format: "%.2f", offer.interestRate))%", Theme.primary)
                    Spacer()
                    stat("Monthly", offer.monthlyPayment.asMoney, Theme.text)
                    Spacer()
                    stat("Term", "\(offer.termMonths) mo", Theme.text)
                }
            }
        }
    }

    private func stat(_ label: String, _ value: String, _ color: Color) -> some View {
        VStack(spacing: 3) {
            Text(label).font(.caption2).foregroundStyle(Theme.textSecondary)
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(color)
        }
    }
}

struct LoanOfferDetailView: View {
    @Environment(AppStore.self) private var appStore
    @Environment(\.dismiss) private var dismiss
    let offer: LoanOffer
    @State private var applied = false

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                Card {
                    VStack(spacing: 14) {
                        LenderAvatar(name: offer.lender.name, size: 64)
                        Text(offer.lender.name).font(.title3.weight(.bold)).foregroundStyle(Theme.text)
                        HStack(spacing: 5) {
                            Image(systemName: "star.fill").font(.caption2).foregroundStyle(Theme.accent)
                            Text("\(String(format: "%.1f", offer.lender.rating)) · \(offer.lender.reviewCount.formatted()) reviews")
                                .font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        HStack(spacing: 5) {
                            Image(systemName: "checkmark.shield.fill").font(.caption2).foregroundStyle(Theme.primary)
                            Text("Trust Score \(offer.lender.trustScore)/100").font(.caption.weight(.semibold)).foregroundStyle(Theme.primary)
                        }
                    }
                    .frame(maxWidth: .infinity)
                }

                Card {
                    VStack(spacing: 16) {
                        detailRow("Loan Amount", offer.amount.asCurrency)
                        Divider().overlay(Theme.border)
                        detailRow("Interest Rate (APR)", "\(String(format: "%.2f", offer.interestRate))%", highlight: true)
                        Divider().overlay(Theme.border)
                        detailRow("Monthly Payment", offer.monthlyPayment.asCurrencyPrecise)
                        Divider().overlay(Theme.border)
                        detailRow("Term", "\(offer.termMonths) months")
                        Divider().overlay(Theme.border)
                        detailRow("Total Repayment", offer.totalPayment.asCurrency)
                        Divider().overlay(Theme.border)
                        detailRow("Approval Likelihood", "\(offer.approvalLikelihood)%")
                    }
                }

                Card {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Features").font(.headline).foregroundStyle(Theme.text)
                        ForEach(offer.features, id: \.self) { feature in
                            HStack(spacing: 10) {
                                Image(systemName: "checkmark.circle.fill").font(.subheadline).foregroundStyle(Theme.primary)
                                Text(feature).font(.subheadline).foregroundStyle(Theme.textSecondary)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                PrimaryButton(title: applied ? "Application Submitted" : "Apply Now",
                              systemImage: applied ? "checkmark" : "arrow.right") {
                    guard !applied else { return }
                    appStore.applyForLoan(offer)
                    withAnimation { applied = true }
                }
                .disabled(applied)
                .opacity(applied ? 0.7 : 1)
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Offer Details")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func detailRow(_ label: String, _ value: String, highlight: Bool = false) -> some View {
        HStack {
            Text(label).font(.subheadline).foregroundStyle(Theme.textSecondary)
            Spacer()
            Text(value).font(.subheadline.weight(.bold)).foregroundStyle(highlight ? Theme.primary : Theme.text)
        }
    }
}

#Preview {
    NavigationStack { LoanOffersView(category: MockData.loanCategories[2]) }
        .environment(AppStore())
        .preferredColorScheme(.dark)
}
