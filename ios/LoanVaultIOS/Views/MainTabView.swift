//
//  MainTabView.swift
//  LoanVaultIOS
//

import SwiftUI

struct MainTabView: View {
    @State private var selection = 0

    var body: some View {
        TabView(selection: $selection) {
            NavigationStack { DashboardView() }
                .tabItem { Label("Home", systemImage: "house.fill") }
                .tag(0)

            NavigationStack { LoanCategoriesView() }
                .tabItem { Label("Loans", systemImage: "doc.text.fill") }
                .tag(1)

            NavigationStack { P2PMarketplaceView() }
                .tabItem { Label("P2P", systemImage: "person.2.fill") }
                .tag(2)

            NavigationStack { FeaturesMenuView() }
                .tabItem { Label("Tools", systemImage: "square.grid.2x2.fill") }
                .tag(3)

            NavigationStack { SettingsView() }
                .tabItem { Label("Settings", systemImage: "gearshape.fill") }
                .tag(4)
        }
        .tint(Theme.primary)
    }
}

#Preview {
    MainTabView()
        .environment(AppStore())
        .environment(P2PStore())
        .preferredColorScheme(.dark)
}
