import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // show/hide text labels
        tabBarActiveTintColor: "#FD1101", // active icon/text color
        tabBarInactiveTintColor: "#999", // inactive icon/text color

        // 🔧 Tab bar container styling
        tabBarStyle: {
          backgroundColor: "#000", // background color
          borderTopWidth: 0, // removes top border line
          elevation: 5, // shadow for Android
          height: 80, // taller bar
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

        // 🏷 Label text styling
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

// import Ionicons from "@expo/vector-icons/Ionicons";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import React from "react";

// // Import your screens
// import HomeScreen from "./HomeScreen";
// import SettingsScreen from "./SettingsScreen";

// const Tab = createMaterialTopTabNavigator();

// export default function TabLayout() {
//   return (
//     <Tab.Navigator
//       tabBarPosition="bottom"
//       screenOptions={{
//         swipeEnabled: true,
//         animationEnabled: true,
//         tabBarShowIcon: true,
//         tabBarShowLabel: true,
//         tabBarActiveTintColor: "#FD1101",
//         tabBarInactiveTintColor: "#999",
//         tabBarIndicatorStyle: { backgroundColor: "transparent" }, // hide the red indicator line

//         // ✅ EXACT same style as your previous setup
//         tabBarStyle: {
//           backgroundColor: "#000",
//           borderTopWidth: 0,
//           elevation: 10,
//           height: 80,
//           paddingBottom: 10,
//           paddingTop: 10,
//           borderRadius: 20,
//           marginHorizontal: 70,
//           marginBottom: 20,
//           position: "absolute",
//           bottom: 25,
//           left: 20,
//           right: 20,

//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.3,
//           shadowRadius: 4.65,
//         },

//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: "600",
//         },
//       }}
//     >
//       <Tab.Screen
//         name="HomeScreen"
//         component={HomeScreen}
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "home-sharp" : "home-outline"}
//               color={color}
//               size={26}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="SettingsScreen"
//         component={SettingsScreen}
//         options={{
//           title: "Settings",
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "settings-sharp" : "settings-outline"}
//               color={color}
//               size={26}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }
