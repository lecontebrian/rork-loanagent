import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, type AppTheme } from '@/constants/theme';

const THEME_KEY = '@loanagent_theme';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: AppTheme;
  darkMode: boolean;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      } catch {
        // ignore
      }
      setLoaded(true);
    })();
  }, []);

  const darkMode =
    preference === 'system' ? systemColorScheme === 'dark' : preference === 'dark';

  const setPreference = (pref: ThemePreference) => {
    setPreferenceState(pref);
    AsyncStorage.setItem(THEME_KEY, pref).catch(() => {});
  };

  const toggleDark = () => {
    const next: ThemePreference = darkMode ? 'light' : 'dark';
    setPreference(next);
  };

  const value: ThemeContextValue = {
    theme: darkMode ? darkTheme : lightTheme,
    darkMode,
    preference,
    setPreference,
    toggleDark,
  };

  if (!loaded) {
    // Use system theme during initial load to avoid flash
    const sysDark = systemColorScheme === 'dark';
    return (
      <ThemeContext.Provider
        value={{
          theme: sysDark ? darkTheme : lightTheme,
          darkMode: sysDark,
          preference,
          setPreference,
          toggleDark,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
