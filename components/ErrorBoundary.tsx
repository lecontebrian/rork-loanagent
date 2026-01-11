import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '@/constants/colors';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage: string;
  componentStack: string;
};

export default class ErrorBoundary extends React.PureComponent<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: '',
    componentStack: '',
  };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    const msg = error instanceof Error ? error.message : String(error);
    return { hasError: true, errorMessage: msg };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[ErrorBoundary] Caught error', { message: msg, error, componentStack: errorInfo.componentStack });
    this.setState({ componentStack: errorInfo.componentStack ?? '' });
  }

  private handleReset = () => {
    console.log('[ErrorBoundary] Reset pressed');
    this.setState({ hasError: false, errorMessage: '', componentStack: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.root} testID="errorBoundaryRoot">
        <View style={styles.card} testID="errorBoundaryCard">
          <Text style={styles.title} testID="errorBoundaryTitle">Something went wrong</Text>
          <Text style={styles.subtitle} testID="errorBoundarySubtitle">
            We caught an error so the app can keep running.
          </Text>

          <View style={styles.pill} testID="errorBoundaryMessagePill">
            <Text style={styles.pillLabel}>Error</Text>
            <Text style={styles.pillText} selectable testID="errorBoundaryMessage">
              {this.state.errorMessage}
            </Text>
          </View>

          <ScrollView style={styles.stackBox} contentContainerStyle={styles.stackBoxContent} testID="errorBoundaryStack">
            <Text style={styles.stackTitle}>Component stack</Text>
            <Text style={styles.stackText} selectable>
              {this.state.componentStack || '(no stack available)'}
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={this.handleReset} activeOpacity={0.85} testID="errorBoundaryReset">
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#06070A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 20,
    backgroundColor: 'rgba(22, 24, 28, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(47, 51, 54, 0.7)',
    padding: 18,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  pill: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 69, 58, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.20)',
    padding: 12,
  },
  pillLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  pillText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 16,
  },
  stackBox: {
    marginTop: 12,
    maxHeight: 220,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  stackBoxContent: {
    padding: 12,
  },
  stackTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  stackText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    lineHeight: 15,
  },
  button: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
