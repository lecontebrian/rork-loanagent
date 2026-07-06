//
//  SplashView.swift
//  LoanVaultIOS
//

import SwiftUI

struct SplashView: View {
    @State private var appear = false
    @State private var dotPhase = 0

    var body: some View {
        ZStack {
            Theme.heroGradient.ignoresSafeArea()

            VStack(spacing: 28) {
                ZStack {
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .fill(Theme.primaryGradient)
                        .frame(width: 104, height: 104)
                        .shadow(color: Theme.primary.opacity(0.5), radius: 24, y: 10)
                    Image(systemName: "building.columns.fill")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundStyle(.white)
                }
                .scaleEffect(appear ? 1 : 0.4)
                .opacity(appear ? 1 : 0)

                VStack(spacing: 6) {
                    Text("Loan Agent")
                        .font(.system(size: 30, weight: .bold, design: .rounded))
                        .foregroundStyle(Theme.text)
                    Text("Your Intelligent Guide")
                        .font(.subheadline)
                        .foregroundStyle(Theme.textSecondary)
                }
                .opacity(appear ? 1 : 0)

                HStack(spacing: 8) {
                    ForEach(0..<3, id: \.self) { i in
                        Circle()
                            .fill(Theme.primary)
                            .frame(width: 8, height: 8)
                            .scaleEffect(dotPhase == i ? 1.3 : 0.7)
                            .opacity(dotPhase == i ? 1 : 0.4)
                    }
                }
                .opacity(appear ? 1 : 0)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.7, dampingFraction: 0.6)) { appear = true }
            Timer.scheduledTimer(withTimeInterval: 0.4, repeats: true) { _ in
                dotPhase = (dotPhase + 1) % 3
            }
        }
    }
}

#Preview {
    SplashView()
}
