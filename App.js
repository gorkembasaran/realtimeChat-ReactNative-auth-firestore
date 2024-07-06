import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from './screens/ChatList';
import Settings from './screens/Settings';
import Chat from './screens/Chat';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Provider, DefaultTheme } from 'react-native-paper';
import { auth } from './firebase/firebaseConfig';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigation.navigate('SignUp');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={route.name === 'ChatList' ? 'chatbubbles' : 'settings'} color={color} size={size} />;
        }
      })}
    >
      <Tabs.Screen name='ChatList' component={ChatList} />
      <Tabs.Screen name='Settings' component={Settings} />
    </Tabs.Navigator>
  );
};

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196f3',
    accent: '#e91e63'
  },
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Provider theme={theme}>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name='Main'
                component={TabsNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen name='Chat' component={Chat} />
            </>
          ) : (
            <>
              <Stack.Screen name='SignUp' component={SignUp} options={{ presentation: 'fullScreenModal' }} />
              <Stack.Screen name='SignIn' component={SignIn} options={{ presentation: 'fullScreenModal' }} />
            </>
          )}
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;