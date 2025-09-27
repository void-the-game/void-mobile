import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { StarField } from '@/components/molecules/StarField';
import { generateStarCoordinates } from '@/utils/generateStarCoordinates';

type Props = {
  children: React.ReactNode;
  starCount?: number;
};

const SpaceBackgroundWrapper: React.FC<Props> = ({
  children,
  starCount = 30,
}) => {
  const stars = useMemo(
    () => generateStarCoordinates({ quantity: starCount }),
    [starCount],
  );
  const { colors, layout } = useTheme();

  return (
    <View style={[layout.flex_1, { backgroundColor: colors.background }]}>
      <StarField stars={stars} style={styles.stars} />
      <View style={layout.flex_1}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  stars: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default SpaceBackgroundWrapper;
