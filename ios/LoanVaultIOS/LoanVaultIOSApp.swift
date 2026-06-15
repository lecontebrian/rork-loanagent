//
//  LoanVaultIOSApp.swift
//  LoanVaultIOS
//

import SwiftUI

@main
struct LoanVaultIOSApp: App {
    @State private var appStore = AppStore()
    @State private var p2pStore = P2PStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(appStore)
                .environment(p2pStore)
                .preferredColorScheme(.dark)
        }
    }
}
