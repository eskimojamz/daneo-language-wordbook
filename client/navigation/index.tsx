/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { SimpleLineIcons } from '@expo/vector-icons';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import WordbookScreen from '../screens/WordbookScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import Plus from '../assets/icons/Plus';
import AddWord from '../screens/AddWord';
import AddWordBase from '../screens/AddWordBase';
import Dictionary from '../screens/Dictionary';
import EditWord from '../screens/EditWord';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AddWord" component={AddWord}
          options={{
            headerTitle: 'Add Word',
            headerTitleStyle: {
              color: Colors[colorScheme].textDark,
              fontSize: 24,
              fontFamily: 'DMSans_700Bold'
            }
          }}
        />
        <Stack.Screen name="EditWord" component={EditWord}
          options={{
            headerTitle: 'Edit Word',
            headerTitleStyle: {
              color: Colors[colorScheme].textDark,
              fontSize: 24,
              fontFamily: 'DMSans_700Bold'
            }
          }}
        />
        <Stack.Screen name="Dictionary" component={Dictionary}
          options={{
            headerTitleStyle: {
              color: Colors[colorScheme].textDark,
              fontSize: 24,
              fontFamily: 'DMSans_700Bold'
            }
          }}
        />
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

const TabBar = (props: any) => {
  return (
    <BlurView intensity={50}
      style={{
        justifyContent: 'center',
      }}
    >
      <BottomTabBar {...props} />
    </BlurView>
  )
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Wordbook"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: '#A0A1C5',
        tabBarStyle: {
          backgroundColor: 'rgba(218, 220, 255, 0.85)',
          shadowColor: '#8085E7',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 15,
        },
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
            headerTitleStyle: {
                color: Colors[colorScheme].textDark,
                fontSize: 24,
                fontFamily: 'DMSans_700Bold'
            },
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Wordbook"
        component={WordbookScreen}
        options={({ navigation }: RootTabScreenProps<'Wordbook'>) => ({
          title: 'Wordbook',
          headerTitleStyle: {
            color: Colors[colorScheme].textDark,
            fontSize: 24,
            fontFamily: 'DMSans_700Bold'
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="notebook" color={color} />
        })}
      />
      <BottomTab.Screen
        name="AddWordBase"
        component={AddWordBase}
        options={{
          title: 'Add Word',
          tabBarIcon: ({ color }) => <AddWordIcon />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate("AddWord")
          },
        })}
      />
      <BottomTab.Screen
        name="Study"
        component={NotFoundScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="graduation" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof SimpleLineIcons>['name'];
  color: string;
}) {
  return (
    <SimpleLineIcons size={24} {...props} />
  );
}

function AddWordIcon() {
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)']}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        padding: 4,
        shadowColor: "#8085E7",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
      }}
    >
      <Plus />
    </LinearGradient>
  )
}
