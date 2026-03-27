import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { AffiliateProvider } from "@/contexts/AffiliateContext";
import { P2PWalletProvider } from "@/contexts/P2PWalletContext";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      retry: false,
      networkMode: 'offlineFirst',
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="loan-categories" />
      <Stack.Screen name="loan-offers" />
      <Stack.Screen name="loan-type-selection" />
      <Stack.Screen name="loan-simulator" />
      <Stack.Screen name="investment-options" />
      <Stack.Screen name="investment-portfolio" />
      <Stack.Screen name="p2p-marketplace" />
      <Stack.Screen name="p2p-wallet" />
      <Stack.Screen name="p2p" />
      <Stack.Screen name="premium" />
      <Stack.Screen name="premium-experience" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="application" />
      <Stack.Screen name="refinance" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="legal" />
      <Stack.Screen name="ai-assistant" />
      <Stack.Screen name="budget-tracker" />
      <Stack.Screen name="credit-builder" />
      <Stack.Screen name="credit-disputes" />
      <Stack.Screen name="consumer-rights" />
      <Stack.Screen name="document-vault" />
      <Stack.Screen name="features-menu" />
      <Stack.Screen name="financial-coach" />
      <Stack.Screen name="local-lenders" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="affiliate-dashboard" />
      <Stack.Screen name="legal-compliance" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      SplashScreen.hideAsync();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ErrorBoundary>
            <AppProvider>
              <AffiliateProvider>
                <P2PWalletProvider>
                  <RootLayoutNav />
                </P2PWalletProvider>
              </AffiliateProvider>
            </AppProvider>
          </ErrorBoundary>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
