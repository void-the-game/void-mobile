import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Ellipse,
  G,
  ClipPath,
  Line,
  Text as SvgText,
} from 'react-native-svg';

interface CardBackProps {
  rotation: number;
  offsetX?: number;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export function CardBack({
  rotation,
  offsetX = 0,
  style,
  width = 45,
  height = 65,
}: CardBackProps) {
  const centerY = 32.5;
  const oY = centerY + 2.7;
  const centerX = 22.5;
  const gap = 10.5;

  const vX = centerX - gap * 1.5;
  const oX = centerX - gap * 0.5;
  const iX = centerX + gap * 0.5;
  const dX = centerX + gap * 1.5;

  return (
    <View
      testID="card-back"
      style={[
        styles.card,
        {
          width,
          height,
          transform: [{ translateX: offsetX }, { rotate: `${rotation}deg` }],
        },
        style,
      ]}
    >
      <Svg width={width} height={height} viewBox="0 0 45 65">
        <Defs>
          <RadialGradient id="bg" cx="50%" cy="46%" r="60%">
            <Stop offset="0%" stopColor="#0A0A14" />
            <Stop offset="100%" stopColor="#010108" />
          </RadialGradient>

          <RadialGradient id="miniDisk" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFBEA" stopOpacity="1" />
            <Stop offset="35%" stopColor="#FCD34D" stopOpacity="0.9" />
            <Stop offset="70%" stopColor="#F97316" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="miniPhoton" cx="50%" cy="50%" r="50%">
            <Stop offset="60%" stopColor="#FDE68A" stopOpacity="0" />
            <Stop offset="80%" stopColor="#FCD34D" stopOpacity="0.8" />
            <Stop offset="88%" stopColor="#FFFBEA" stopOpacity="1" />
            <Stop offset="96%" stopColor="#FCD34D" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="miniHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="40%" stopColor="#F97316" stopOpacity="0" />
            <Stop offset="75%" stopColor="#FCD34D" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="blackCore" cx="50%" cy="50%" r="50%">
            <Stop offset="70%" stopColor="#000000" stopOpacity="1" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>

          <LinearGradient id="topEdge" x1="0" y1="0" x2="45" y2="0">
            <Stop offset="0%" stopColor="#F97316" stopOpacity="0" />
            <Stop offset="50%" stopColor="#FFFBEA" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </LinearGradient>

          <LinearGradient id="sideEdge" x1="0" y1="0" x2="0" y2="65">
            <Stop offset="0%" stopColor="#F97316" stopOpacity="0" />
            <Stop offset="50%" stopColor="#FFFBEA" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </LinearGradient>

          <ClipPath id="cardClip">
            <Rect x="0" y="0" width="45" height="65" rx="6" />
          </ClipPath>
        </Defs>

        <G clipPath="url(#cardClip)">
          <Rect x="0" y="0" width="45" height="65" fill="url(#bg)" />

          <Circle cx="4" cy="6" r="0.4" fill="#FFFFFF" fillOpacity="0.35" />
          <Circle cx="38" cy="9" r="0.35" fill="#FFFFFF" fillOpacity="0.3" />
          <Circle cx="10" cy="57" r="0.4" fill="#FFFFFF" fillOpacity="0.25" />
          <Circle cx="41" cy="55" r="0.45" fill="#FFFFFF" fillOpacity="0.35" />
          <Circle cx="2" cy="38" r="0.35" fill="#FFFFFF" fillOpacity="0.2" />
          <Circle cx="43" cy="28" r="0.3" fill="#FFFFFF" fillOpacity="0.25" />
          <Circle cx="22" cy="4" r="0.3" fill="#FFFFFF" fillOpacity="0.2" />
          <Circle cx="34" cy="61" r="0.35" fill="#FFFFFF" fillOpacity="0.25" />

          <Line
            x1="0.75"
            y1="5"
            x2="0.75"
            y2="60"
            stroke="url(#sideEdge)"
            strokeWidth="1.5"
          />
          <Line
            x1="44.25"
            y1="5"
            x2="44.25"
            y2="60"
            stroke="url(#sideEdge)"
            strokeWidth="1.5"
          />
          <Line
            x1="5"
            y1="0.75"
            x2="40"
            y2="0.75"
            stroke="url(#topEdge)"
            strokeWidth="1.5"
          />
          <Line
            x1="5"
            y1="64.25"
            x2="40"
            y2="64.25"
            stroke="url(#topEdge)"
            strokeWidth="1.5"
          />
          <Rect
            x="1.5"
            y="1.5"
            width="42"
            height="62"
            rx="5"
            fill="none"
            stroke="rgba(253,186,116,0.18)"
            strokeWidth="0.75"
          />

          <SvgText
            x={vX}
            y={centerY}
            textAnchor="middle"
            alignmentBaseline="middle"
            dy="0.35em"
            fontSize="10"
            fontWeight="900"
            fill="rgba(253,230,138,0.9)"
            fontFamily="monospace"
          >
            V
          </SvgText>

          <Circle cx={oX} cy={oY} r="6.1" fill="url(#miniHalo)" />
          <Ellipse
            cx={oX}
            cy={oY}
            rx="4.7"
            ry="1.35"
            fill="none"
            stroke="url(#miniDisk)"
            strokeWidth="1.35"
            strokeOpacity="0.92"
          />
          <Circle cx={oX} cy={oY} r="3.9" fill="url(#miniPhoton)" />
          <Circle cx={oX} cy={oY} r="3.25" fill="url(#blackCore)" />
          <Circle cx={oX} cy={oY} r="2.55" fill="#000000" />
          <Ellipse
            cx={oX}
            cy={oY}
            rx="4.1"
            ry="1.1"
            fill="none"
            stroke="rgba(125,211,252,0.35)"
            strokeWidth="0.55"
            strokeOpacity="0.5"
          />

          <SvgText
            x={iX}
            y={centerY}
            textAnchor="middle"
            alignmentBaseline="middle"
            dy="0.35em"
            fontSize="10"
            fontWeight="900"
            fill="rgba(253,230,138,0.9)"
            fontFamily="monospace"
          >
            I
          </SvgText>

          <SvgText
            x={dX}
            y={centerY}
            textAnchor="middle"
            alignmentBaseline="middle"
            dy="0.35em"
            fontSize="10"
            fontWeight="900"
            fill="rgba(253,230,138,0.9)"
            fontFamily="monospace"
          >
            D
          </SvgText>
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(253,186,116,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#010108',
  },
});
