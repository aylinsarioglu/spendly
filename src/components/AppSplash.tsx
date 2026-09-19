import { Image, StyleSheet, Text, View } from 'react-native';

import { APP_NAME } from '../constants/app';

const SPLASH_BACKGROUND = '#0A0A0C';
const SPLASH_WORDMARK = '#F5F5F7';

export function AppSplash() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel={APP_NAME}
      />
      <Text style={styles.wordmark}>{APP_NAME}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 168,
    height: 168,
  },
  wordmark: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: SPLASH_WORDMARK,
    textAlign: 'center',
  },
});
