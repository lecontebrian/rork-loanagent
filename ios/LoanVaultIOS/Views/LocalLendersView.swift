//
//  LocalLendersView.swift
//  LoanVaultIOS
//

import SwiftUI

struct LocalLendersView: View {
    private let lenders: [LocalLender] = [
        .init(name: "Bay Area Credit Union", type: "Credit Union", distance: "0.8 mi", rating: 4.8, rate: "5.9%", tint: Theme.primary),
        .init(name: "Pacific Community Bank", type: "Local Bank", distance: "1.4 mi", rating: 4.6, rate: "6.4%", tint: Theme.secondary),
        .init(name: "Golden State Lending", type: "Online Lender", distance: "2.1 mi", rating: 4.5, rate: "6.9%", tint: Theme.accent),
        .init(name: "Coastal Federal CU", type: "Credit Union", distance: "3.0 mi", rating: 4.9, rate: "5.5%", tint: Color(hex: 0xBF5AF2)),
        .init(name: "Metro Trust Bank", type: "Local Bank", distance: "3.6 mi", rating: 4.4, rate: "7.1%", tint: Theme.success),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Card {
                    HStack(spacing: 14) {
                        IconChip(symbol: "mappin.and.ellipse", tint: Theme.secondary, size: 48, iconSize: 22)
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Lenders Near You").font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
                            Text("San Francisco, CA · 5 results").font(.caption).foregroundStyle(Theme.textSecondary)
                        }
                        Spacer()
                    }
                }
                .padding(.top, 6)

                ForEach(lenders) { lender in
                    Card {
                        VStack(spacing: 14) {
                            HStack(spacing: 14) {
                                IconChip(symbol: "building.columns.fill", tint: lender.tint, size: 50, iconSize: 22)
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(lender.name).font(.subheadline.weight(.bold)).foregroundStyle(Theme.text)
                                    HStack(spacing: 6) {
                                        Text(lender.type).font(.caption).foregroundStyle(Theme.textSecondary)
                                        Text("· \(lender.distance)").font(.caption).foregroundStyle(Theme.textSecondary)
                                    }
                                }
                                Spacer()
                            }
                            Divider().overlay(Theme.border)
                            HStack {
                                HStack(spacing: 4) {
                                    Image(systemName: "star.fill").font(.caption2).foregroundStyle(Theme.accent)
                                    Text(String(format: "%.1f", lender.rating)).font(.caption.weight(.semibold)).foregroundStyle(Theme.text)
                                }
                                Spacer()
                                Text("From \(lender.rate) APR").font(.caption.weight(.bold)).foregroundStyle(Theme.primary)
                                Spacer()
                                Text("Contact").font(.caption.weight(.bold)).foregroundStyle(.white)
                                    .padding(.horizontal, 14).padding(.vertical, 6)
                                    .background(Theme.primary, in: .capsule)
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Local Lenders")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct LocalLender: Identifiable {
    let id = UUID()
    let name: String
    let type: String
    let distance: String
    let rating: Double
    let rate: String
    let tint: Color
}

#Preview {
    NavigationStack { LocalLendersView() }
        .preferredColorScheme(.dark)
}
