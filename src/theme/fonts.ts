import type { TextStyle } from 'react-native';

const fonts = {
  family: {
    aldrich: 'Aldrich_400Regular',
    brunoAce: 'BrunoAce_400Regular',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    title: 32,
  },
  style: {
    alignCenter: { textAlign: 'center' },
    bold: { fontWeight: 'bold' },
    capitalize: { textTransform: 'capitalize' },
    uppercase: { textTransform: 'uppercase' },
    italic: { fontStyle: 'italic' },
    underline: { textDecorationLine: 'underline' },
  } as const satisfies Record<string, TextStyle>,
};

export default fonts;
