import React from 'react';
import Svg, {
  Circle,
  Path,
  Rect,
  Line,
  Text as SvgText,
} from 'react-native-svg';

export const EssenciaIcon = ({ color }: { color: string }) => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Circle cx="40" cy="40" r="20" fill={color} />
  </Svg>
);

export const CoringaIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Circle cx="40" cy="40" r="28" fill="#1F2937" opacity="0.8" />
    <Circle cx="40" cy="40" r="24" fill="#000000" opacity="0.6" />
    <Circle cx="40" cy="16" r="8" fill="#10B981" />
    <Circle cx="61.8" cy="28.2" r="8" fill="#3B82F6" />
    <Circle cx="53.6" cy="56.8" r="8" fill="#F59E0B" />
    <Circle cx="26.4" cy="56.8" r="8" fill="#A855F7" />
    <Circle cx="18.2" cy="28.2" r="8" fill="#FFFFFF" />
    <Path
      d="M 40 16 L 61.8 28.2 L 53.6 56.8 L 26.4 56.8 L 18.2 28.2 Z"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      opacity="0.3"
    />
    <Circle cx="40" cy="16" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="61.8" cy="28.2" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="53.6" cy="56.8" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="26.4" cy="56.8" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="18.2" cy="28.2" r="3" fill="#FFFFFF" opacity="0.6" />
    <Path
      d="M 35 32 Q 35 28 40 28 Q 45 28 45 32 Q 45 36 40 38 L 40 42"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle cx="40" cy="47" r="2" fill="#FFFFFF" />
  </Svg>
);

export const CoresIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Circle cx="40" cy="40" r="28" fill="#1F2937" opacity="0.8" />
    <Circle cx="40" cy="40" r="24" fill="#000000" opacity="0.6" />
    <Circle cx="40" cy="16" r="8" fill="#10B981" />
    <Circle cx="61.8" cy="28.2" r="8" fill="#3B82F6" />
    <Circle cx="53.6" cy="56.8" r="8" fill="#F59E0B" />
    <Circle cx="26.4" cy="56.8" r="8" fill="#A855F7" />
    <Circle cx="18.2" cy="28.2" r="8" fill="#FFFFFF" />
    <Path
      d="M 40 16 L 61.8 28.2 L 53.6 56.8 L 26.4 56.8 L 18.2 28.2 Z"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      opacity="0.3"
    />
    <Circle cx="40" cy="16" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="61.8" cy="28.2" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="53.6" cy="56.8" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="26.4" cy="56.8" r="3" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="18.2" cy="28.2" r="3" fill="#FFFFFF" opacity="0.6" />
  </Svg>
);

export const ArmadilhaIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect
      x="20"
      y="15"
      width="40"
      height="55"
      rx="4"
      fill="#FFFFFF"
      stroke="#D1D5DB"
      strokeWidth="2"
    />
    <Rect x="25" y="20" width="30" height="8" fill="#F59E0B" opacity="0.3" />
    <Path
      d="M 28 50 L 32 45 L 48 45 L 52 50 Z"
      fill="#4B5563"
      stroke="#1F2937"
      strokeWidth="1.5"
    />
    <Path
      d="M 32 45 L 34 40 L 36 45"
      fill="#6B7280"
      stroke="#1F2937"
      strokeWidth="1"
    />
    <Path
      d="M 37 45 L 39 40 L 41 45"
      fill="#6B7280"
      stroke="#1F2937"
      strokeWidth="1"
    />
    <Path
      d="M 42 45 L 44 40 L 46 45"
      fill="#6B7280"
      stroke="#1F2937"
      strokeWidth="1"
    />
    <Path
      d="M 28 38 L 32 43 L 48 43 L 52 38 Z"
      fill="#4B5563"
      stroke="#1F2937"
      strokeWidth="1.5"
    />
    <Path
      d="M 32 43 L 34 48 L 36 43"
      fill="#6B7280"
      stroke="#1F2937"
      strokeWidth="1"
    />
    <Path
      d="M 37 43 L 39 48 L 41 43"
      fill="#6B7280"
      stroke="#1F2937"
      strokeWidth="1"
    />
    <Path
      d="M 42 43 L 44 48 L 46 43"
      fill="#6B7280"
      stroke="#1F2937"
      strokeWidth="1"
    />
    <Circle
      cx="40"
      cy="44"
      r="3"
      fill="#F59E0B"
      stroke="#D97706"
      strokeWidth="1.5"
    />
    <Circle cx="40" cy="40" r="22" fill="rgba(245, 158, 11, 0.75)" />
    <Path
      d="M 40 30 L 43 42 L 37 42 Z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Circle cx="40" cy="47" r="2" fill="#FFFFFF" />
    <Circle
      cx="40"
      cy="40"
      r="22"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
    />
  </Svg>
);

