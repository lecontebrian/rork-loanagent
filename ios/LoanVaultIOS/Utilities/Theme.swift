//
//  Theme.swift
//  LoanVaultIOS
//
//  Design tokens mirroring the Expo app's color palette.
//

import SwiftUI

/// Centralized color palette matching the React Native app (X/Twitter-style dark theme).
enum Theme {
    // Brand
    static let primary = Color(hex: 0x19C534)
    static let primaryDark = Color(hex: 0x15A82B)
    static let primaryLight = Color(hex: 0x3DD657)

    static let secondary = Color(hex: 0x1D9BF0)
    static let secondaryDark = Color(hex: 0x1A8CD8)
    static let secondaryLight = Color(hex: 0x4DB8FF)

    static let accent = Color(hex: 0xFFD400)
    static let accentDark = Color(hex: 0xE6BE00)

    // Semantic
    static let success = Color(hex: 0x19C534)
    static let warning = Color(hex: 0xFFD400)
    static let error = Color(hex: 0xF4212E)
    static let info = Color(hex: 0x1D9BF0)

    // Surfaces
    static let background = Color(hex: 0x000000)
    static let surface = Color(hex: 0x16181C)
    static let surfaceLight = Color(hex: 0x1C1F26)
    static let surfaceSecondary = Color(hex: 0x202327)
    static let surfaceTertiary = Color(hex: 0x2F3336)

    // Text
    static let text = Color(hex: 0xE7E9EA)
    static let textSecondary = Color(hex: 0x71767B)
    static let textTertiary = Color(hex: 0x545A60)

    // Borders
    static let border = Color(hex: 0x2F3336)
    static let borderLight = Color(hex: 0x202327)

    // Credit score colors
    static let creditExcellent = Color(hex: 0x15803D)
    static let creditVeryGood = Color(hex: 0x22C55E)
    static let creditGood = Color(hex: 0x3DD657)
    static let creditFair = Color(hex: 0xF97316)
    static let creditPoor = Color(hex: 0xDC2626)

    // Gradients
    static let primaryGradient = LinearGradient(
        colors: [primary, primaryDark],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    static let oceanGradient = LinearGradient(
        colors: [secondary, secondaryLight],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    static let heroGradient = LinearGradient(
        colors: [Color(hex: 0x000000), surface, Color(hex: 0x000000)],
        startPoint: .top, endPoint: .bottom
    )
    static let premiumGradient = LinearGradient(
        colors: [primary, secondary],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
}

extension Color {
    /// Create a color from a 24-bit hex integer (e.g. 0x19C534).
    init(hex: UInt32, alpha: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: alpha)
    }
}
