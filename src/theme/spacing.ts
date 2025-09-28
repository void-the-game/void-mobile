import type { ViewStyle } from 'react-native';
import { gutters } from './gutters';

const base = gutters;

export const spacing = {
  m_xs: { margin: base.xs },
  m_sm: { margin: base.sm },
  m_md: { margin: base.md },
  m_lg: { margin: base.lg },
  m_xl: { margin: base.xl },
  m_2xl: { margin: base['2xl'] },

  mt_xs: { marginTop: base.xs },
  mt_sm: { marginTop: base.sm },
  mt_md: { marginTop: base.md },
  mt_lg: { marginTop: base.lg },
  mt_xl: { marginTop: base.xl },
  mt_2xl: { marginTop: base['2xl'] },

  mb_xs: { marginBottom: base.xs },
  mb_sm: { marginBottom: base.sm },
  mb_md: { marginBottom: base.md },
  mb_lg: { marginBottom: base.lg },
  mb_xl: { marginBottom: base.xl },
  mb_2xl: { marginBottom: base['2xl'] },

  ml_xs: { marginLeft: base.xs },
  ml_sm: { marginLeft: base.sm },
  ml_md: { marginLeft: base.md },
  ml_lg: { marginLeft: base.lg },
  ml_xl: { marginLeft: base.xl },
  ml_2xl: { marginLeft: base['2xl'] },

  mr_xs: { marginRight: base.xs },
  mr_sm: { marginRight: base.sm },
  mr_md: { marginRight: base.md },
  mr_lg: { marginRight: base.lg },
  mr_xl: { marginRight: base.xl },
  mr_2xl: { marginRight: base['2xl'] },

  mx_xs: { marginHorizontal: base.xs },
  mx_sm: { marginHorizontal: base.sm },
  mx_md: { marginHorizontal: base.md },
  mx_lg: { marginHorizontal: base.lg },
  mx_xl: { marginHorizontal: base.xl },
  mx_2xl: { marginHorizontal: base['2xl'] },

  my_xs: { marginVertical: base.xs },
  my_sm: { marginVertical: base.sm },
  my_md: { marginVertical: base.md },
  my_lg: { marginVertical: base.lg },
  my_xl: { marginVertical: base.xl },
  my_2xl: { marginVertical: base['2xl'] },

  p_xs: { padding: base.xs },
  p_sm: { padding: base.sm },
  p_md: { padding: base.md },
  p_lg: { padding: base.lg },
  p_xl: { padding: base.xl },
  p_2xl: { padding: base['2xl'] },

  pt_xs: { paddingTop: base.xs },
  pt_sm: { paddingTop: base.sm },
  pt_md: { paddingTop: base.md },
  pt_lg: { paddingTop: base.lg },
  pt_xl: { paddingTop: base.xl },
  pt_2xl: { paddingTop: base['2xl'] },

  pb_xs: { paddingBottom: base.xs },
  pb_sm: { paddingBottom: base.sm },
  pb_md: { paddingBottom: base.md },
  pb_lg: { paddingBottom: base.lg },
  pb_xl: { paddingBottom: base.xl },
  pb_2xl: { paddingBottom: base['2xl'] },

  pl_xs: { paddingLeft: base.xs },
  pl_sm: { paddingLeft: base.sm },
  pl_md: { paddingLeft: base.md },
  pl_lg: { paddingLeft: base.lg },
  pl_xl: { paddingLeft: base.xl },
  pl_2xl: { paddingLeft: base['2xl'] },

  pr_xs: { paddingRight: base.xs },
  pr_sm: { paddingRight: base.sm },
  pr_md: { paddingRight: base.md },
  pr_lg: { paddingRight: base.lg },
  pr_xl: { paddingRight: base.xl },
  pr_2xl: { paddingRight: base['2xl'] },

  px_xs: { paddingHorizontal: base.xs },
  px_sm: { paddingHorizontal: base.sm },
  px_md: { paddingHorizontal: base.md },
  px_lg: { paddingHorizontal: base.lg },
  px_xl: { paddingHorizontal: base.xl },
  px_2xl: { paddingHorizontal: base['2xl'] },

  py_xs: { paddingVertical: base.xs },
  py_sm: { paddingVertical: base.sm },
  py_md: { paddingVertical: base.md },
  py_lg: { paddingVertical: base.lg },
  py_xl: { paddingVertical: base.xl },
  py_2xl: { paddingVertical: base['2xl'] },
} as const satisfies Record<string, ViewStyle>;