export const BloqueiaRouboIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect
      x="20"
      y="15"
      width="40"
      height="55"
      rx="4"
      fill="#FFFFFF"
      stroke="#D1D5DB"
      strokeWidth="2"
    />
    <Rect x="25" y="20" width="30" height="8" fill="#3B82F6" opacity="0.3" />
    <Circle cx="40" cy="42" r="14" fill="#000000ff" />
    <Circle cx="35" cy="40" r="2.5" fill="#becde1ff" />
    <Circle cx="45" cy="40" r="2.5" fill="#becde1ff" />
    <Path
      d="M 30 37 L 37 38"
      stroke="#becde1ff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M 50 37 L 43 38"
      stroke="#becde1ff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M 33 48 Q 40 52 47 48"
      stroke="#becde1ff"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <Rect x="25" y="58" width="30" height="4" fill="#D1D5DB" />
    <Rect x="25" y="64" width="20" height="3" fill="#D1D5DB" />
    <Circle cx="40" cy="40" r="22" fill="rgba(239, 68, 68, 0.75)" />
    <Line
      x1="25"
      y1="25"
      x2="55"
      y2="55"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <Circle
      cx="40"
      cy="40"
      r="22"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
    />
  </Svg>
);

export const BloqueiaCompraIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect
      x="20"
      y="15"
      width="40"
      height="55"
      rx="4"
      fill="#FFFFFF"
      stroke="#D1D5DB"
      strokeWidth="2"
    />
    <Rect x="25" y="20" width="30" height="8" fill="#3B82F6" opacity="0.3" />
    <Rect x="25" y="32" width="30" height="4" fill="#D1D5DB" />
    <Rect x="25" y="40" width="30" height="4" fill="#D1D5DB" />
    <Rect x="25" y="48" width="20" height="4" fill="#D1D5DB" />
    <Path
      d="M 40 30 L 40 50 M 30 40 L 50 40"
      stroke="#000000ff"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.5"
    />
    <Circle cx="40" cy="40" r="22" fill="rgba(239, 68, 68, 0.75)" />
    <Line
      x1="25"
      y1="25"
      x2="55"
      y2="55"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <Circle
      cx="40"
      cy="40"
      r="22"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
    />
  </Svg>
);

export const RefletirIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect
      x="20"
      y="10"
      width="40"
      height="30"
      rx="4"
      fill="#FFFFFF"
      stroke="#D1D5DB"
      strokeWidth="2"
    />
    <Rect x="25" y="14" width="30" height="6" fill="#8B5CF6" opacity="0.3" />
    <Rect x="25" y="23" width="30" height="3" fill="#D1D5DB" />
    <Rect x="25" y="29" width="20" height="3" fill="#D1D5DB" />
    <Line x1="15" y1="43" x2="65" y2="43" stroke="#3bc7faff" strokeWidth="3" />
    <Line
      x1="15"
      y1="43"
      x2="65"
      y2="43"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      opacity="0.8"
    />
    <Rect
      x="20"
      y="46"
      width="40"
      height="30"
      rx="4"
      fill="#FFFFFF"
      stroke="#D1D5DB"
      strokeWidth="2"
      opacity="0.6"
    />
    <Rect x="25" y="66" width="30" height="6" fill="#8B5CF6" opacity="0.2" />
    <Rect x="25" y="54" width="20" height="3" fill="#D1D5DB" opacity="0.6" />
    <Rect x="25" y="60" width="30" height="3" fill="#D1D5DB" opacity="0.6" />
    <Circle cx="20" cy="43" r="2" fill="#FFFFFF" opacity="0.6" />
    <Circle cx="60" cy="43" r="2" fill="#FFFFFF" opacity="0.6" />
    <Line
      x1="35"
      y1="42"
      x2="38"
      y2="44"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
    <Line
      x1="45"
      y1="42"
      x2="42"
      y2="44"
      stroke="#ffffffff"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </Svg>
);

/**
 * Ícone de Comprar/Roubar com fundo colorido e texto +1/+2.
 * textColor controla a cor do texto — passe '#000000' para fundos claros.
 */
