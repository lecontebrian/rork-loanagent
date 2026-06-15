//
//  MockData.swift
//  LoanVaultIOS
//
//  Static seed data and loan-offer generation mirroring the Expo mocks.
//

import Foundation

enum MockData {
    static let loanCategories: [LoanCategory] = [
        LoanCategory(id: .auto, name: "Auto Loan", description: "Finance your dream car with competitive rates", minAmount: 5000, maxAmount: 100000),
        LoanCategory(id: .home, name: "Home Loan", description: "Buy or refinance your home", minAmount: 50000, maxAmount: 1000000),
        LoanCategory(id: .personal, name: "Personal Loan", description: "For any personal expense", minAmount: 1000, maxAmount: 50000),
        LoanCategory(id: .business, name: "Business Loan", description: "Grow your business with capital", minAmount: 10000, maxAmount: 500000),
        LoanCategory(id: .education, name: "Education Loan", description: "Invest in your future", minAmount: 5000, maxAmount: 150000),
        LoanCategory(id: .debt, name: "Debt Consolidation", description: "Simplify and save on multiple debts", minAmount: 5000, maxAmount: 100000),
    ]

    static let lenders: [String: Lender] = [
        "chase": Lender(id: "chase", name: "Chase", rating: 4.6, reviewCount: 18234, trustScore: 97),
        "wellsFargo": Lender(id: "wells-fargo", name: "Wells Fargo", rating: 4.5, reviewCount: 12453, trustScore: 95),
        "bofa": Lender(id: "bofa", name: "Bank of America", rating: 4.4, reviewCount: 15432, trustScore: 96),
        "sofi": Lender(id: "sofi", name: "SoFi", rating: 4.8, reviewCount: 9876, trustScore: 93),
        "marcus": Lender(id: "marcus", name: "Marcus by Goldman Sachs", rating: 4.8, reviewCount: 10234, trustScore: 95),
        "discover": Lender(id: "discover", name: "Discover", rating: 4.6, reviewCount: 14321, trustScore: 95),
        "capitalOne": Lender(id: "capital-one", name: "Capital One", rating: 4.4, reviewCount: 16543, trustScore: 94),
        "ally": Lender(id: "ally", name: "Ally Bank", rating: 4.7, reviewCount: 12456, trustScore: 94),
        "upstart": Lender(id: "upstart", name: "Upstart", rating: 4.4, reviewCount: 5432, trustScore: 89),
        "lendingClub": Lender(id: "lending-club", name: "LendingClub", rating: 4.3, reviewCount: 7654, trustScore: 88),
        "rocket": Lender(id: "rocket", name: "Rocket Mortgage", rating: 4.7, reviewCount: 15678, trustScore: 96),
        "better": Lender(id: "better", name: "Better.com", rating: 4.5, reviewCount: 11234, trustScore: 91),
        "navyFederal": Lender(id: "navy-federal", name: "Navy Federal CU", rating: 4.9, reviewCount: 18765, trustScore: 98),
    ]

    private static let mortgageLenders = ["rocket", "better", "chase", "wellsFargo", "bofa", "navyFederal"]
    private static let autoLenders = ["chase", "wellsFargo", "bofa", "capitalOne", "ally", "discover"]
    private static let personalLenders = ["sofi", "marcus", "discover", "lendingClub", "upstart", "chase", "capitalOne"]

