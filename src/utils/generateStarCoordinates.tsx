import { Dimensions } from 'react-native';

type StarCoordinates = {
  quantity?: number;
  maxSize?: number;
};

export function generateStarCoordinates({
  quantity = 10,
  maxSize = 2,
}: StarCoordinates) {
  const { width, height } = Dimensions.get('window');

  return Array.from({ length: quantity }).map(() => ({
    top: Math.random() * height,
    left: Math.random() * width,
    size: Math.random() * maxSize + 1,
    opacity: Math.random() * 0.5 + 0.5,
  }));
}