export const ComprarRoubarIcon = ({
  color,
  label,
  textColor = '#FFFFFF',
  size = 80,
}: {
  color: string;
  label: '+1' | '+2';
  textColor?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 80 80">
    <Rect x="22.5" y="15" width="35" height="50" rx="4" fill={color} />
    <SvgText
      x="40"
      y="48"
      fontSize="26"
      fill={textColor}
      fontWeight="bold"
      textAnchor="middle"
    >
      {label}
    </SvgText>
  </Svg>
);

/**
 * Ícone de Comprar +2: dois retângulos sobrepostos (visual original do tutorial).
 * Usado como alias para manter compatibilidade com TutorialScreen.
 */
export const ComprarIcon = ({
  color,
  textColor = '#FFFFFF',
}: {
  color: string;
  textColor?: string;
}) => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect
      x="15"
      y="25"
      width="35"
      height="45"
      rx="3"
      fill={color}
      opacity="0.8"
    />
    <SvgText
      x="32.5"
      y="52"
      fontSize="18"
      fill={textColor}
      fontWeight="bold"
      textAnchor="middle"
    >
      +1
    </SvgText>
    <Rect x="30" y="20" width="35" height="45" rx="3" fill={color} />
    <SvgText
      x="47.5"
      y="47"
      fontSize="18"
      fill={textColor}
      fontWeight="bold"
      textAnchor="middle"
    >
      +2
    </SvgText>
  </Svg>
);

export const RoubarIcon = ({
  color,
  textColor = '#FFFFFF',
}: {
  color: string;
  textColor?: string;
}) => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect
      x="15"
      y="25"
      width="35"
      height="45"
      rx="3"
      fill={color}
      opacity="0.8"
    />
    <SvgText
      x="32.5"
      y="52"
      fontSize="18"
      fill={textColor}
      fontWeight="bold"
      textAnchor="middle"
    >
      +1
    </SvgText>
    <Rect x="30" y="20" width="35" height="45" rx="3" fill={color} />
    <SvgText
      x="47.5"
      y="47"
      fontSize="18"
      fill={textColor}
      fontWeight="bold"
      textAnchor="middle"
    >
      +2
    </SvgText>
  </Svg>
);

export const BuracoNegroIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Circle cx="40" cy="40" r="10" fill="#000000" />
    <Circle
      cx="40"
      cy="40"
      r="16"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      opacity="0.8"
    />
    <Circle
      cx="40"
      cy="40"
      r="22"
      fill="none"
      stroke={color}
      strokeWidth="2"
      opacity="0.5"
    />
    <Circle cx="30" cy="30" r="2" fill={color} opacity="0.7" />
    <Circle cx="50" cy="32" r="2" fill={color} opacity="0.7" />
    <Circle cx="28" cy="50" r="2" fill={color} opacity="0.7" />
    <Circle cx="52" cy="48" r="2" fill={color} opacity="0.7" />
    <Path
      d="M 22 40 Q 30 37 40 40"
      stroke={color}
      strokeWidth="1.8"
      fill="none"
      opacity="0.4"
    />
    <Path
      d="M 58 40 Q 50 43 40 40"
      stroke={color}
      strokeWidth="1.8"
      fill="none"
      opacity="0.4"
    />
  </Svg>
);

export const VorticeIcon = ({ color }: { color: string }) => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Circle cx="40" cy="40" r="20" fill="none" stroke={color} strokeWidth="3" />
    <Circle
      cx="40"
      cy="40"
      r="15"
      fill="none"
      stroke={color}
      strokeWidth="2"
      opacity="0.6"
    />
    <Circle
      cx="40"
      cy="40"
      r="10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      opacity="0.3"
    />
    <Circle
      cx="40"
      cy="40"
      r="5"
      fill="none"
      stroke={color}
      strokeWidth="2"
      opacity="0.3"
    />
  </Svg>
);

export const ReciclarIcon = ({ color }: { color: string }) => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect x="22.5" y="15" width="35" height="50" rx="3" fill={color} />
    <Circle
      cx="40"
      cy="40"
      r="14"
      fill="none"
      stroke="#000000"
      strokeWidth="2.5"
    />
    <SvgText
      x="40"
      y="41"
      fontSize="16"
      fill="#000000"
      fontWeight="bold"
      textAnchor="middle"
    >
      →
    </SvgText>
    <SvgText
      x="40"
      y="52"
      fontSize="16"
      fill="#000000"
      fontWeight="bold"
      textAnchor="middle"
    >
      ←
    </SvgText>
  </Svg>
);

