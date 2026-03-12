/**
 * Sender Tabs Layout
 *
 * Provides the bottom tab navigation for sender users.
 *
 * Responsibilities:
 * - Define the main sender navigation tabs
 * - Configure tab styling and animations
 * - Provide icons for each tab
 */

import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

const PRIMARY_RED = "#FD1101";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: PRIMARY_RED,
        tabBarInactiveTintColor: "#999",

        // Tab transition animation
        animation: "shift",

        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          elevation: 5,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,

          // Floating pill style
          borderRadius: 20,
          marginHorizontal: 100,
          marginBottom: 20,

          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="SenderHomeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="SenderSettingsScreen"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
