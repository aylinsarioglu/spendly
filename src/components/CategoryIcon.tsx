import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { getCategoryVisual } from '../theme/categoryVisuals';

type CategoryIconProps = {
  category: string;
  size?: number;
  iconSize?: number;
  backgroundColor?: string;
};

export function CategoryIcon({
  category,
  size = 40,
  iconSize,
  backgroundColor,
}: CategoryIconProps) {
  const visual = getCategoryVisual(category);
  const resolvedIconSize = iconSize ?? Math.round(size * 0.48);
  const borderRadius = Math.round(size * 0.28);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: backgroundColor ?? visual.backgroundColor,
          borderColor: visual.borderColor,
        },
      ]}
    >
      <Ionicons
        name={visual.icon}
        size={resolvedIconSize}
        color={visual.iconColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
