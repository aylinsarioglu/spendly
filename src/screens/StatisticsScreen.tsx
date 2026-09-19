import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '../components/CategoryIcon';
import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import { tabIcons } from '../theme/icons';
import type { CategorySpending, StatisticsScreenProps } from '../types/expense';
import {
  getExpenseStatistics,
  getPieChartData,
} from '../utils/statisticsHelpers';

const GRID_GAP = 12;
const CHART_HEIGHT = 200;

export function StatisticsScreen({ expenses }: StatisticsScreenProps) {
  const { colors, formatMoney, theme } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));
  const contentWidth = width - horizontalPadding * 2;
  const statCardWidth = (contentWidth - GRID_GAP) / 2;
  const pieWidth = Math.min(220, Math.max(180, contentWidth - 24));

  const statistics = useMemo(
    () => getExpenseStatistics(expenses),
    [expenses],
  );

  const pieChartData = useMemo(
    () => getPieChartData(statistics.categorySummary, colors.textPrimary),
    [statistics.categorySummary, colors.textPrimary],
  );

  const highestCategory =
    statistics.highestSpendingCategory === '-'
      ? undefined
      : statistics.highestSpendingCategory;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>İstatistikler</Text>
          <Text style={styles.subtitle}>Harcama özeti</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            width={statCardWidth}
            label="Toplam Harcama"
            value={formatMoney(statistics.totalSpending)}
          />
          <StatCard
            width={statCardWidth}
            label="Toplam İşlem"
            value={statistics.transactionCount.toString()}
          />
          <StatCard
            width={statCardWidth}
            label="Ortalama Harcama"
            value={formatMoney(statistics.averageSpending)}
          />
          <StatCard
            width={statCardWidth}
            label="En Çok Harcama Yapılan Kategori"
            value={statistics.highestSpendingCategory}
            category={highestCategory}
          />
        </View>

        {pieChartData.length > 0 ? (
          <View style={styles.chartCard}>
            <View style={styles.chartCanvas}>
              <PieChart
                data={pieChartData}
                width={pieWidth}
                height={CHART_HEIGHT}
                chartConfig={{
                  color: () => colors.textPrimary,
                  labelColor: () => colors.textSecondary,
                  backgroundGradientFrom: colors.card,
                  backgroundGradientTo: colors.card,
                  decimalPlaces: 0,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft={String(Math.round(pieWidth / 4))}
                hasLegend={false}
                absolute
              />
            </View>

            <View style={styles.legendList}>
              {statistics.categorySpending.map((item) => (
                <ChartLegendRow key={item.category} item={item} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
          {statistics.categorySpending.length > 0 ? (
            <View style={styles.categoryList}>
              {statistics.categorySpending.map((item) => (
                <CategoryDistributionRow key={item.category} item={item} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name={tabIcons.statistics.outline}
                  size={26}
                  color={colors.accent}
                />
              </View>
              <Text style={styles.emptyTitle}>Henüz harcama yok</Text>
              <Text style={styles.emptyText}>
                İstatistikler, eklediğin harcamalardan oluşur.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  width: number;
  label: string;
  value: string;
  category?: string;
};

function StatCard({ width, label, value, category }: StatCardProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.statCard, { width }]}>
      <Text style={styles.statLabel}>{label}</Text>
      {category ? (
        <View style={styles.statValueRow}>
          <CategoryIcon category={category} size={28} />
          <Text
            style={styles.statValue}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {value}
          </Text>
        </View>
      ) : (
        <Text
          style={styles.statValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
        >
          {value}
        </Text>
      )}
    </View>
  );
}

type CategoryRowProps = {
  item: CategorySpending;
};

function ChartLegendRow({ item }: CategoryRowProps) {
  const { formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.legendRow}>
      <CategoryIcon category={item.category} size={28} />
      <Text style={styles.legendName} numberOfLines={1}>
        {item.category}
      </Text>
      <Text
        style={styles.legendAmount}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {formatMoney(item.amount)}
      </Text>
    </View>
  );
}

function CategoryDistributionRow({ item }: CategoryRowProps) {
  const { formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.categoryRow}>
      <CategoryIcon category={item.category} size={40} />
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {item.category}
        </Text>
        <View style={styles.categoryMeta}>
          <View style={styles.dottedLine} />
          <Text
            style={styles.categoryAmount}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {formatMoney(item.amount)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 4,
      paddingBottom: 32,
      gap: 22,
    },
    header: {
      gap: 6,
      marginTop: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.7,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
      letterSpacing: 0.2,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GRID_GAP,
    },
    statCard: {
      minHeight: 118,
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.4,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.4,
      flexShrink: 1,
      minWidth: 0,
    },
    statValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 18,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    chartCanvas: {
      width: '100%',
      alignItems: 'center',
      overflow: 'hidden',
    },
    legendList: {
      gap: 10,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minWidth: 0,
    },
    legendName: {
      flex: 1,
      minWidth: 0,
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    legendAmount: {
      maxWidth: '42%',
      flexShrink: 0,
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
      textAlign: 'right',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    categorySection: {
      gap: 16,
    },
    categoryList: {
      gap: 12,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    categoryContent: {
      flex: 1,
      minWidth: 0,
      gap: 8,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    categoryMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minWidth: 0,
    },
    dottedLine: {
      flex: 1,
      minWidth: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderStyle: 'dashed',
      opacity: 0.7,
    },
    categoryAmount: {
      maxWidth: '48%',
      flexShrink: 0,
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
      textAlign: 'right',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 40,
      paddingHorizontal: 24,
      gap: 10,
    },
    emptyIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: 'rgba(108, 92, 231, 0.28)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
}