    /// Generate a sorted list of loan offers for a type/amount/credit score.
    static func generateLoanOffers(loanType: LoanType, amount: Double, creditScore: Int) -> [LoanOffer] {
        let baseRate: Double = creditScore > 750 ? 4.5 : creditScore > 700 ? 6.5 : creditScore > 650 ? 9.5 : 12.5
        let keys: [String]
        switch loanType {
        case .home: keys = mortgageLenders
        case .auto: keys = autoLenders
        default: keys = personalLenders
        }

        let selected = keys.compactMap { lenders[$0] }

        let offers: [LoanOffer] = selected.enumerated().map { index, lender in
            let rateVariation = Double.random(in: -1.5...1.5)
            var interestRate = max(3, baseRate + rateVariation)
            var termMonths = 36

            switch loanType {
            case .home:
                termMonths = 360
                interestRate = max(3, (creditScore > 750 ? 6.5 : creditScore > 700 ? 7.2 : creditScore > 650 ? 8.5 : 10.0) + rateVariation)
            case .auto:
                termMonths = 72
                interestRate = max(2.5, (creditScore > 750 ? 4.0 : creditScore > 700 ? 5.5 : creditScore > 650 ? 7.5 : 10.5) + rateVariation)
            default:
                termMonths = 36
            }

            let monthlyRate = interestRate / 100 / 12
            let pow1 = pow(1 + monthlyRate, Double(termMonths))
            let monthlyPayment = (amount * monthlyRate * pow1) / (pow1 - 1)
            let totalPayment = monthlyPayment * Double(termMonths)
            let approval = max(50.0, min(98.0, 85 + Double(creditScore - 700) / 10 - Double(index) * 5))

            let features: [String]
            switch loanType {
            case .home:
                features = ["No prepayment penalty", index % 2 == 0 ? "Low closing costs" : "Free home appraisal", "Rate lock guarantee"]
            case .auto:
                features = ["No prepayment penalty", "Fast approval (24-48 hours)", index % 2 == 0 ? "New & used cars" : "Refinance available"]
            default:
                features = ["No prepayment penalty", "Fast approval", index % 2 == 0 ? "Rate match guarantee" : "Flexible terms"]
            }

            let processing = loanType == .home
                ? (index == 0 ? "7-14 days" : index == 1 ? "14-21 days" : "21-30 days")
                : (index == 0 ? "1-2 days" : index == 1 ? "2-3 days" : "3-5 days")

            return LoanOffer(
                id: "\(lender.id)-\(loanType.rawValue)-\(index)",
                lender: lender,
                loanType: loanType,
                interestRate: (interestRate * 100).rounded() / 100,
                termMonths: termMonths,
                monthlyPayment: (monthlyPayment * 100).rounded() / 100,
                totalPayment: (totalPayment * 100).rounded() / 100,
                amount: amount,
                approvalLikelihood: Int(approval.rounded()),
                features: features,
                processingTime: processing
            )
        }
        return offers.sorted { $0.interestRate < $1.interestRate }
    }

    static func sampleActiveLoans() -> [ActiveLoan] {
        [
            ActiveLoan(id: "loan-1", loanType: .auto, lender: lenders["chase"]!, originalAmount: 25000, currentBalance: 18500, interestRate: 4.99, monthlyPayment: 467, nextPaymentDate: Date().addingTimeInterval(15 * 86400), paymentsRemaining: 42, totalPayments: 60),
            ActiveLoan(id: "loan-2", loanType: .personal, lender: lenders["sofi"]!, originalAmount: 10000, currentBalance: 6200, interestRate: 7.25, monthlyPayment: 312, nextPaymentDate: Date().addingTimeInterval(8 * 86400), paymentsRemaining: 21, totalPayments: 36),
        ]
    }

    static func sampleCreditInfo() -> CreditInfo {
        CreditInfo(score: 742, factors: CreditFactors(paymentHistory: 95, creditUtilization: 28, creditAge: 72, creditMix: 80, newCredit: 88), lastUpdated: Date())
    }

    static func budgetCategories() -> [BudgetCategory] {
        [
            BudgetCategory(id: "housing", name: "Housing", sfSymbol: "house.fill", budgeted: 1800, spent: 1750, colorHex: 0x1D9BF0),
            BudgetCategory(id: "food", name: "Food & Dining", sfSymbol: "fork.knife", budgeted: 600, spent: 542, colorHex: 0x19C534),
            BudgetCategory(id: "transport", name: "Transportation", sfSymbol: "car.fill", budgeted: 400, spent: 478, colorHex: 0xFFD400),
            BudgetCategory(id: "entertainment", name: "Entertainment", sfSymbol: "tv.fill", budgeted: 250, spent: 180, colorHex: 0xBF5AF2),
            BudgetCategory(id: "shopping", name: "Shopping", sfSymbol: "bag.fill", budgeted: 300, spent: 365, colorHex: 0xFF375F),
            BudgetCategory(id: "utilities", name: "Utilities", sfSymbol: "bolt.fill", budgeted: 200, spent: 195, colorHex: 0x32ADE6),
        ]
    }

