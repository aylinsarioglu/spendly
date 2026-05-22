import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

type Category = {
  id: string;
  emoji: string;
  name: string;
  amount: number;
};

const CATEGORIES: Category[] = [
  { id: '1', emoji: '🍔', name: 'Yemek', amount: 1200 },
  { id: '2', emoji: '🚕', name: 'Ulaşım', amount: 700 },
  { id: '3', emoji: '🛍️', name: 'Alışveriş', amount: 950 },
];

const TOTAL = CATEGORIES.reduce((sum, c) => sum + c.amount, 0);

const COLORS = {
  background: '#0A0A0C',
  card: '#16161A',
  cardElevated: '#1E1E24',
  border: '#2A2A32',
  textPrimary: '#F5F5F7',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  accent: '#6C5CE7',
  accentSoft: 'rgba(108, 92, 231, 0.15)',
} as const;

function formatCurrency(amount: number): string {
  return `₺${amount.toLocaleString('tr-TR')}`;
}

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.appTitle}>Spendly</Text>
      <Text style={styles.periodLabel}>Bu Ay</Text>
    </View>
  );
}

function TotalCard({ amount }: { amount: number }) {
  return (
    <View style={styles.totalCard}>
      <Text style={styles.totalLabel}>Toplam Harcama</Text>
      <Text style={styles.totalAmount}>{formatCurrency(amount)}</Text>
      <View style={styles.totalBadge}>
        <Text style={styles.totalBadgeText}>
          {CATEGORIES.length} kategori
        </Text>
      </View>
    </View>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryLeft}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
      <Text style={styles.categoryAmount}>
        {formatCurrency(category.amount)}
      </Text>
    </View>
  );
}

function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.sectionTitle}>Kategoriler</Text>
      <View style={styles.categoryList}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </View>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Header />
          <TotalCard amount={TOTAL} />
          <CategoryList categories={CATEGORIES} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
    gap: 28,
  },
  header: {
    gap: 6,
    marginTop: 8,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: COLORS.textPrimary,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },
  totalCard: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  totalBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  totalBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  categorySection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  categoryAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
});
