import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { InputShape } from '../InputShape';

const INPUT_HEIGHT = 40;

type InputProps = {
  withCustomFormat?: boolean;
  rightIcon?: React.ReactNode;
  error?: string;
} & TextInputProps;

export default function Input({
  withCustomFormat = false,
  rightIcon,
  error,
  ...props
}: InputProps) {
  const { colors, fonts, gutters, layout, spacing } = useTheme();
  const [width, setWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(INPUT_HEIGHT);

  const finalHeight = props.multiline
    ? Math.max(INPUT_HEIGHT, contentHeight)
    : INPUT_HEIGHT;

  const textInputStyle: StyleProp<TextStyle> = {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.family.aldrich,
    fontSize: fonts.size.md,
    ...(props.multiline
      ? {
          textAlignVertical: 'center',
          marginTop: -6, // Puxa o input multiline pra cima pra casar exatamente com o simples
        }
      : {}),
  };

  return (
    <View>
      <View
        style={[
          {
            height: finalHeight,
          },
        ]}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {withCustomFormat ? (
          <View style={styles.absFill}>
            {width > 0 && <InputShape width={width} height={finalHeight} />}
          </View>
        ) : (
          <View
            style={[
              styles.absFill,
              { backgroundColor: colors.surface, borderRadius: gutters.sm },
            ]}
          />
        )}

        <View
          style={[
            layout.row,
            layout.itemsCenter,
            layout.justifyCenter,
            spacing.px_xl,
            styles.absFill,
          ]}
        >
          <TextInput
            style={textInputStyle}
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.accent}
            multiline={props.multiline}
            onContentSizeChange={(e) => {
              if (props.multiline) {
                setContentHeight(e.nativeEvent.contentSize.height);
              }
              props.onContentSizeChange && props.onContentSizeChange(e);
            }}
            {...props}
          />

          {rightIcon && <View>{rightIcon}</View>}
        </View>
      </View>

      {error && (
        <Text
          style={[
            {
              color: colors.error,
              fontSize: fonts.size.xs,
              fontFamily: fonts.family.aldrich,
            },
            spacing.mt_xs,
            spacing.ml_sm,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  absFill: {
    ...StyleSheet.absoluteFillObject,
  },
});
