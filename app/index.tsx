/**
 * Root Index Screen
 *
 * Redirects the app root route to the StartScreen.
 * Ensures the application always begins at the start screen on launch.
 */

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/StartScreen" />;
}
