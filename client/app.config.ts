import 'dotenv/config';

export default {
  "expo": {
    "name": "Daneo",
    "slug": "daneo",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/4812ddcd-feb9-4607-9bb9-86f190b31801"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "extra": {
      translateKey: process.env.TRANSLATE_KEY,
      "eas": {
        "projectId": "4812ddcd-feb9-4607-9bb9-86f190b31801"
      }
    }
  }
};