export const PoderExtraIcon = ({ color }: { color: string }) => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Rect x="22.5" y="15" width="35" height="50" rx="3" fill={color} />
    <Circle
      cx="40"
      cy="40"
      r="15"
      stroke="#FFFFFF"
      strokeWidth="3"
      fill="none"
    />
    <Path
      d="M 43 26 L 35 40 L 41 40 L 37 54 L 45 40 L 39 40 Z"
      fill="#FFFFFF"
    />
  </Svg>
);

export const EstrelaDicasIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Path
      d="M 40 10 L 50 35 L 75 35 L 55 50 L 65 75 L 40 60 L 15 75 L 25 50 L 5 35 L 30 35 Z"
      fill="#FBBF24"
    />
  </Svg>
);

export const PlayersIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="7" r="3" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M3 19C3 15.686 5.686 13 9 13C12.314 13 15 15.686 15 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="17" cy="8" r="2.5" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M21 19C21 16.791 19.209 15 17 15C16.5 15 16 15.1 15.5 15.3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export const TimerIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M12 9V13L15 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M9 3H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 3V5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const CardsIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6C4 4.895 4.895 4 6 4H14C15.105 4 16 4.895 16 6V20C16 21.105 15.105 22 14 22H6C4.895 22 4 21.105 4 20V6Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M7 4C7 2.895 7.895 2 9 2H17C18.105 2 19 2.895 19 4V18C19 19.105 18.105 20 17 20H16"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M10 2C10 0.895 10.895 0 12 0H20C21.105 0 22 0.895 22 2V16C22 17.105 21.105 18 20 18H19"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

export const NulificarIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Path
      d="M 40 12 L 62 22 L 62 44 Q 62 60 40 70 Q 18 60 18 44 L 18 22 Z"
      fill="#1F2937"
      stroke="#FFFFFF"
      strokeWidth="3"
    />
    <Line
      x1="26"
      y1="26"
      x2="54"
      y2="54"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <Line
      x1="54"
      y1="26"
      x2="26"
      y2="54"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </Svg>
);

export const TrocarLivreIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80">
    <Line
      x1="32"
      y1="62"
      x2="32"
      y2="24"
      stroke="#FFFFFF"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <Path
      d="M 23 34 L 32 20 L 41 34"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="48"
      y1="18"
      x2="48"
      y2="56"
      stroke="#FFFFFF"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <Path
      d="M 39 46 L 48 60 L 57 46"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const AstronautIcon = ({
  color = '#E91E63',
  armColor,
  armStrokeColor,
  size = 80,
}: {
  color?: string;
  armColor?: string;
  armStrokeColor?: string;
  size?: number;
}) => {
  const arm = armColor ?? color;
  const armStroke = armStrokeColor ?? '#020202ff';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M 28 58 Q 10 80 12 95"
        stroke={arm}
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 28 58 Q 10 80 12 95"
        stroke={armStroke}
        strokeWidth="22"
        fill="none"
      />
      <Path
        d="M 72 58 Q 90 80 88 95"
        stroke={arm}
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 72 58 Q 90 80 88 95"
        stroke={armStroke}
        strokeWidth="22"
        fill="none"
      />
      <Path
        d="M 32 50 Q 24 54 24 68 Q 22 78 22 88 Q 22 94 24 98 L 24 100 L 76 100 L 76 98 Q 78 94 78 88 Q 78 78 76 68 Q 76 54 68 50 Q 62 46 50 46 Q 38 46 32 50 Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
      />
      <Rect
        x="38"
        y="52"
        width="24"
        height="3"
        rx="4"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
      />
      <Rect
        x="38"
        y="78"
        width="24"
        height="16"
        rx="2.5"
        fill="#000000ff"
        stroke="#1a1a1a"
        strokeWidth="2.5"
      />
      <Circle cx="42" cy="86" r="2.2" fill="#abababff" />
      <Circle cx="50" cy="86" r="2.2" fill="#abababff" />
      <Circle cx="58" cy="86" r="2.2" fill="#abababff" />
      <Circle
        cx="50"
        cy="28"
        r="26"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="3"
      />
      <Circle
        cx="50"
        cy="28"
        r="19"
        fill="#000000"
        stroke="#1a1a1a"
        strokeWidth="2.5"
      />
      <Circle cx="43" cy="22" r="6" fill="rgba(200, 200, 200, 0.7)" />
      <Circle cx="49" cy="25" r="3" fill="rgba(255, 255, 255, 0.5)" />
    </Svg>
  );
};
