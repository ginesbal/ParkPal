
export default {
  expo: {
    name: "ParkPal",
    slug: "parkpal",
    version: "1.0.0",
    orientation: "portrait",
    icon: "src/utils/assets/icon.png",
    userInterfaceStyle: "light",


    platforms: ["ios", "android", "web"],

    splash: {
      image: "src/utils/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2563eb"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.parkpal.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "src/utils/assets/adaptive-icon.png",
        backgroundColor: "#2563eb"
      },
      package: "com.parkpal.app"
    },
    web: {
      favicon: "src/utils/assets/favicon.png",
      bundler: "metro",
      output: "single",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY
      },
      build: {
        babel: {
          include: [
            "react-native-maps",
            "@react-native-async-storage/async-storage"
          ]
        }
      }
    },

    extra: {
      apiUrl: "https://parkpal-production.up.railway.app",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    },

  }
};