import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import {
  EssenciaIcon,
  CoringaIcon,
  CoresIcon,
  ArmadilhaIcon,
  BloqueiaRouboIcon,
  BloqueiaCompraIcon,
  RefletirIcon,
  ComprarIcon,
  RoubarIcon,
  BuracoNegroIcon,
  VorticeIcon,
  ReciclarIcon,
  PoderExtraIcon,
  PlayersIcon,
  TimerIcon,
  CardsIcon,
} from 'src/components/svg/svgIcons';

const { width } = Dimensions.get('window');

type TutorialNavigation = StackNavigationProp<
  RootStackParamList,
  Paths.Tutorial
>;
type TutorialRoute = RouteProp<RootStackParamList, Paths.Tutorial>;

const TutorialScreen = () => {
  const navigation = useNavigation<TutorialNavigation>();
  const route = useRoute<TutorialRoute>();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      // Índice 0
      title: 'Bem-vindo ao Void',
      icon: <EssenciaIcon color="#3B82F6" />,
      content: {
        description:
          'Void é um jogo de cartas espacial onde você disputa com outros jogadores para ser o último sobrevivente com cartas na mão!',
        items: [
          {
            label: '2-4 Jogadores',
            icon: <PlayersIcon color="#60A5FA" size={32} />,
          },
          {
            label: ' Partidas de 5-15 minutos',
            icon: <TimerIcon color="#60A5FA" size={32} />,
          },
          { label: '86 cartas', icon: <CardsIcon color="#60A5FA" size={32} /> },
        ],
      },
    },
    {
      // Índice 1
      title: 'Objetivo do Jogo',
      icon: <EssenciaIcon color="#3B82F6" />,
      content: {
        main: 'Seja o Último Sobrevivente!',
        description:
          'O objetivo é ser o último jogador com cartas na mão. Quando suas cartas acabam, você é eliminado... mas cuidado, você tem UMA chance de voltar!',
        warning:
          '⚠️ Eliminação: Quando você ficar sem cartas, será eliminado. Na sua próxima vez, você compra 3 cartas e volta ao jogo (se ainda houver cartas no monte).',
      },
    },
    {
      // Índice 2
      title: 'Cores das Cartas',
      icon: <CoresIcon />,
      content: {
        description: 'As cartas são divididas em 5 cores principais:',
        colors: [
          { name: 'AZUL', color: '#3B82F6' },
          { name: 'VERDE', color: '#10B981' },
          { name: 'AMARELO', color: '#F59E0B' },
          { name: 'ROXO', color: '#A855F7' },
          { name: 'BRANCO (sem cor)', color: '#D1D5DB' },
        ],
      },
    },
    {
      // Índice 3
      title: 'Como Jogar',
      content: {
        sections: [
          {
            title: 'Início do Jogo',
            items: [
              'Cada jogador recebe 7 cartas',
              'A ordem e direção do jogo será sorteada automaticamente de forma aleatória',
            ],
          },
          {
            title: 'No Seu Turno',
            items: [
              '1. Compre 1 carta do monte',
              '2. Jogue 1 carta da sua mão',
              '3. Resolva o efeito da carta',
            ],
          },
        ],
      },
    },
    {
      // Índice 4
      title: 'Cartas Básicas',
      content: {
        cards: [
          {
            title: 'Essência',
            icon: <EssenciaIcon color="#c5c5c5ff" />,
            desc: 'Sem efeito especial. Use com Poderes Extra para ativá-los!',
            color: '#c5c5c5ff',
          },
          {
            title: 'Coringa',
            icon: <CoringaIcon />,
            desc: 'Vale como qualquer essência do jogo!',
            color: '#A855F7',
          },
          {
            title: 'Comprar +1 / +2',
            icon: <ComprarIcon color="#10B981" />,
            desc: 'Você compra cartas do monte conforme indicado.',
            color: '#10B981',
          },
          {
            title: 'Reciclar',
            icon: <ReciclarIcon color="#F59E0B" />,
            desc: 'Jogue até 2 cartas e compre a mesma quantidade!',
            color: '#F59E0B',
          },
        ],
      },
    },
    {
      // Índice 5
      title: 'Cartas de Roubo',
      content: {
        cards: [
          {
            title: 'Roubar 1 / Roubar 2',
            icon: <RoubarIcon color="#EF4444" />,
            desc: 'Roube cartas do jogador anterior, próximo ou de qualquer jogador. Se o alvo tiver menos cartas, roube todas que ele tiver.',
            color: '#EF4444',
          },
          {
            title: 'Bloqueia Roubo',
            icon: <BloqueiaRouboIcon />,
            desc: 'Jogue FORA DO SEU TURNO quando alguém tentar roubar suas cartas!',
            color: '#ffffffff',
          },
          {
            title: 'Refletir',
            icon: <RefletirIcon />,
            desc: 'Jogue FORA DO SEU TURNO para inverter um roubo - você rouba do atacante!',
            color: '#A855F7',
          },
          {
            title: 'Armadilha',
            icon: <ArmadilhaIcon />,
            desc: 'Quando alguém rouba esta carta, ela é descartada junto com mais uma carta do ladrão!',
            color: '#F97316',
          },
        ],
        warning:
          '⚠️ Descartar uma carta NÃO ativa seu efeito - você precisa jogá-la!',
      },
    },
    {
      // Índice 6
      title: 'Cartas Especiais',
      content: {
        cards: [
          {
            title: 'Buraco Negro',
            icon: <BuracoNegroIcon color="#ffffff" />,
            desc: 'Todos os oponentes descartam 1 carta da cor designada. Se não tiverem, descartam 2 cartas!',
            color: '#FFFFFF',
          },
          {
            title: 'Vórtice',
            icon: <VorticeIcon color="#6366F1" />,
            desc: 'Todos descartam 1 carta da cor designada. Se não tiverem, VOCÊ rouba 1 carta deles!',
            color: '#6366F1',
          },
          {
            title: 'Bloqueia Compras',
            icon: <BloqueiaCompraIcon />,
            desc: 'Oponentes não podem comprar do monte por 1 turno (Poder Extra e Reciclar funcionam).',
            color: '#EF4444',
          },
        ],
      },
    },
    {
      // Índice 7
      title: 'Poderes Extra',
      content: {
        description:
          'Os Poderes Extra possuem dois efeitos: o efeito base e o efeito adicional. O efeito adicional só é ativado se for jogado junto com uma Essência da cor correspondente ou com uma Essência Coringa!',
        powers: [
          {
            title: 'Poder Extra Azul',
            icon: <PoderExtraIcon color="#3B82F6" />,
            desc: 'Compre 2 cartas. Se jogada junto a uma Essência Azul, compre 3 cartas em vez disso.',
            color: '#3B82F6',
          },
          {
            title: 'Poder Extra Amarelo',
            icon: <PoderExtraIcon color="#F59E0B" />,
            desc: 'Escolha um adversário e roube 1 carta (imune). Se jogada junto a uma Essência Amarela, roube 3 cartas em vez disso.',
            color: '#F59E0B',
          },
          {
            title: 'Poder Extra Verde',
            icon: <PoderExtraIcon color="#10B981" />,
            desc: 'Pegue a última carta descartada. Se jogada junto a uma Essência Verde, pegue as 3 últimas cartas descartadas.',
            color: '#10B981',
          },
          {
            title: 'Poder Extra Roxo',
            icon: <PoderExtraIcon color="#A855F7" />,
            desc: 'Cada oponente deve descartar 1 carta. Se jogada junto a uma Essência Roxa, cada oponente deve descartar 3 cartas.',
            color: '#A855F7',
          },
        ],
        warning: '⚠️ Poderes Extra NÃO podem ser bloqueados ou refletidos!',
      },
    },
    {
      // Índice 8
      title: 'Dicas Estratégicas!',

      content: {
        sections: [
          {
            title: '✅ Faça',
            items: [
              'Guarde cartas de defesa (Bloquear, Refletir)',
              'Combine Essências com Poderes Extra',
              'Use Armadilhas quando tiver muitas cartas',
              'Observe quantas cartas cada jogador tem',
            ],
          },
          {
            title: '❌ Evite',
            items: [
              'Jogar todas suas defesas cedo demais',
              'Jogar todas as suas cartas de roubo cedo demais',
              'Guardar cartas boas por muito tempo, você pode ser roubado a qualquer instante!',
            ],
          },
          {
            title: '🎯 Estratégia Avançada!',
            items: [
              'Use Buraco Negro e Vórtice para forçar oponentes a descartarem cartas específicas',
              'Se puder, roube da pessoa com menos cartas, assim ela será eliminada rapidamente!',
            ],
          },
        ],
      },
    },
    {
      // Índice 9
      title: 'Você está pronto para jogar!',
      content: {
        description:
          'Agora que conhece as regras, é hora de entrar no vazio e provar que você é o melhor!',
        reminders: [
          '1. Seja o último com cartas na mão',
          '2. Compre primeiro, jogue depois',
          '3. Poderes Extra são imbloqueáveis',
          '4. Você tem UMA chance de voltar quando eliminado!',
        ],
      },
    },
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderContent = (page: any) => {
    const content = page.content;

    // Página 1: Bem-vindo (Index 0)
    if (currentPage === 0) {
      return (
        <View>
          <Text style={styles.description}>{content.description}</Text>
          <View style={styles.statsContainer}>
            {content.items.map((item: any, idx: number) => (
              <View key={idx} style={styles.statBox}>
                <View style={styles.statIconContainer}>{item.icon}</View>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    // Página 2: Objetivo (Index 1)
    if (currentPage === 1) {
      return (
        <View>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>{content.main}</Text>
            <Text style={styles.description}>{content.description}</Text>
          </View>
          {content.warning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{content.warning}</Text>
            </View>
          )}
        </View>
      );
    }

    // Página 3: Cores (Index 2)
    if (currentPage === 2) {
      return (
        <View>
          <Text style={styles.description}>{content.description}</Text>
          <View style={styles.colorsContainer}>
            {content.colors.map((color: any, idx: number) => (
              <View key={idx} style={styles.colorRow}>
                <View
                  style={[styles.colorCircle, { backgroundColor: color.color }]}
                />
                <Text style={styles.colorName}>{color.name}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    // Página 4: Como Jogar (Index 3)
    if (currentPage === 3) {
      return (
        <View>
          {content.sections.map((section: any, idx: number) => (
            <View key={idx} style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item: string, i: number) => (
                <Text key={i} style={styles.listItem}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
    }

    // Páginas 5, 6, 7: Cartas (Indexes 4, 5, 6)
    if (content.cards) {
      return (
        <View>
          {content.description && (
            <Text style={styles.description}>{content.description}</Text>
          )}
          {content.cards.map((card: any, idx: number) => (
            <View
              key={idx}
              style={[styles.cardBoxWithIcon, { borderLeftColor: card.color }]}
            >
              <View style={styles.cardIconContainer}>{card.icon}</View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDesc}>{card.desc}</Text>
              </View>
            </View>
          ))}
          {content.warning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{content.warning}</Text>
            </View>
          )}
        </View>
      );
    }

    // Página 8: Poderes Extra (Index 7)
    if (currentPage === 7) {
      return (
        <View>
          <Text style={styles.description}>{content.description}</Text>
          {content.powers.map((power: any, idx: number) => (
            <View
              key={idx}
              style={[styles.cardBoxWithIcon, { borderLeftColor: power.color }]}
            >
              <View style={styles.cardIconContainer}>{power.icon}</View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{power.title}</Text>
                <Text style={styles.cardDesc}>{power.desc}</Text>
              </View>
            </View>
          ))}
          {content.warning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{content.warning}</Text>
            </View>
          )}
        </View>
      );
    }

    // Página 9: Dicas Estratégicas (Index 8)
    if (currentPage === 8) {
      return (
        <View>
          {content.sections.map((section: any, idx: number) => (
            <View key={idx} style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item: string, i: number) => (
                <Text key={i} style={styles.listItem}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
    }

    // Página 10: Pronto para Jogar! (Index 9)
    if (currentPage === 9) {
      return (
        <View style={styles.readyContainer}>
          <Text style={styles.description}>{content.description}</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.reminderTitle}>Lembre-se:</Text>
            {content.reminders.map((reminder: string, idx: number) => (
              <Text key={idx} style={styles.reminderItem}>
                {reminder}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              route.params?.returnToHome
                ? navigation.reset({
                    index: 0,
                    routes: [{ name: Paths.Home }],
                  })
                : navigation.goBack()
            }
          >
            <Text style={styles.startButtonText}>Começar a Jogar!</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tutorial - VOID</Text>
          <TouchableOpacity
            onPress={() =>
              route.params?.returnToHome
                ? navigation.reset({
                    index: 0,
                    routes: [{ name: Paths.Home }],
                  })
                : navigation.goBack()
            }
          >
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: width * 0.9 * ((currentPage + 1) / pages.length),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentPage + 1} de {pages.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>{pages[currentPage].icon}</View>
        <Text style={styles.pageTitle}>{pages[currentPage].title}</Text>
        {renderContent(pages[currentPage])}
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={prevPage}
          disabled={currentPage === 0}
          style={[
            styles.navButton,
            currentPage === 0 && styles.navButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPage === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextPage}
          disabled={currentPage === pages.length - 1}
          style={[
            styles.navButton,
            currentPage === pages.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.navButtonText,
              currentPage === pages.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            Próximo →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.3)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  closeButton: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 28,
    color: '#9CA3AF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  progressText: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#60A5FA',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: '600',
    textAlign: 'center',
  },
  highlightBox: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    marginBottom: 16,
  },
  highlightTitle: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60A5FA',
    marginBottom: 12,
  },
  warningBox: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    marginBottom: 12,
  },
  warningText: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 14,
    color: '#FCA5A5',
  },
  colorsContainer: {
    marginTop: 16,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  colorName: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  sectionBox: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60A5FA',
    marginBottom: 12,
  },
  listItem: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  cardBoxWithIcon: {
    flexDirection: 'row',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    marginBottom: 12,
    alignItems: 'center',
  },
  cardIconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E5E7EB',
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 18,
  },
  readyContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  readyTitle: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#60A5FA',
    marginBottom: 16,
    marginTop: 16,
  },
  reminderTitle: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FBBF24',
    marginBottom: 12,
  },
  reminderItem: {
    fontFamily: 'Aldrich_400Regular',
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontFamily: 'Aldrich_400Regular',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.3)',
  },
  navButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#374151',
  },
  navButtonText: {
    fontFamily: 'Aldrich_400Regular',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  navButtonTextDisabled: {
    fontFamily: 'Aldrich_400Regular',
    color: '#6B7280',
  },
});

export default TutorialScreen;
