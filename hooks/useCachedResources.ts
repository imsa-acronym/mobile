import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          ...MaterialIcons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
          // 'oswald': Oswald_400Regular,
          // 'oswald-bold': Oswald_700Bold,
          "helvetica": require("../assets/fonts/Helvetica/Helvetica.ttf"),
          "helvetica-bold": require("../assets/fonts/Helvetica/bold.ttf"),
          // 'droid-sans': require('../assets/fonts/DroidSans/droidsans.ttf'),
          // 'droid-sans-bold': require('../assets/fonts/DroidSans/droidsans-bold.ttf'),
          //'playfair-display': require('../assets/fonts/Playfair_Display/PlayfairDisplay.ttf'),
          //'playfair-display-bold': require('../assets/fonts/Playfair_Display/PlayfairDisplay-Bold.ttf'),
          "mercury-roman": require("../assets/fonts/Mercury_Roman/Mercury-Display-Roman.otf"),
          "Lora-Medium": require("../assets/fonts/Lora/static/Lora-Medium.ttf"),
          "Lora-Bold": require("../assets/fonts/Lora/static/Lora-Bold.ttf"),
          "Lora-Italic": require("../assets/fonts/Lora/static/Lora-Italic.ttf"),
          "Lora": require("../assets/fonts/Lora/Lora.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        if (__DEV__) SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
