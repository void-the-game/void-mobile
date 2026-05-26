export const CARD_TRANSLATIONS: Record<string, string> = {
  essence: 'Essência',
  joker: 'Coringa',
  black_hole: 'Buraco Negro',
  vortex: 'Vórtex',
  buy_plus_1: 'Compra +1',
  buy_plus_2: 'Compra +2',
  steal_next_1: 'Roubo Prox 1',
  steal_next_2: 'Roubo Prox 2',
  steal_prev_1: 'Roubo Ant 1',
  steal_prev_2: 'Roubo Ant 2',
  steal_any_1: 'Roubo Livre 1',
  trap: 'Armadilha',
  recycle: 'Reciclar',
  block_purchase: 'Bloqueia Compra',
  swap_next_hand: 'Trocar Prox',
  swap_prev_hand: 'Trocar Ant',
  swap_any_hand: 'Trocar Livre',
  extra_power: 'Poder Extra',
  block_steal: 'Bloqueia Roubo',
  reflect: 'Refletir',
  nullify: 'Anular',
};

export function translateCard(type: string): string {
  return CARD_TRANSLATIONS[type] || type;
}

export function translateLog(text: string): string {
  if (!text) return '';
  let translated = text;

  // Substituir os IDs das cartas pelos seus nomes
  Object.keys(CARD_TRANSLATIONS).forEach((key) => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    translated = translated.replace(regex, CARD_TRANSLATIONS[key]);
  });

  // Traduzir verbos e ações comuns em inglês que vêm do servidor
  translated = translated.replace(/\bplayed\b/g, 'jogou');
  translated = translated.replace(/\band targeted\b/g, 'e focou em');
  translated = translated.replace(/\btargeted\b/g, 'focou em');
  translated = translated.replace(/\btargeting\b/g, 'focando em');
  translated = translated.replace(/\bresponded with\b/g, 'reagiu usando');
  translated = translated.replace(/\bdrew a card\b/g, 'comprou uma carta');
  translated = translated.replace(/\bdrew\b/g, 'comprou');
  translated = translated.replace(/\bdiscarded\b/g, 'descartou');
  translated = translated.replace(
    /\bfailed to defend\b/g,
    'não conseguiu se defender',
  );
  translated = translated.replace(
    /\bsuccessfully defended\b/g,
    'se defendeu com sucesso',
  );
  translated = translated.replace(
    /\bwas forced to discard\b/g,
    'foi forçado a descartar',
  );
  translated = translated.replace(
    /\bthe attack was reflected\b/g,
    'o ataque foi refletido',
  );
  translated = translated.replace(
    /\bBlocked purchases for the next\b/g,
    'Compras bloqueadas pelo próximo',
  );
  translated = translated.replace(
    /\bor be stolen from\b/g,
    'ou terão 1 roubada',
  );
  translated = translated.replace(/\bmust choose\b/g, 'devem escolher');
  translated = translated.replace(
    /\bfrom discard pile\b/g,
    'da pilha de descarte',
  );
  translated = translated.replace(
    /\bSwapped hand with\b/g,
    'Trocou de mão com',
  );
  translated = translated.replace(
    /\bPlayed an Essence card\b/g,
    'Jogou uma carta Essência',
  );
  translated = translated.replace(
    /\b(activates when stolen from)\b/g,
    'Ativa efeito quando roubada',
  );
  translated = translated.replace(/\bSet a Trap\b/g, 'Jogou uma Armadilha');
  translated = translated.replace(/\bdiscard\b/g, 'descartar');
  translated = translated.replace(/\breceived\b/g, 'recebeu');
  translated = translated.replace(/\bpulled\b/g, 'puxou');
  translated = translated.replace(/\bstole\b/g, 'roubou');
  translated = translated.replace(/\bfrom\b/g, 'de');
  translated = translated.replace(/\bto\b/g, 'para');
  translated = translated.replace(/\bcard\b/g, 'carta');
  translated = translated.replace(/\bcards\b/g, 'cartas');
  translated = translated.replace(/\brandom\b/g, 'aleatória(s)');
  translated = translated.replace(/\bopponent\b/g, 'oponente');
  translated = translated.replace(/\bopponents\b/g, 'oponentes');
  translated = translated.replace(/\bturn\b/g, 'turno');
  translated = translated.replace(/\bSteal\b/g, 'Roubou');
  translated = translated.replace(/\brecovered\b/g, 'Recuperou');
  translated = translated.replace(/\bRecycled\b/g, 'Reciclou');

  translated = translated.replace(/\bExtra Power\b/g, 'Poder Extra');
  translated = translated.replace(/\bBlack Hole\b/g, 'Buraco Negro');

  // Cores
  translated = translated.replace(/\bYellow\b/g, 'Amarelo');
  translated = translated.replace(/\bPurple\b/g, 'Roxo');
  translated = translated.replace(/\bBlue\b/g, 'Azul');
  translated = translated.replace(/\bGreen\b/g, 'Verde');

  translated = translated.replace(/\byellow\b/g, 'amarelo');
  translated = translated.replace(/\bpurple\b/g, 'roxo');
  translated = translated.replace(/\bblue\b/g, 'azul');
  translated = translated.replace(/\bgreen\b/g, 'verde');

  return translated;
}

