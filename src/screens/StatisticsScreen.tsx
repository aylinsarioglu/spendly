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

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { CategorySpending, StatisticsScreenProps } from '../types/expense';
import {
  getExpenseStatistics,
  getPieChartData,
} from '../utils/statisticsHelpers';

export function StatisticsScreen({ expenses }: StatisticsScreenProps) {
  const { colors, formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));
  const chartWidth = width - horizontalPadding * 2 - 32;

  const statistics = useMemo(
    () => getExpenseStatistics(expenses),
    [expenses],
  );

  const pieChartData = useMemo(
    () => getPieChartData(statistics.categorySummary, colors.textPrimary),
    [statistics.categorySummary, colors.textPrimary],
  );

  const highestCategoryLabel =
    statistics.highestSpendingCategoryEmoji.length > 0
      ? `${statistics.highestSpendingCategoryEmoji} ${statistics.highestSpendingCategory}`
      : statistics.highestSpendingCategory;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
            label="Toplam Harcama"
            value={formatMoney(statistics.totalSpending)}
          />
          <StatCard
            label="Toplam İşlem"
            value={statistics.transactionCount.toString()}
          />
          <StatCard
            label="Ortalama Harcama"
            value={formatMoney(statistics.averageSpending)}
          />
          <StatCard
            label="En Çok Harcama Yapılan Kategori"
            value={highestCategoryLabel}
          />
        </View>

        {pieChartData.length > 0 ? (
          <View style={styles.chartSection}>
            <View style={styles.chartCard}>
              <PieChart
                data={pieChartData}
                width={chartWidth}
                height={220}
                chartConfig={{
                  color: () => colors.textPrimary,
                  labelColor: () => colors.textSecondary,
                  backgroundGradientFrom: colors.card,
                  backgroundGradientTo: colors.card,
                  decimalPlaces: 0,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="12"
                absolute
              />
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
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Henüz harcama yok</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

type CategoryDistributionRowProps = {
  item: CategorySpending;
};

function CategoryDistributionRow({ item }: CategoryDistributionRowProps) {
  const { formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.categoryRow}>
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text style={styles.categoryName}>{item.category}</Text>
      <View style={styles.dottedLine} />
      <Text style={styles.categoryAmount}>{formatMoney(item.amount)}</Text>
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
    paddingTop: 8,
    paddingBottom: 32,
    gap: 28,
  },
  header: {
    gap: 6,
    marginTop: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
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
    gap: 12,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  chartSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
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
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: 2,
    minWidth: 16,
  },
  categoryAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  });
}
