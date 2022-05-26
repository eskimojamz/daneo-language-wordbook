import * as SplashScreen from 'expo-splash-screen'
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold
} from '@expo-google-fonts/dm-sans';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Word {
  term: string;
  definition: string;
  status: string;
  dateAdded: number;
}
export interface GlobalContextInterface {
  myWords: Word[];
  setMyWords: React.Dispatch<React.SetStateAction<Word[]>>
}

export const GlobalContext = createContext<GlobalContextInterface | null>(null)

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  // initialize myWords state from AsyncStorage
  const [myWords, setMyWords] = useState<Word[]>(() => {
    const storageRef = AsyncStorage.getItem('wordbook')
    return (
      storageRef && typeof storageRef === 'string'
        ? JSON.parse(storageRef)
        : []
    )
  })

  // global state object for GlobalContext Provider value
  const globalState = {
    myWords,
    setMyWords
  }

  useEffect(() => {
    // show SplashScreen, while fonts load
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync()
        await Font.loadAsync({
          DMSans_400Regular,
          DMSans_500Medium,
          DMSans_700Bold
        })
      } catch (err) {
        console.warn(err)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare();
  }, []);

  // when fonts ready, hide Splashscreen
  const onLayout = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!isLoadingComplete || !appIsReady) return null

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <GlobalContext.Provider value={globalState}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </GlobalContext.Provider>
    </SafeAreaProvider>
  );
}
