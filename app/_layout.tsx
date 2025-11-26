import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load the custom fonts by directly referencing the required file names.
  // IMPORTANT: You must place files named 'Georgia-Bold.ttf' and 
  // 'TimesNewRoman-Regular.ttf' inside the 'assets/fonts/' directory.
  const [loaded, error] = useFonts({
    'Georgia-Bold': require('../assets/fonts/Georgia-Bold.ttf'),
    'TimesNewRoman-Regular': require('../assets/fonts/TimesNewRoman-Regular.ttf'),
  });

  // Handle errors and hide splash screen once fonts are loaded
  useEffect(() => {
    if (error) throw error;

    if (loaded) {
      // Hide the splash screen once fonts are ready
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    // Keep the native splash screen visible while assets are loading
    return null;
  }

  return (
    <Stack>
      {/* Set the initial route to 'splash' */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      {/* The main landing page */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* New Category Products Screen */}
      <Stack.Screen name="category" options={{ headerShown: false }} />
    </Stack>
  );
}