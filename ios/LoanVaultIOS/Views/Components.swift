//
//  Components.swift
//  LoanVaultIOS
//
//  Reusable styled building blocks shared across screens.
//

import SwiftUI

/// A card surface with the app's elevated dark style.
struct Card<Content: View>: View {
    var padding: CGFloat = 18
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.surface, in: .rect(cornerRadius: 20))
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(Theme.border, lineWidth: 1)
            )
    }
}

/// Rounded icon chip with a tinted translucent background.
struct IconChip: View {
    let symbol: String
    var tint: Color = Theme.primary
    var size: CGFloat = 44
    var iconSize: CGFloat = 19

    var body: some View {
        RoundedRectangle(cornerRadius: size * 0.32, style: .continuous)
            .fill(tint.opacity(0.14))
            .frame(width: size, height: size)
            .overlay(
                Image(systemName: symbol)
                    .font(.system(size: iconSize, weight: .semibold))
                    .foregroundStyle(tint)
            )
    }
}

/// Section header with a title and optional trailing action.
struct SectionHeader: View {
    let title: String
    var actionTitle: String? = nil
    var action: (() -> Void)? = nil

    var body: some View {
        HStack {
            Text(title)
                .font(.system(size: 19, weight: .bold))
                .foregroundStyle(Theme.text)
            Spacer()
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Theme.primary)
            }
        }
    }
}

/// Primary filled call-to-action button.
struct PrimaryButton: View {
    let title: String
    var systemImage: String? = nil
    var gradient: LinearGradient = Theme.primaryGradient
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Text(title).font(.headline)
                if let systemImage {
                    Image(systemName: systemImage).font(.subheadline.weight(.bold))
                }
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(gradient, in: .rect(cornerRadius: 15))
        }
    }
}

/// Thin progress bar with a tint.
struct ProgressBar: View {
    let value: Double // 0...1
    var tint: Color = Theme.primary
    var height: CGFloat = 8

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(Theme.surfaceTertiary)
                Capsule()
                    .fill(tint)
                    .frame(width: max(0, min(1, value)) * geo.size.width)
            }
        }
        .frame(height: height)
    }
}

/// Lender logo placeholder showing the lender's initial.
struct LenderAvatar: View {
    let name: String
    var size: CGFloat = 44

    private var initial: String { String(name.prefix(1)) }

    var body: some View {
        RoundedRectangle(cornerRadius: size * 0.28, style: .continuous)
            .fill(Theme.surfaceSecondary)
            .frame(width: size, height: size)
            .overlay(
                Text(initial)
                    .font(.system(size: size * 0.42, weight: .bold, design: .rounded))
                    .foregroundStyle(Theme.primary)
            )
            .overlay(
                RoundedRectangle(cornerRadius: size * 0.28)
                    .stroke(Theme.border, lineWidth: 1)
            )
    }
}

extension Double {
    /// Format as USD currency with no decimals (e.g. $12,500).
    var asCurrency: String {
        let f = NumberFormatter()
        f.numberStyle = .currency
        f.maximumFractionDigits = 0
        f.currencyCode = "USD"
        return f.string(from: NSNumber(value: self)) ?? "$0"
    }

    /// Format as USD currency with 2 decimals.
    var asCurrencyPrecise: String {
        let f = NumberFormatter()
        f.numberStyle = .currency
        f.minimumFractionDigits = 2
        f.maximumFractionDigits = 2
        f.currencyCode = "USD"
        return f.string(from: NSNumber(value: self)) ?? "$0.00"
    }

    /// Compact representation (e.g. 12.5K, 1.2M).
    var compact: String {
        let n = abs(self)
        if n >= 1_000_000 { return String(format: "%.1fM", self / 1_000_000) }
        if n >= 1_000 { return String(format: "%.1fK", self / 1_000) }
        return String(format: "%.0f", self)
    }
}
