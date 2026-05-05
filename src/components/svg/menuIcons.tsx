import React from 'react';
import Svg, {
  Path, Circle, Line, Ellipse, Polygon,
  Defs, RadialGradient, Stop, G
} from 'react-native-svg';

type IconProps = { color?: string; size?: number };

// Encontrar partida — radar espacial com ondas e nave
export function FindMatchIcon({ color = '#3B82F6', size = 48 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Ondas de radar */}
      <Circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      <Circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <Circle cx="24" cy="24" r="8"  stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />
      {/* Cruz de mira */}
      <Line x1="24" y1="4"  x2="24" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="24" y1="32" x2="24" y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="4"  y1="24" x2="16" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="32" y1="24" x2="44" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Nave no centro */}
      <Polygon points="24,19 27,27 24,25 21,27" fill={color} />
      {/* Ponto de sinal detectado */}
      <Circle cx="34" cy="14" r="2.5" fill={color} strokeOpacity="0.9" />
      <Circle cx="34" cy="14" r="4"   stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    </Svg>
  );
}

// Criar partida — portal/buraco negro com anel orbital
export function CreateMatchIcon({ color = '#E91E63', size = 48 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Anel orbital externo */}
      <Ellipse cx="24" cy="24" rx="20" ry="7" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
      <Ellipse cx="24" cy="24" rx="20" ry="7"
        stroke={color} strokeWidth="1.5"
        strokeDasharray="8 4"
        strokeOpacity="0.8"
      />
      {/* Núcleo do portal */}
      <Circle cx="24" cy="24" r="10" stroke={color} strokeWidth="2" />
      <Circle cx="24" cy="24" r="6"  fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1" />
      <Circle cx="24" cy="24" r="3"  fill={color} />
      {/* Raios de energia */}
      <Line x1="24" y1="14" x2="24" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="24" y1="30" x2="24" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="14" y1="24" x2="18" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="30" y1="24" x2="34" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Satélite orbital */}
      <Circle cx="44" cy="24" r="2.5" fill={color} />
    </Svg>
  );
}

// Tutoriais — satélite com painel solar e sinal
export function TutorialsIcon({ color = '#A855F7', size = 56 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Base da plataforma holográfica */}
      <Path d="M14 36 H34 L36 40 H12 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
      {/* Coluna de luz */}
      <Path d="M20 36 L18 14 H30 L28 36 Z" stroke={color} strokeWidth="1" strokeLinejoin="round" fill={color} fillOpacity="0.05" strokeOpacity="0.4" />
      {/* Livro holográfico flutuando */}
      <Path
        d="M16 18 C16 18 20 16 24 18 C28 16 32 18 32 18 V30 C32 30 28 28 24 30 C20 28 16 30 16 30 Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"
        fill={color} fillOpacity="0.1"
      />
      {/* Lombada central */}
      <Line x1="24" y1="18" x2="24" y2="30" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Linhas de texto holográfico */}
      <Line x1="18" y1="21" x2="23" y2="20" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <Line x1="18" y1="24" x2="23" y2="23" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <Line x1="18" y1="27" x2="23" y2="26" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <Line x1="25" y1="20" x2="30" y2="21" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <Line x1="25" y1="23" x2="30" y2="24" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <Line x1="25" y1="26" x2="30" y2="27" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      {/* Partículas flutuando */}
      <Circle cx="16" cy="12" r="1"   fill={color} fillOpacity="0.5" />
      <Circle cx="24" cy="10" r="1.5" fill={color} fillOpacity="0.7" />
      <Circle cx="32" cy="12" r="1"   fill={color} fillOpacity="0.5" />
      {/* Arco de energia no topo */}
      <Path d="M20 14 Q24 10 28 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
    </Svg>
  );
}

// Recompensas diárias
export function RewardsIcon({ color = '#EF4444', size = 48 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Brilhos de fundo */}
      <Circle cx="8"  cy="6"  r="1"   fill={color} fillOpacity="0.3" />
      <Circle cx="40" cy="9"  r="1.5" fill={color} fillOpacity="0.35" />
      <Circle cx="42" cy="38" r="1"   fill={color} fillOpacity="0.25" />
      <Circle cx="6"  cy="36" r="1.2" fill={color} fillOpacity="0.25" />

      {/* Alça esquerda */}
      <Path
        d="M16 11 C9 11 6 17 8 22 C9.5 25 13 26.5 16 27"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* Alça direita */}
      <Path
        d="M32 11 C39 11 42 17 40 22 C38.5 25 35 26.5 32 27"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
      />

      {/* Corpo principal */}
      <Path
        d="M15 7 H33 V24 C33 31 29 36 24 36 C19 36 15 31 15 24 Z"
        fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" strokeLinejoin="round"
      />

      {/* Brilho lateral esquerdo do corpo */}
      <Path
        d="M17 10 C17 10 15 16 16 22"
        stroke={color} strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" fill="none"
      />

      {/* Coroa no topo */}
      <Path
        d="M17 7 L19 11 L24 8 L29 11 L31 7"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none"
      />

      {/* Estrela central com brilho */}
      <Path
        d="M24 15 L25.8 20.5 L31.5 20.5 L26.8 23.8 L28.5 29.5 L24 26 L19.5 29.5 L21.2 23.8 L16.5 20.5 L22.2 20.5 Z"
        fill={color} fillOpacity="0.5" stroke={color} strokeWidth="0.8" strokeLinejoin="round"
      />
      {/* Brilho da estrela */}
      <Circle cx="22.5" cy="19" r="1" fill={color} fillOpacity="0.6" />

      {/* Haste */}
      <Path
        d="M24 36 L24 41"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
      />

      {/* Base com detalhe */}
      <Path
        d="M15 44 H33"
        stroke={color} strokeWidth="3" strokeLinecap="round"
      />
      <Path
        d="M18 41 H30"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"
      />
    </Svg>
  );
}

// Missões
export function MissionsIcon({ color = '#F59E0B', size = 48 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Corpo do foguete */}
      <Path d="M24 6 C24 6 32 14 32 26 L24 30 L16 26 C16 14 24 6 24 6Z"
        stroke={color} strokeWidth="2" strokeLinejoin="round"
        fill={color} fillOpacity="0.1"
      />
      {/* Janela */}
      <Circle cx="24" cy="18" r="3.5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2" />
      {/* Aletas */}
      <Path d="M16 26 L10 34 L16 32 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
      <Path d="M32 26 L38 34 L32 32 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
      {/* Chamas */}
      <Path d="M20 31 Q22 38 24 42 Q26 38 28 31"
        stroke={color} strokeWidth="1.5" strokeLinecap="round"
        fill={color} fillOpacity="0.15"
      />
      <Path d="M22 33 Q24 37 26 33"
        stroke={color} strokeWidth="1" strokeLinecap="round"
        fill={color} fillOpacity="0.3"
      />
      {/* Estrelas de fundo */}
      <Circle cx="8"  cy="10" r="1" fill={color} fillOpacity="0.5" />
      <Circle cx="40" cy="16" r="1" fill={color} fillOpacity="0.5" />
      <Circle cx="10" cy="38" r="1" fill={color} fillOpacity="0.3" />
      <Circle cx="38" cy="8"  r="1.5" fill={color} fillOpacity="0.4" />
    </Svg>
  );
}