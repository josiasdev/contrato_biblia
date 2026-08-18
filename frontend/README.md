# 🌐 Contrato Bíblia — Web Frontend (Next.js & Stellar Soroban)

Aplicação Web Frontend descentralizada (dApp) para leitura da Bíblia Sagrada, registro imutável de prova de leitura, reflexões comunitárias e reivindicação de recompensas em tokens **TAL** na blockchain **Stellar (Futurenet)**.

---

## 🚀 Tecnologias Utilizadas

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Estilização & Design**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **Design System**: Estética *Senior Minimalist Engineering* (Dark Mode Slate `#0f172a` + Accent Teal `#14b8a6`, fontes `Inter` e `Fira Code`)
- **Blockchain SDK**: `@stellar/stellar-sdk` e `@stellar/freighter-api` (Stellar Soroban Futurenet)
- **i18n**: Suporte nativo a **Português (PT)**, **Inglês (EN)** e **Espanhol (ES)**

---

## 🎨 Funcionalidades da Interface

1. **Conectividade de Carteira (Freighter)**:
   - Conexão nativa com a carteira Stellar Freighter.
   - Exibição de endereço público formatado em Fira Code com indicador pulsante de conectividade.
   - Saldo dinâmico de tokens TAL acumulados.

2. **Leitor Bíblico & Prova de Leitura (`/leitor`)**:
   - Seletor intuitivo por Livro e Capítulo.
   - Gaveta de verificação de hash **SHA-256** oficial do versículo gravado on-chain.
   - Botão **"Marcar como Lido"** enviando transação de Prova de Leitura ao Soroban Persistent Storage.
   - Modal para redactar reflexões pessoais (públicas ou privadas, máx 500 caracteres).

3. **Feed da Comunidade (`/reflexoes`)**:
   - Feed de reflexões públicas ordenáveis por "Mais Recentes" ou "Mais Curtidas".
   - Sistema de curtidas com alternância (*toggle*) e comentários encadeados (máx 200 caracteres).

4. **Central de Recompensas TAL (`/recompensas`)**:
   - Visualização do progresso de leitura por livro sagrado com anéis de progresso SVG animados.
   - Cards no formato de **"Comprovante Técnico On-Chain"** com bordas tracejadas (`border-dashed`), exibindo metadados de transação e resgate de 100 TAL ao atingir 100% de leitura.

5. **Jornada de Leitura por Testamento (`ReadingJourney`)**:
   - Trilha visual de progresso dividida entre Antigo e Novo Testamento com nós indicativos (Concluído, Em progresso, Não iniciado).

---

## 🛠️ Como Executar o Projetos

### Pré-requisitos
- Node.js 18+ instalado.
- Carteira [Freighter](https://www.freighter.app/) instalada no navegador (opcional; o app conta com fallback de demonstração).

### 1. Instalar Dependências
```bash
npm install
```

### 2. Rodar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

### 3. Compilar para Produção (Build)
```bash
npm run build
```

---

## 📂 Estrutura de Diretórios do Frontend

```
frontend/
├── src/
│   ├── app/                 # Rotas do Next.js App Router (Páginas: /, /leitor, /reflexoes, /recompensas)
│   ├── components/          # Componentes UI (Navbar, VerseCard, ReflectionCard, RewardClaimCard, ReadingJourney)
│   ├── context/             # Contextos globais (WalletContext, LanguageContext)
│   ├── i18n/                # Dicionários de tradução (PT, EN, ES)
│   └── lib/                 # Utilitários, constantes e configurações Stellar
├── public/                  # Arquivos estáticos
└── tailwind.config.ts / globals.css # Estilos globais e tokens de cores Slate & Teal
```

---

## 📜 Licença

Distribuído sob a licença MIT. Para mais detalhes sobre o Smart Contract em Rust, consulte o arquivo [docs/CONTEXT.md](../docs/CONTEXT.md).
