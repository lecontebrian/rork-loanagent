//
//  AppStore.swift
//  LoanVaultIOS
//
//  Global app state mirroring the Expo AppContext.
//

import SwiftUI
import Observation

@Observable
final class AppStore {
    var userProfile: UserProfile?
    var creditInfo: CreditInfo?
    var applications: [LoanApplication] = []
    var activeLoans: [ActiveLoan] = []
    var isOnboarded: Bool = false

    var subscriptionTier: SubscriptionTier = .basic
    var tokens: Int = 5
    var isPremium: Bool = false
    var hasConnectedBank: Bool = false
    var notificationsEnabled: Bool = true

    init() {
        // Seed with demo data matching the Expo app's defaults.
        activeLoans = MockData.sampleActiveLoans()
        creditInfo = MockData.sampleCreditInfo()
        userProfile = UserProfile(firstName: "Jordan", lastName: "Carter", email: "jordan@example.com", annualIncome: 86000)
    }

    var creditScoreColor: Color {
        guard let score = creditInfo?.score else { return Theme.textSecondary }
        switch score {
        case 800...: return Theme.creditExcellent
        case 740..<800: return Theme.creditVeryGood
        case 670..<740: return Theme.creditGood
        case 580..<670: return Theme.creditFair
        default: return Theme.creditPoor
        }
    }

    var borrowingPower: Int {
        guard let profile = userProfile, let credit = creditInfo else { return 0 }
        let multiplier = credit.score >= 750 ? 5 : credit.score >= 700 ? 4 : credit.score >= 650 ? 3 : 2
        return (profile.annualIncome * multiplier / 1000) * 1000
    }

    var refinanceSavings: Int {
        let loans = activeLoans
        guard !loans.isEmpty else { return 0 }
        let avg = loans.reduce(0) { $0 + $1.monthlyPayment } / Double(loans.count)
        return Int(avg * 0.15)
    }

    var creditTrend: Int {
        guard let score = creditInfo?.score else { return 0 }
        return score - 680
    }

    var creditTips: [String] {
        guard let f = creditInfo?.factors else { return [] }
        var tips: [String] = []
        if f.creditUtilization > 50 { tips.append("Lower your credit utilization below 30%") }
        if f.paymentHistory < 90 { tips.append("Make all payments on time to improve history") }
        if f.creditAge < 70 { tips.append("Keep older accounts open to increase credit age") }
        if tips.isEmpty { tips.append("Keep up the great work — your credit is healthy") }
        return Array(tips.prefix(3))
    }

    func completeOnboarding() {
        withAnimation(.easeInOut) { isOnboarded = true }
    }

    func applyForLoan(_ offer: LoanOffer) {
        let app = LoanApplication(
            id: "app-\(UUID().uuidString.prefix(8))",
            loanType: offer.loanType,
            lender: offer.lender,
            amount: offer.amount,
            status: .submitted,
            submittedDate: Date(),
            interestRate: offer.interestRate,
            termMonths: offer.termMonths,
            monthlyPayment: offer.monthlyPayment
        )
        applications.insert(app, at: 0)
    }

    func upgradeTier(_ tier: SubscriptionTier) {
        subscriptionTier = tier
        isPremium = tier != .basic
        tokens = tier.tokens
    }

    @discardableResult
    func consumeToken() -> Bool {
        guard tokens > 0 else { return false }
        tokens -= 1
        return true
    }

    func connectBank() { hasConnectedBank = true }
}
