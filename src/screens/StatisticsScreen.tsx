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

import { colors } from '../theme/colors';
import type { StatisticsScreenProps } from '../types/expense';
import { formatCurrency } from '../utils/formatCurrency';
import { getExpenseStatistics, getPieChartData } from '../utils/statisticsHelpers';

export function StatisticsScreen({ expenses }: StatisticsScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));

  const statistics = useMemo(
    () => getExpenseStatistics(expenses),
    [expenses],
  );

  const pieChartData = useMemo(
    () => getPieChartData(statistics.categorySummary),
    [statistics.categorySummary],
  );

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
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Harcama özeti</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Toplam Harcama"
            value={formatCurrency(statistics.totalSpending)}
          />
          <StatCard
            label="Toplam İşlem"
            value={statistics.transactionCount.toString()}
          />
          <StatCard
            label="En Çok Harcanan Kategori"
            value={statistics.highestSpendingCategory}
            fullWidth
          />
        </View>

        {pieChartData.length > 0 ? (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
            <View style={styles.chartCard}>
              <PieChart
                data={pieChartData}
                width={width - horizontalPadding * 2 - 32}
                height={220}
                chartConfig={{
                  color: () => colors.textPrimary,
                  labelColor: () => colors.textSecondary,
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
          <Text style={styles.sectionTitle}>Kategori Toplamları</Text>
          <View style={styles.categoryList}>
            {statistics.categorySpending.map((item) => (
              <View key={item.category} style={styles.categoryRow}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                  <View>
                    <Text style={styles.categoryName}>{item.category}</Text>
                    <Text style={styles.categoryMeta}>
                      {item.count} işlem
                    </Text>
                  </View>
                </View>
                <Text style={styles.categoryAmount}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

function StatCard({ label, value, fullWidth = false }: StatCardProps) {
  return (
    <View style={[styles.statCard, fullWidth && styles.statCardFull]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 24,
  },
  header: {
    gap: 4,
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  statCardFull: {
    flexBasis: '100%',
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
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  categoryAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
