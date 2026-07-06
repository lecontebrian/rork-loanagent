//
//  AIAssistantView.swift
//  LoanVaultIOS
//

import SwiftUI

struct AIAssistantView: View {
    @Environment(AppStore.self) private var appStore
    @State private var messages: [ChatMessage] = [
        ChatMessage(role: .assistant, text: "Hi! I'm your AI financial coach. Ask me about loans, credit, budgeting, or anything money-related.")
    ]
    @State private var draft = ""

    private let suggestions = [
        "How can I improve my credit score?",
        "What's the best loan for me?",
        "Help me build a budget",
    ]

    var body: some View {
        VStack(spacing: 0) {
            tokenBar
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(spacing: 14) {
                        ForEach(messages) { message in
                            ChatBubble(message: message).id(message.id)
                        }
                        if messages.count == 1 {
                            suggestionChips
                        }
                    }
                    .padding(.horizontal, 18)
                    .padding(.vertical, 16)
                }
                .onChange(of: messages.count) { _, _ in
                    withAnimation { proxy.scrollTo(messages.last?.id, anchor: .bottom) }
                }
            }
            inputBar
        }
        .background(Theme.background)
        .navigationTitle("AI Coach")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var tokenBar: some View {
        HStack(spacing: 8) {
            Image(systemName: "bolt.fill").font(.caption).foregroundStyle(Theme.accent)
            Text("\(appStore.tokens) tokens remaining").font(.caption.weight(.semibold)).foregroundStyle(Theme.text)
            Spacer()
            NavigationLink("Get more") { SubscriptionView() }
                .font(.caption.weight(.bold)).foregroundStyle(Theme.primary)
        }
        .padding(.horizontal, 18).padding(.vertical, 10)
        .background(Theme.surface)
        .overlay(Rectangle().fill(Theme.border).frame(height: 1), alignment: .bottom)
    }

    private var suggestionChips: some View {
        VStack(spacing: 8) {
            ForEach(suggestions, id: \.self) { suggestion in
                Button { send(suggestion) } label: {
                    HStack {
                        Text(suggestion).font(.subheadline).foregroundStyle(Theme.text)
                        Spacer()
                        Image(systemName: "arrow.up.right").font(.caption).foregroundStyle(Theme.primary)
                    }
                    .padding(14)
                    .background(Theme.surface, in: .rect(cornerRadius: 14))
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(Theme.border, lineWidth: 1))
                }
            }
        }
        .padding(.top, 8)
    }

    private var inputBar: some View {
        HStack(spacing: 10) {
            TextField("", text: $draft, prompt: Text("Ask anything…").foregroundStyle(Theme.textSecondary))
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 16).padding(.vertical, 12)
                .background(Theme.surfaceLight, in: .capsule)
            Button { send(draft) } label: {
                Image(systemName: "arrow.up").font(.headline.weight(.bold)).foregroundStyle(.white)
                    .frame(width: 44, height: 44).background(Theme.primary, in: .circle)
            }
            .disabled(draft.trimmingCharacters(in: .whitespaces).isEmpty)
        }
        .padding(.horizontal, 16).padding(.vertical, 12)
        .background(Theme.surface)
        .overlay(Rectangle().fill(Theme.border).frame(height: 1), alignment: .top)
    }

    private func send(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        messages.append(ChatMessage(role: .user, text: trimmed))
        draft = ""
        appStore.consumeToken()
        let reply = generateReply(for: trimmed)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            messages.append(ChatMessage(role: .assistant, text: reply))
        }
    }

    private func generateReply(for prompt: String) -> String {
        let lower = prompt.lowercased()
        if lower.contains("credit") {
            return "To improve your credit: keep utilization under 30%, never miss a payment, and avoid opening too many new accounts. Your current score is \(appStore.creditInfo?.score ?? 0) — solid progress!"
        }
        if lower.contains("budget") {
            return "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings & debt. Based on your income, that's roughly \((Double(appStore.userProfile?.annualIncome ?? 0) / 12 * 0.2).asCurrency)/month toward savings."
        }
        if lower.contains("loan") {
            return "With your borrowing power of \(Double(appStore.borrowingPower).asCurrency) and a \(appStore.creditInfo?.score ?? 0) credit score, a personal loan with a competitive APR would suit you well. Check the Loans tab for live offers."
        }
        return "Great question! Based on your profile, I'd recommend focusing on steady credit growth and comparing offers before committing. Want me to pull up tailored loan options?"
    }
}

struct ChatMessage: Identifiable {
    enum Role { case user, assistant }
    let id = UUID()
    let role: Role
    let text: String
}

private struct ChatBubble: View {
    let message: ChatMessage

    var body: some View {
        HStack {
            if message.role == .user { Spacer(minLength: 40) }
            Text(message.text)
                .font(.subheadline)
                .foregroundStyle(message.role == .user ? .white : Theme.text)
                .padding(.horizontal, 16).padding(.vertical, 12)
                .background(
                    message.role == .user ? AnyShapeStyle(Theme.primary) : AnyShapeStyle(Theme.surface),
                    in: .rect(cornerRadius: 18)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(message.role == .user ? .clear : Theme.border, lineWidth: 1)
                )
            if message.role == .assistant { Spacer(minLength: 40) }
        }
    }
}

#Preview {
    NavigationStack { AIAssistantView() }
        .environment(AppStore())
        .preferredColorScheme(.dark)
}
