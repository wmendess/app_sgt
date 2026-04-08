# SGT SMTT - Aplicativo Mobile

Aplicativo mobile desenvolvido em React Native e Expo para agentes de trânsito da SMTT (Sociedade de Transporte) para gestão de BOATs (Boletins de Ocorrência de Acidente de Trânsito) e Remoções de veículos.

## 📱 Funcionalidades Implementadas

- **Autenticação**: Login com CPF e Senha integrado à API existente.
- **Home**: Dashboard com acesso aos módulos disponíveis.
- **Módulo BOAT**:
  - Listagem de BOATs com filtro por usuário/admin.
  - Criação e edição de BOATs com 7 abas:
    - BOAT (Dados gerais, Local, Data, Sinistro, Via)
    - Veículos (Adição/Edição de veículos envolvidos)
    - Vítimas (Adição/Edição de vítimas)
    - Acordo (Termo de acordo entre as partes)
    - Relatório (Relato detalhado do agente)
    - Patrimônio (Dados do proprietário)
    - Fotos (Captura via câmera ou seleção da galeria)
- **Módulo Remoção**:
  - Listagem de veículos removidos.
  - Formulário completo de remoção com captura de fotos.

## 🛠️ Tecnologias Utilizadas

- React Native (0.74.5)
- Expo SDK (~51.0.0)
- TypeScript
- React Navigation (Stack)
- Axios (Requisições HTTP)
- AsyncStorage (Armazenamento local)
- Expo Image Picker & Camera (Fotos)
- React Native Mask Input (Máscaras de formulário)

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Aplicativo **Expo Go** instalado no seu smartphone (Android ou iOS)

### Passos para Instalação

1. Clone o repositório ou acesse a pasta `mobile`:
   ```bash
   cd mobile
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

4. Abra o aplicativo **Expo Go** no seu celular e escaneie o QR Code exibido no terminal ou no navegador.

### Compilação (Build) para Produção

Para gerar o APK (Android) ou IPA (iOS), você pode utilizar o EAS Build do Expo:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Fazer login na conta Expo
eas login

# Configurar o projeto
eas build:configure

# Gerar build para Android (APK)
eas build -p android --profile preview

# Gerar build para Android (AAB - Play Store)
eas build -p android

# Gerar build para iOS
eas build -p ios
```

## 📁 Estrutura de Pastas

```text
mobile/
├── App.tsx                 # Ponto de entrada do aplicativo
├── app.json                # Configurações do Expo
├── package.json            # Dependências do projeto
├── src/
│   ├── assets/             # Imagens e ícones
│   ├── components/         # Componentes reutilizáveis (Header, FAB, Inputs)
│   ├── contexts/           # Contextos globais (AuthContext)
│   ├── hooks/              # Hooks customizados
│   ├── screens/            # Telas do aplicativo
│   │   ├── Login/          # Tela de autenticação
│   │   ├── Home/           # Dashboard principal
│   │   ├── Boat/           # Módulo BOAT (Listagem e Formulário com Abas)
│   │   └── Remocao/        # Módulo Remoção (Listagem e Formulário)
│   ├── services/           # Configuração do Axios e Endpoints da API
│   ├── types/              # Interfaces e tipos TypeScript
│   └── utils/              # Utilitários (Máscaras, Validadores, Tema, Storage)
```

## 🔐 Configuração da API

A URL base e a chave de acesso estão configuradas no arquivo `src/services/api.ts`:

```typescript
export const API_CONFIG = {
  baseURL: 'https://sgt.smtt.saoluis.ma.gov.br/app/',
  key: 'w.mendessmtt63761',
  timeout: 30000,
};
```

## 📝 Notas de Desenvolvimento

- O aplicativo foi desenvolvido seguindo fielmente o design das imagens de referência fornecidas.
- As máscaras de input (CPF, Placa, Renavam, Chassi, Telefone, Data, Hora) foram implementadas conforme os requisitos.
- O tratamento de erros e loading states foram aplicados em todas as requisições assíncronas.
- A navegação foi estruturada para garantir uma boa experiência do usuário, com proteção de rotas baseada na autenticação.
