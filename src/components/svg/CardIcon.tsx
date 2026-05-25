import React from 'react';
import { View } from 'react-native';
import FA6Icon from 'react-native-vector-icons/FontAwesome6';
import { CardIconName } from '@/utils/cardTranslations';
import {
  EssenciaIcon,
  CoringaIcon,
  ComprarIcon,
  RoubarIcon,
  ComprarRoubarIcon,
  BloqueiaRouboIcon,
  BloqueiaCompraIcon,
  RefletirIcon,
  ArmadilhaIcon,
  BuracoNegroIcon,
  VorticeIcon,
  ReciclarIcon,
  PoderExtraIcon,
  NulificarIcon,
  TrocarLivreIcon,
} from './svgIcons';

interface CardIconProps {
  iconName: CardIconName;
  color: string;
  /** Cor do texto para ícones de Comprar/Roubar. Default: '#FFFFFF'. */
  textColor?: string;
  size?: number;
}

export function CardIcon({
  iconName,
  color,
  textColor = '#FFFFFF',
  size = 40,
}: CardIconProps) {
  const scale = size / 80;

  // ComprarIcon/RoubarIcon (+2): visual de dois retângulos sobrepostos
  if (iconName === 'ComprarIcon' || iconName === 'RoubarIcon') {
    const Icon = iconName === 'ComprarIcon' ? ComprarIcon : RoubarIcon;
    return (
      <View
        style={{
          width: size,
          height: size,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ transform: [{ scale }], width: 80, height: 80 }}>
          <Icon color={color} textColor={textColor} />
        </View>
      </View>
    );
  }

  // ComprarUmIcon/RoubarUmIcon (+1): retângulo único
  if (iconName === 'ComprarUmIcon' || iconName === 'RoubarUmIcon') {
    return (
      <ComprarRoubarIcon
        color={color}
        label="+1"
        textColor={textColor}
        size={size}
      />
    );
  }

  // FontAwesome6 — Trocar Próximo/Anterior
  if (iconName === 'TrocarProximoIcon') {
    return (
      <View
        style={{
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FA6Icon name="arrow-rotate-left" size={size * 0.7} color="#FFFFFF" />
      </View>
    );
  }
  if (iconName === 'TrocarAnteriorIcon') {
    return (
      <View
        style={{
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FA6Icon name="arrow-rotate-right" size={size * 0.7} color="#FFFFFF" />
      </View>
    );
  }

  // SVGs escalados via transform scale
  const icon = (() => {
    switch (iconName) {
      case 'EssenciaIcon':
        return <EssenciaIcon color={color} />;
      case 'CoringaIcon':
        return <CoringaIcon />;
      case 'BloqueiaRouboIcon':
        return <BloqueiaRouboIcon />;
      case 'BloqueiaCompraIcon':
        return <BloqueiaCompraIcon />;
      case 'RefletirIcon':
        return <RefletirIcon />;
      case 'ArmadilhaIcon':
        return <ArmadilhaIcon />;
      case 'BuracoNegroIcon':
        return <BuracoNegroIcon color={color} />;
      case 'VorticeIcon':
        return <VorticeIcon color={color} />;
      case 'ReciclarIcon':
        return <ReciclarIcon color={color} />;
      case 'PoderExtraIcon':
        return <PoderExtraIcon color={color} />;
      case 'NulificarIcon':
        return <NulificarIcon />;
      case 'TrocarLivreIcon':
        return <TrocarLivreIcon />;
      default:
        return <EssenciaIcon color={color} />;
    }
  })();

  return (
    <View
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ transform: [{ scale }], width: 80, height: 80 }}>
        {icon}
      </View>
    </View>
  );
}