    static func recentTransactions() -> [Transaction] {
        [
            Transaction(id: "t1", date: Date().addingTimeInterval(-1 * 86400), description: "Whole Foods Market", amount: 84.32, category: "Food & Dining", isIncome: false),
            Transaction(id: "t2", date: Date().addingTimeInterval(-2 * 86400), description: "Salary Deposit", amount: 4200, category: "Income", isIncome: true),
            Transaction(id: "t3", date: Date().addingTimeInterval(-3 * 86400), description: "Shell Gas Station", amount: 52.10, category: "Transportation", isIncome: false),
            Transaction(id: "t4", date: Date().addingTimeInterval(-4 * 86400), description: "Netflix", amount: 15.49, category: "Entertainment", isIncome: false),
            Transaction(id: "t5", date: Date().addingTimeInterval(-5 * 86400), description: "Amazon", amount: 128.99, category: "Shopping", isIncome: false),
        ]
    }

    static func p2pLoanRequests() -> [P2PLoanRequest] {
        [
            P2PLoanRequest(id: "p1", borrowerName: "Marcus J.", amount: 8000, termMonths: 24, purpose: "Debt Consolidation", description: "Consolidating high-interest credit cards into one payment.", interestRate: 8.5, fundingProgress: 5200, fundingGoal: 8000, riskLevel: .low, status: "funding", remainingTime: "4 days left", creditScore: 748, verified: true),
            P2PLoanRequest(id: "p2", borrowerName: "Sarah K.", amount: 15000, termMonths: 36, purpose: "Home Improvement", description: "Kitchen renovation to increase home value.", interestRate: 10.2, fundingProgress: 9800, fundingGoal: 15000, riskLevel: .medium, status: "funding", remainingTime: "6 days left", creditScore: 692, verified: true),
            P2PLoanRequest(id: "p3", borrowerName: "David R.", amount: 5000, termMonths: 12, purpose: "Small Business", description: "Inventory for my growing online store.", interestRate: 12.8, fundingProgress: 1500, fundingGoal: 5000, riskLevel: .high, status: "funding", remainingTime: "2 days left", creditScore: 638, verified: false),
            P2PLoanRequest(id: "p4", borrowerName: "Emily T.", amount: 12000, termMonths: 48, purpose: "Medical Expenses", description: "Covering an unexpected medical bill.", interestRate: 9.4, fundingProgress: 12000, fundingGoal: 12000, riskLevel: .low, status: "funded", remainingTime: "Fully funded", creditScore: 765, verified: true),
        ]
    }

    static func p2pTransactions() -> [P2PTransaction] {
        [
            P2PTransaction(id: "tx1", type: .received, counterparty: "Alex Morgan", amount: 250, note: "Dinner split", date: Date().addingTimeInterval(-3600), status: "completed"),
            P2PTransaction(id: "tx2", type: .sent, counterparty: "Jordan Lee", amount: 80, note: "Concert tickets", date: Date().addingTimeInterval(-2 * 86400), status: "completed"),
            P2PTransaction(id: "tx3", type: .investment, counterparty: "Marcus J. Loan", amount: 500, note: "P2P investment", date: Date().addingTimeInterval(-4 * 86400), status: "completed"),
            P2PTransaction(id: "tx4", type: .received, counterparty: "Taylor Smith", amount: 1200, note: "Rent share", date: Date().addingTimeInterval(-7 * 86400), status: "completed"),
        ]
    }
}
