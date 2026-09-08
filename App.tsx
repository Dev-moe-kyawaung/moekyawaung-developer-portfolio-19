import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import CursorLayer, { useCursor } from './src/components/CursorTrail';
import HomeScreen from './src/screens/HomeScreen';
import WorkScreen from './src/screens/WorkScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { shadowFor } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS: Record<string, { active: any; inactive: any }> = {
  HomeTab: { active: 'home', inactive: 'home-outline' },
  WorkTab: { active: 'albums', inactive: 'albums-outline' },
  SkillsTab: { active: 'sparkles', inactive: 'sparkles-outline' },
  ProfileTab: { active: 'person', inactive: 'person-outline' },
};

function Tabs() {
  const { palette } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textFaint,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: palette.tabBar,
          borderTopColor: palette.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          ...shadowFor(palette),
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const set = ICONS[route.name] ?? ICONS.HomeTab;
          return (
            <Ionicons name={focused ? set.active : set.inactive} size={size - 2} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="WorkTab" component={WorkScreen} options={{ title: 'Work' }} />
      <Tab.Screen name="SkillsTab" component={SkillsScreen} options={{ title: 'Skills' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function Root() {
  const { palette, isDark } = useTheme();
  const cursor = useCursor();

  const navTheme: Theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: palette.bg,
      card: palette.surface,
      text: palette.text,
      primary: palette.accent,
      border: palette.border,
      notification: palette.accent,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '800' },
    },
  };

  return (
    <View
      style={[styles.fill, { backgroundColor: palette.bg }]}
      data-cursor-surface="true"
      onTouchStart={cursor.handlers.onTouchStart}
      onTouchMove={cursor.handlers.onTouchMove}
      onTouchEnd={cursor.handlers.onTouchEnd}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 520,
            contentStyle: { backgroundColor: palette.bg },
          }}
        >
          <Stack.Screen name="Main" component={Tabs} />
          <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <CursorLayer cursor={cursor} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E3A857" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0908',
  },
});
