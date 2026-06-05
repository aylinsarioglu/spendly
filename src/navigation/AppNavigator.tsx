import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { colors } from '../theme/colors';
import type { AppNavigatorProps, RootTabParamList } from '../types/expense';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator({ expenses, setExpenses }: AppNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      >
        {() => <HomeScreen expenses={expenses} setExpenses={setExpenses} />}
      </Tab.Screen>

      <Tab.Screen
        name="Statistics"
        options={{
          tabBarLabel: 'Statistics',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      >
        {() => <StatisticsScreen expenses={expenses} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
