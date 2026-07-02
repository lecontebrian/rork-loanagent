import { Stack } from 'expo-router';

export default function ApplicationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="questionnaire" />
      <Stack.Screen name="license-scan" />
      <Stack.Screen name="loan-disclosure" />
      <Stack.Screen name="nda-disclaimer" />
      <Stack.Screen name="pending-review" />
      <Stack.Screen name="signature" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}
