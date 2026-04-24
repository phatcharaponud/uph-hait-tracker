import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { ExercisesScreen } from '../screens/ExercisesScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { MedicationsScreen } from '../screens/MedicationsScreen';
import { DiaryScreen } from '../screens/DiaryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.iconBox}>
      <Text style={[styles.icon, { color: focused ? colors.primary : colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function ExercisesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExercisesList" component={ExercisesScreen} />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ headerShown: true, title: '', headerTintColor: colors.primary }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { paddingTop: 4, paddingBottom: 6, height: 62 },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Exercises"
        component={ExercisesStack}
        options={{
          title: 'ออกกำลังกาย',
          tabBarIcon: ({ focused }) => <TabIcon label="🦵" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          title: 'ไดอารี่',
          tabBarIcon: ({ focused }) => <TabIcon label="📝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Medications"
        component={MedicationsScreen}
        options={{
          title: 'ยา',
          tabBarIcon: ({ focused }) => <TabIcon label="💊" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconBox: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
});