// ─── Mapeamento CardType → ícone SVG ─────────────────────────────────────────
// Retorna o nome do componente de ícone correspondente ao tipo de carta.
// Usado pelo PlayerArea e TableArea para renderizar o ícone correto em cada carta.
export type CardIconName =
  | 'EssenciaIcon'
  | 'CoringaIcon'
  | 'ComprarIcon'
  | 'ComprarUmIcon'
  | 'RoubarIcon'
  | 'RoubarUmIcon'
  | 'BloqueiaRouboIcon'
  | 'BloqueiaCompraIcon'
  | 'RefletirIcon'
  | 'ArmadilhaIcon'
  | 'BuracoNegroIcon'
  | 'VorticeIcon'
  | 'ReciclarIcon'
  | 'PoderExtraIcon'
  | 'NulificarIcon'
  | 'TrocarProximoIcon'
  | 'TrocarAnteriorIcon'
  | 'TrocarLivreIcon';

export const CARD_ICON_MAP: Record<string, CardIconName> = {
  essence: 'EssenciaIcon',
  joker: 'CoringaIcon',
  buy_plus_1: 'ComprarUmIcon',
  buy_plus_2: 'ComprarIcon',
  steal_next_1: 'RoubarUmIcon',
  steal_next_2: 'RoubarIcon',
  steal_prev_1: 'RoubarUmIcon',
  steal_prev_2: 'RoubarIcon',
  steal_any_1: 'RoubarUmIcon',
  block_steal: 'BloqueiaRouboIcon',
  block_purchase: 'BloqueiaCompraIcon',
  reflect: 'RefletirIcon',
  trap: 'ArmadilhaIcon',
  black_hole: 'BuracoNegroIcon',
  vortex: 'VorticeIcon',
  recycle: 'ReciclarIcon',
  extra_power: 'PoderExtraIcon',
  nullify: 'NulificarIcon',
  swap_next_hand: 'TrocarProximoIcon',
  swap_prev_hand: 'TrocarAnteriorIcon',
  swap_any_hand: 'TrocarLivreIcon',
};

/** Cores de fundo claras (do servidor) que precisam de texto preto */
const LIGHT_CARD_COLORS = new Set([
  'yellow',
  'white',
  '#F59E0B',
  '#D1D5DB',
  '#FBBF24',
]);

export function getCardIconName(type: string): CardIconName {
  return CARD_ICON_MAP[type] ?? 'EssenciaIcon';
}

/** Retorna '#000000' para cores claras, '#FFFFFF' para escuras */
export function getCardTextColor(color: string): string {
  return LIGHT_CARD_COLORS.has(color) ? '#000000' : '#FFFFFF';
}
