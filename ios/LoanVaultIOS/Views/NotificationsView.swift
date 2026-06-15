//
//  NotificationsView.swift
//  LoanVaultIOS
//

import SwiftUI

struct NotificationsView: View {
    private let items: [NotificationItem] = [
        .init(title: "Application Update", body: "Chase reviewed your auto loan — you're pre-approved!", symbol: "checkmark.circle.fill", tint: Theme.success, time: "2h ago", unread: true),
        .init(title: "Rate Drop Alert", body: "Personal loan rates dropped 0.4%. Refinance to save.", symbol: "arrow.down.right.circle.fill", tint: Theme.secondary, time: "5h ago", unread: true),
        .init(title: "Payment Reminder", body: "Your SoFi payment of $312 is due in 8 days.", symbol: "calendar.badge.clock", tint: Theme.warning, time: "1d ago", unread: false),
        .init(title: "P2P Investment", body: "Marcus J.'s loan is now 65% funded.", symbol: "person.2.fill", tint: Color(hex: 0xBF5AF2), time: "2d ago", unread: false),
        .init(title: "Credit Score Update", body: "Your score increased by 12 points this month!", symbol: "chart.line.uptrend.xyaxis", tint: Theme.primary, time: "3d ago", unread: false),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                ForEach(items) { item in
                    Card(padding: 16) {
                        HStack(alignment: .top, spacing: 14) {
                            IconChip(symbol: item.symbol, tint: item.tint)
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text(item.title).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
                                    if item.unread {
                                        Circle().fill(Theme.primary).frame(width: 7, height: 7)
                                    }
                                    Spacer()
                                    Text(item.time).font(.caption2).foregroundStyle(Theme.textSecondary)
                                }
                                Text(item.body).font(.footnote).foregroundStyle(Theme.textSecondary)
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.top, 6)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Notifications")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct NotificationItem: Identifiable {
    let id = UUID()
    let title: String
    let body: String
    let symbol: String
    let tint: Color
    let time: String
    let unread: Bool
}

#Preview {
    NavigationStack { NotificationsView() }
        .preferredColorScheme(.dark)
}
