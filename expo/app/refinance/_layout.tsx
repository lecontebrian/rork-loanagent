import { Stack } from 'expo-router';

export default function RefinanceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="loan-type" />
      <Stack.Screen name="current-loan" />
      <Stack.Screen name="credit-situation" />
      <Stack.Screen name="refinance-goal" />
      <Stack.Screen name="offers" />
    </Stack>
  );
}
