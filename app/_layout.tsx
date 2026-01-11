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

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/signup" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/face-verify" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="onboarding/profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="loan-categories" options={{ headerShown: false }} />
      <Stack.Screen name="loan-offers" options={{ headerShown: false }} />
      <Stack.Screen name="loan-details" options={{ headerShown: false }} />
      <Stack.Screen name="application-tracking" options={{ headerShown: false }} />

      <Stack.Screen name="p2p-wallet" options={{ headerShown: false }} />
      <Stack.Screen name="p2p/withdraw" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="p2p/add-funds" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="p2p/send" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="p2p/request-loan" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
      SplashScreen.hideAsync();
    }, 100);
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AffiliateProvider>
            <P2PWalletProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ErrorBoundary>
                  <RootLayoutNav />
                </ErrorBoundary>
              </GestureHandlerRootView>
            </P2PWalletProvider>
          </AffiliateProvider>
        </AppProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
