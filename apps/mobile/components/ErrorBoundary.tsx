import Logo from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { Linking } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

class ErrorBoundaryImpl extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  componentDidCatch(error: unknown) {
    // TODO: connect to telemetry if available
    // console.error('Uncaught error:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <YStack flex={1} bg="$background" items="center" justify="center" p="$6">
          <YStack bg="$color2" width="100%" p="$6" rounded="$6" gap="$4">
            <YStack items="center" gap="$3">
              <Logo width={64} height={64} />
              <Text fontSize="$7" fontWeight="800" text="center">
                Something went wrong
              </Text>
              <Text color="$color8" text="center">
                An unexpected error occurred. You can try again or contact support.
              </Text>
            </YStack>
            {this.state.errorMessage ? (
              <YStack bg="$background" rounded="$4" p="$3">
                <Text color="$color8">{this.state.errorMessage}</Text>
              </YStack>
            ) : null}
            <XStack gap="$3" items="center" justify="center">
              <Button onPress={this.handleReset} testID="btn-try-again" aria-label="Try again">
                Try again
              </Button>
              <Button
                variant="outline"
                onPress={() => Linking.openURL('mailto:support@counsy.ai?subject=App%20Error')}
                testID="btn-contact-support"
                aria-label="Contact support"
              >
                Contact support
              </Button>
            </XStack>
          </YStack>
        </YStack>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return <ErrorBoundaryImpl>{children}</ErrorBoundaryImpl>;
};
