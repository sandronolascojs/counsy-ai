import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';

export const SafeAreaWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: theme.background?.get() }}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
