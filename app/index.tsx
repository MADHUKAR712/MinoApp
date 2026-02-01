/**
 * Index - Entry point / Auth router
 * Redirects to SplashScreen on initial load
 */
import { Redirect } from 'expo-router';

export default function Index() {
  // Always start with SplashScreen which handles auth check
  return <Redirect href="/screens/auth/SplashScreen" />;
}
