const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '/.env') });


module.exports = {
  expo: {
    name: "Frontend",
    slug: "Frontend",
    version: "1.0.0",
    orientation: "landscape",
    icon: "./assets/images/medisync.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.medisync.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/medisync.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/medisync.png",
    },
    plugins: [
      "expo-audio",
      "expo-router",
      "expo-font",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/medisync.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      BASE_API: process.env.BASE_API,
      eas:{
        projectId: "67b41ee3-b77c-4758-8eee-29aa095dc8b7"
      }
    },
  },
};