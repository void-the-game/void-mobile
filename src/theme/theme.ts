import { backgrounds } from './backgrounds';
import { colors } from './colors';
import { gutters } from './gutters';
import fonts from './fonts';
import layout from './layout';
import { spacing } from './spacing';

export const theme = {
  colors,
  fonts,
  gutters,
  layout,
  backgrounds,
  spacing,
};

export type ThemeType = typeof theme;
