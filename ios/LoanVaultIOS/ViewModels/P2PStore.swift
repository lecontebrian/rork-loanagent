//
//  P2PStore.swift
//  LoanVaultIOS
//
//  P2P wallet & marketplace state mirroring the Expo P2PWalletContext.
//

import SwiftUI
import Observation

@Observable
final class P2PStore {
    var balance: Double = 2450.75
    var totalSent: Double = 1840
    var totalReceived: Double = 4290
    var totalInvested: Double = 3500
    var transactions: [P2PTransaction] = MockData.p2pTransactions()
    var loanRequests: [P2PLoanRequest] = MockData.p2pLoanRequests()
    var myInvestments: [P2PLoanRequest] = []

    func addFunds(_ amount: Double) {
        guard amount > 0 else { return }
        balance += amount
        transactions.insert(
            P2PTransaction(id: UUID().uuidString, type: .received, counterparty: "Bank Transfer", amount: amount, note: "Added funds", date: Date(), status: "completed"),
            at: 0
        )
    }

    func sendMoney(to: String, amount: Double, note: String) -> Bool {
        guard amount > 0, amount <= balance else { return false }
        balance -= amount
        totalSent += amount
        transactions.insert(
            P2PTransaction(id: UUID().uuidString, type: .sent, counterparty: to, amount: amount, note: note.isEmpty ? nil : note, date: Date(), status: "completed"),
            at: 0
        )
        return true
    }

    func withdraw(_ amount: Double) -> Bool {
        guard amount > 0, amount <= balance else { return false }
        balance -= amount
        transactions.insert(
            P2PTransaction(id: UUID().uuidString, type: .sent, counterparty: "Bank Withdrawal", amount: amount, note: "Withdrawal", date: Date(), status: "pending"),
            at: 0
        )
        return true
    }

    func invest(in loanId: String, amount: Double) -> Bool {
        guard amount > 0, amount <= balance,
              let index = loanRequests.firstIndex(where: { $0.id == loanId }) else { return false }
        balance -= amount
        totalInvested += amount
        loanRequests[index].fundingProgress = min(loanRequests[index].fundingGoal, loanRequests[index].fundingProgress + amount)
        if loanRequests[index].fundingProgress >= loanRequests[index].fundingGoal {
            loanRequests[index].status = "funded"
        }
        if !myInvestments.contains(where: { $0.id == loanId }) {
            myInvestments.append(loanRequests[index])
        }
        transactions.insert(
            P2PTransaction(id: UUID().uuidString, type: .investment, counterparty: loanRequests[index].borrowerName + " Loan", amount: amount, note: "P2P investment", date: Date(), status: "completed"),
            at: 0
        )
        return true
    }
}
