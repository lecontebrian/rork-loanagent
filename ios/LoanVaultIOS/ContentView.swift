//
//  ContentView.swift
//  LoanVaultIOS
//

import SwiftUI

struct ContentView: View {
    @Environment(AppStore.self) private var appStore
    @State private var showSplash = true

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()

            if appStore.isOnboarded {
                MainTabView()
                    .transition(.opacity)
            } else {
                OnboardingView()
                    .transition(.opacity)
            }

            if showSplash {
                SplashView()
                    .transition(.opacity)
                    .zIndex(10)
            }
        }
        .task {
            try? await Task.sleep(for: .seconds(1.7))
            withAnimation(.easeOut(duration: 0.5)) { showSplash = false }
        }
    }
}

#Preview {
    ContentView()
        .environment(AppStore())
        .environment(P2PStore())
}
