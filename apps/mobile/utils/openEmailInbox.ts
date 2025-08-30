import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export const openEmailInbox = async (): Promise<void> => {
  const inboxSchemes = Platform.select({
    ios: [
      'message://',
      'readdle-spark://',
      'airmail://',
      'ms-outlook://',
      'gmail://',
      'googlegmail://',
      'ymail://',
    ],
    android: ['gmail://', 'googlegmail://', 'mailto:'],
    default: ['mailto:'],
  });

  for (const scheme of inboxSchemes!) {
    try {
      const can = await Linking.canOpenURL(scheme);
      if (can) {
        await Linking.openURL(scheme);
        return;
      }
    } catch {
      // ignore and try next
    }
  }

  await Linking.openURL('mailto:');
};

export default openEmailInbox;
