import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { AffiliateProvider } from "@/contexts/AffiliateContext";
import { P2PWalletProvider } from "@/contexts/P2PWalletContext";
import { trpc, trpcClient } from "@/lib/trpc";
import { View } from "react-native";

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
      <Stack.Screen name="onboarding/signup" />
      <Stack.Screen name="onboarding/face-verify" options={{ presentation: 'modal' }} />
      <Stack.Screen name="onboarding/profile-setup" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="loan-categories" />
      <Stack.Screen name="loan-offers" />
      <Stack.Screen name="p2p-wallet" />
      <Stack.Screen name="p2p/withdraw" options={{ presentation: 'modal' }} />
      <Stack.Screen name="p2p/add-funds" options={{ presentation: 'modal' }} />
      <Stack.Screen name="p2p/send" options={{ presentation: 'modal' }} />
      <Stack.Screen name="p2p/request-loan" />
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
