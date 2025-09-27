import React from 'react';
import {
  Image,
  StyleSheet,
  type ImageStyle,
  type StyleProp,
} from 'react-native';

const HEADER_WIDTH = 320;

type VoidHeaderProps = {
  style?: StyleProp<ImageStyle>;
};

export default function VoidHeader({ style }: VoidHeaderProps) {
  return (
    <Image
      source={require('@/assets/images/void-header.webp')}
      style={[styles.image, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: HEADER_WIDTH,
  },
});
