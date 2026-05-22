# Glossário (Contexto de Domínio)

Este documento centraliza a Linguagem Ubíqua do projeto, garantindo que o front-end, back-end e a equipe utilizem as mesmas definições, sem entrar em detalhes de implementação.

- **PlayerView**: Representa a visão de estado da partida específica para um único jogador em um dado momento. Ao contrário de um estado global irrestrito, o `PlayerView` mascara as mãos dos oponentes (mostrando apenas a contagem de cartas) e fornece informações essenciais da mesa (`discardPile`, `deck`, `currentTurnIndex`, `phase`).
- **Coringa (Joker)**: Carta de energia curinga. Age como um substituto de qualquer cor de Essência em combos e reações de defesas de área.
- **Defesa de Área (Area Defense)**: Ação passiva provocada por cartas que afetam todos na mesa (Vórtex ou Buraco Negro), exigindo um `discard:submit`. Permite punições alternativas (ex: 2 cartas erradas em vez de 1 certa).
- **Defesa Pontual (Interrupt)**: Reação direta a um ataque alvo (Roubo, etc), processada pela fase `react`. Fornece um blefe ou resposta temporal antes do ataque ser concretizado, usando as cartas disponíveis (`availableResponses`).
- **Resolução Otimista (Optimistic Modal Dismiss)**: Padrão visual onde modais de reação (Interrupt/Discard) fecham e liberam a tela imediatamente após o botão de envio ser pressionado, sem bloquear a UI aguardando a sincronia/confirmação do evento socket. A resposta definitiva chega via `state:update` à tela principal.
