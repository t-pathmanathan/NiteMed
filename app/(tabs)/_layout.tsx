import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#FD1101",
        tabBarInactiveTintColor: "#999",

        // 👇 Add this for animation
        animation: "shift",

        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          elevation: 5,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
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
        name="HomeScreen"
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
        name="SettingsScreen"
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
