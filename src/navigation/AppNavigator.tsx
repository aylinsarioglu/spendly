import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import type { ThemeColors } from '../theme/colors';
import type { AppNavigatorProps, RootTabParamList } from '../types/expense';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator({
  expenses,
  setExpenses,
  onDeleteAllExpenses,
}: AppNavigatorProps) {
  const { colors } = useAppSettings();
  const styles = useThemedStyles(createStyles);

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
          tabBarLabel: 'Ana Sayfa',
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
          tabBarLabel: 'İstatistikler',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      >
        {() => <StatisticsScreen expenses={expenses} />}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={{
          tabBarLabel: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <SettingsScreen
            expenses={expenses}
            onDeleteAllExpenses={onDeleteAllExpenses}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}
