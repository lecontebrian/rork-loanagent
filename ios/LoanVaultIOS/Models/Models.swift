//
//  Models.swift
//  LoanVaultIOS
//
//  Core data models mirroring the Expo app's TypeScript types.
//

import Foundation

enum LoanType: String, CaseIterable, Identifiable, Codable {
    case auto, home, personal, business, education, debt
    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .auto: return "Auto Loan"
        case .home: return "Home Loan"
        case .personal: return "Personal Loan"
        case .business: return "Business Loan"
        case .education: return "Education Loan"
        case .debt: return "Debt Consolidation"
        }
    }

    var sfSymbol: String {
        switch self {
        case .auto: return "car.fill"
        case .home: return "house.fill"
        case .personal: return "wallet.bifold.fill"
        case .business: return "briefcase.fill"
        case .education: return "graduationcap.fill"
        case .debt: return "arrow.triangle.2.circlepath"
        }
    }
}

struct LoanCategory: Identifiable, Hashable {
    let id: LoanType
    let name: String
    let description: String
    let minAmount: Int
    let maxAmount: Int
}

struct Lender: Identifiable, Hashable {
    let id: String
    let name: String
    let rating: Double
    let reviewCount: Int
    let trustScore: Int
}

struct LoanOffer: Identifiable, Hashable {
    let id: String
    let lender: Lender
    let loanType: LoanType
    let interestRate: Double
    let termMonths: Int
    let monthlyPayment: Double
    let totalPayment: Double
    let amount: Double
    let approvalLikelihood: Int
    let features: [String]
    let processingTime: String
}

enum CreditRating: String {
    case excellent, veryGood = "very good", good, fair, poor
}

struct CreditFactors: Hashable {
    var paymentHistory: Int
    var creditUtilization: Int
    var creditAge: Int
    var creditMix: Int
    var newCredit: Int
}

struct CreditInfo: Hashable {
    var score: Int
    var factors: CreditFactors
    var lastUpdated: Date

    var rating: String {
        switch score {
        case 800...: return "EXCELLENT"
        case 740..<800: return "VERY GOOD"
        case 670..<740: return "GOOD"
        case 580..<670: return "FAIR"
        default: return "VERY POOR"
        }
    }
}

struct UserProfile {
    var firstName: String
    var lastName: String
    var email: String
    var annualIncome: Int
}

enum ApplicationStatus: String {
    case submitted, processing, approved, funded, rejected
}

struct LoanApplication: Identifiable {
    let id: String
    let loanType: LoanType
    let lender: Lender
    let amount: Double
    var status: ApplicationStatus
    let submittedDate: Date
    let interestRate: Double
    let termMonths: Int
    let monthlyPayment: Double
}

struct ActiveLoan: Identifiable {
    let id: String
    let loanType: LoanType
    let lender: Lender
    let originalAmount: Double
    let currentBalance: Double
    let interestRate: Double
    let monthlyPayment: Double
    let nextPaymentDate: Date
    let paymentsRemaining: Int
    let totalPayments: Int
}

// MARK: - Budget

struct BudgetCategory: Identifiable {
    let id: String
    let name: String
    let sfSymbol: String
    var budgeted: Double
    var spent: Double
    let colorHex: UInt32
}

struct Transaction: Identifiable {
    let id: String
    let date: Date
    let description: String
    let amount: Double
    let category: String
    let isIncome: Bool
}

// MARK: - P2P

enum P2PRiskLevel: String {
    case low, medium, high
    var displayName: String { rawValue.capitalized }
}

struct P2PLoanRequest: Identifiable {
    let id: String
    let borrowerName: String
    let amount: Double
    let termMonths: Int
    let purpose: String
    let description: String
    let interestRate: Double
    var fundingProgress: Double
    let fundingGoal: Double
    let riskLevel: P2PRiskLevel
    var status: String
    let remainingTime: String
    let creditScore: Int
    let verified: Bool
}

enum P2PTxType: String {
    case sent, received, pending, investment
}

struct P2PTransaction: Identifiable {
    let id: String
    let type: P2PTxType
    let counterparty: String
    let amount: Double
    let note: String?
    let date: Date
    let status: String
}

// MARK: - Subscription

enum SubscriptionTier: String, CaseIterable {
    case basic, plus, pro

    var displayName: String {
        switch self {
        case .basic: return "Basic"
        case .plus: return "Plus"
        case .pro: return "Pro"
        }
    }

    var monthlyPrice: String {
        switch self {
        case .basic: return "Free"
        case .plus: return "$9.99"
        case .pro: return "$24.99"
        }
    }

    var tokens: Int {
        switch self {
        case .basic: return 5
        case .plus: return 20
        case .pro: return 80
        }
    }

    var features: [String] {
        switch self {
        case .basic:
            return ["5 AI tokens / month", "Loan marketplace access", "Basic credit insights", "Budget tracker"]
        case .plus:
            return ["20 AI tokens / month", "Advanced loan offers", "Full credit health suite", "Priority support", "Document vault"]
        case .pro:
            return ["80 AI tokens / month", "Unlimited loan comparisons", "AI financial coach 24/7", "Credit dispute filing", "Local lender matching", "Premium support"]
        }
    }
}
