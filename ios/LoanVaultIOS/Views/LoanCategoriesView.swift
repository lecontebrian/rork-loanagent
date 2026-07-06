//
//  LoanCategoriesView.swift
//  LoanVaultIOS
//

import SwiftUI

struct LoanCategoriesView: View {
    @Environment(AppStore.self) private var appStore

    private let categories = MockData.loanCategories
    private let tints: [LoanType: Color] = [
        .auto: Theme.secondary, .home: Theme.primary, .personal: Color(hex: 0xBF5AF2),
        .business: Theme.accent, .education: Color(hex: 0x32ADE6), .debt: Theme.error
    ]
    private let categoryImages: [LoanType: String] = [
        .auto: "car_key_steering_wheel", .home: "house_key_mortgage", .personal: "wallet_coin",
        .business: "storefront_growth", .education: "graduation_cap_book"
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Find Your Loan").font(.system(size: 28, weight: .bold)).foregroundStyle(Theme.text)
                    Text("Choose a category to compare real offers from top lenders.")
                        .font(.subheadline).foregroundStyle(Theme.textSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 6)

                ForEach(categories) { category in
                    NavigationLink(value: category) {
                        LoanCategoryCard(category: category, tint: tints[category.id] ?? Theme.primary, imageName: categoryImages[category.id])
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 32)
        }
        .background(Theme.background)
        .navigationTitle("Loans")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: LoanCategory.self) { LoanOffersView(category: $0) }
        .navigationDestination(for: LoanOffer.self) { LoanOfferDetailView(offer: $0) }
    }
}

private struct LoanCategoryCard: View {
    let category: LoanCategory
    let tint: Color
    let imageName: String?

    var body: some View {
        Card {
            HStack(spacing: 16) {
                if let imgName = imageName {
                    Image(imgName)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 40, height: 40)
                        .padding(7)
                        .background(tint.opacity(0.12), in: .rect(cornerRadius: 14))
                } else {
                    IconChip(symbol: category.id.sfSymbol, tint: tint, size: 54, iconSize: 24)
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text(category.name).font(.headline).foregroundStyle(Theme.text)
                    Text(category.description).font(.footnote).foregroundStyle(Theme.textSecondary).lineLimit(2)
                    Text("\(Double(category.minAmount).asCurrency) – \(Double(category.maxAmount).asCurrency)")
                        .font(.caption.weight(.semibold)).foregroundStyle(tint).padding(.top, 2)
                }
                Spacer()
                Image(systemName: "chevron.right").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.textTertiary)
            }
        }
    }
}

#Preview {
    NavigationStack { LoanCategoriesView() }
        .environment(AppStore())
        .preferredColorScheme(.dark)
}
