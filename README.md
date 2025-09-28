# 🚀 VOID

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,ts,yarn" />
  </a>
</p>

VOID é um jogo de cartas com tema espacial, construído com React Native e Expo.

## 📂 Estrutura de Pastas

O projeto segue uma arquitetura bem definida para facilitar a manutenção e escalabilidade, inspirada no Atomic Design.

```
src/
├── assets/         # Imagens (.webp), fontes (.ttf) e SVGs
├── components/     # Componentes de UI reutilizáveis
│   ├── atoms/      # Componentes básicos (Button, Input, Text, VoidHeader)
│   ├── molecules/  # Grupos de átomos (MenuButton)
│   ├── organisms/  # Seções complexas (HomeHeader, AuthFormContainer)
├── navigation/     # Configuração do React Navigation (Application, types, paths)
├── screens/        # Componentes de tela (SignIn, SignUp, Home)
├── theme/          # O nosso Design System (cores, fontes, layout, spacing)
└── utils/          # Funções utilitárias (ex: generateStarCoordinates)
```

---

## 🎨 Design System

Toda a estilização do projeto é centralizada na pasta `src/theme`. Os tokens de design (cores, fontes, espaçamentos, etc.) são exportados em um objeto `theme` e consumidos nos componentes através do hook `useTheme()`.

---

## 🏁 Começando

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

* Node.js (versão LTS recomendada)
* Yarn
* Um simulador Android (via Android Studio), versão utilizada para rodar o app foi a JDK 21
* iOS (via Xcode)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/void-the-game/void-mobile.git
    cd void-mobile
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```

### Rodando o Aplicativo

Para iniciar o servidor de desenvolvimento do Metro:
```bash
yarn start
```

Em seguida, no terminal do Metro, pressione:
* `a` para abrir no simulador Android.
* `i` para abrir no simulador iOS.
* `w` para abrir no navegador web.

Para rodar diretamente um build de desenvolvimento nativo (recomendado para testar splash screen e outras features nativas):
```bash
# Para Android
yarn android

# Para iOS
yarn ios
```
---