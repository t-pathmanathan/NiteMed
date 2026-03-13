export default {
  expo: {
    name: "NiteMed",
    slug: "NiteMed",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon.png",
    scheme: "nitemed",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    runtimeVersion: {
      policy: "appVersion",
    },

    updates: {
      url: "https://u.expo.dev/9189c868-0055-4a55-b7f5-0421ee8e1e9d",
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/app-icon.png",
        backgroundColor: "#FD1101",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.thilochan.NiteMed",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/app-icon.png",
          imageWidth: 200,
          backgroundColor: "#FD1101",
        },
      ],
      "expo-font",
      "expo-web-browser",
      "expo-secure-store",
      "expo-notifications",
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      router: {},
      eas: {
        projectId: "9189c868-0055-4a55-b7f5-0421ee8e1e9d",
      },
    },
  },
};
