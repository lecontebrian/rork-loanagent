import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="what-it-does" />
      <Stack.Screen name="how-ai-works" />
      <Stack.Screen name="why-choose" />
      <Stack.Screen name="face-verify" options={{ presentation: 'modal' }} />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="congratulations" />
      <Stack.Screen name="loan-amount" />
    </Stack>
  );
}
