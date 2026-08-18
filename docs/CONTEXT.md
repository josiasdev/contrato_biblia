# CONTEXT.md — Contrato Bíblia (Stellar / Soroban)

## 📌 Visão Geral do Projeto

O **Contrato Bíblia** é um smart contract desenvolvido em Rust para a plataforma **Soroban** da blockchain **Stellar**. Ele serve como a infraestrutura descentralizada (on-chain) para uma aplicação social e de incentivo ao estudo da Bíblia Sagrada.

### Objetivos Principais:
1. **Autenticidade de Textos**: Garantir a integridade dos textos bíblicos gravando hashes SHA-256 no estado do contrato.
2. **Prova de Leitura (Proof of Reading)**: Registrar de forma imutável os versículos lidos por cada usuário.
3. **Engajamento Social Descentralizado**: Permitir que leitores criem reflexões (públicas ou privadas), curtam e comentem em reflexões de outros leitores.
4. **Sistema de Recompensas (Token TAL)**: Gamificar a leitura bíblica emitindo eventos on-chain quando um leitor conclui um livro inteiro, acionando o envio de tokens via backend off-chain.

---

## 🏗️ Arquitetura e Estrutura do Repositório

O projeto segue a estrutura padrão de contratos Soroban em Rust (`#![no_std]`):

```
contrato_biblia/
├── Cargo.toml               # Configurações do pacote Rust, dependências (soroban-sdk 23.0.3) e perfis WASM
├── README.md / README_PT_BR.md  # Documentação geral e guia de uso rápido (EN / PT-BR)
├── docs/
│   ├── DEVELOPER_GUIDE.md      # Guia técnico em Inglês
│   └── DEVELOPER_GUIDE_PT_BR.md # Guia técnico detalhado em Português
├── src/
│   ├── lib.rs               # Contrato principal (ContratoBiblia), DataKeys, Eventos e Interface Pública
│   ├── types.rs             # Estruturas de dados (IdTexto, Reflexao, Comentario, StatusReflexao) e constantes
│   ├── reflexoes.rs         # Lógica de negócios de reflexões, curtidas e comentários
│   └── teste.rs             # Suíte completa de testes unitários e de integração
└── target/                  # Artefatos compilados (incluindo o binário .wasm)
```

---

## 🔑 Modelos de Dados e Armazenamento

### Tipos de Armazenamento no Soroban
- **Instance Storage**: Usado para metadados globais e configurações de estado do contrato (admin, mapa global de hashes, mapa global de leituras simples).
- **Persistent Storage**: Usado para dados de longo prazo por usuário ou entidade (progresso de leitura por livro, reflexões, comentários, status de recompensa).

### Chaves de Estado (`DataKey`)
| Chave | Tipo de Storage | Descrição |
|---|---|---|
| `Admin` | Instance | Endereço (`Address`) do administrador do contrato |
| `Hashes` | Instance | Mapeamento `Map<IdTexto, BytesN<32>>` com os hashes SHA-256 oficiais dos versículos |
| `Leituras` | Instance | Mapeamento `Map<(Address, IdTexto), bool>` indicando se um usuário leu determinado versículo |
| `MetaVersiculosLivro(u32)` | Persistent | Quantidade total de versículos que compõem um determinado livro (ex: Gênesis = 1533) |
| `ProgressoLeitura(Address, u32)` | Persistent | Contador incremental de versículos lidos por um usuário em um livro |
| `RecompensaRecebida(Address, u32)` | Persistent | Flag de controle impedindo duplo resgate da recompensa de um livro concluído |
| `Reflexoes(IdTexto, Address)` | Persistent | Estrutura `Reflexao` armazenada por versículo e autor |
| `ContadorReflexoes(IdTexto)` | Persistent | Total de reflexões públicas em um versículo (usado para paginação) |
| `ReflexoesPublicas(IdTexto, u32)` | Persistent | Mapeamento de índice numérico para o autor da reflexão pública |
| `CurtidasReflexao(IdTexto, Address, Address)` | Persistent | Estado booleano de curtida por (versículo, autor, curtidor) |
| `ComentariosReflexao(IdTexto, Address)` | Persistent | Lista `Vec<Comentario>` vinculada a uma reflexão |
| `StatusReflexoes(IdTexto, Address)` | Persistent | Estado da reflexão (`StatusReflexao::Ativa` ou `StatusReflexao::Removida`) |

---

## 🧩 Estruturas de Dados (`src/types.rs`)

```rust
// Identificador universal de passagens bíblicas
pub struct IdTexto {
    pub livro: u32,       // Ex: 1 para Gênesis
    pub capitulo: u32,    // Ex: 1
    pub versiculo: u32,   // Ex: 1
}

// Registro de reflexão pessoal do leitor
pub struct Reflexao {
    pub leitor: Address,
    pub id_texto: IdTexto,
    pub conteudo: String,           // Máximo de 500 caracteres (MAX_REFLEXAO_CHARS)
    pub timestamp: u64,
    pub hash_reflexao: BytesN<32>,  // Hash SHA-256 do conteúdo para verificação de integridade
    pub publica: bool,              // Visibilidade: true (pública) ou false (privada)
    pub curtidas: u32,
}

// Registro de comentário em reflexão pública
pub struct Comentario {
    pub autor: Address,
    pub conteudo: String,           // Máximo de 200 caracteres (MAX_COMENTARIO_CHARS)
    pub timestamp: u64,
    pub curtidas: u32,
}

// Controle de status e moderação
pub enum StatusReflexao {
    Ativa,
    Removida,
}
```

---

## ⚡ Métodos Principais da API do Contrato

### 1. Administração & Autenticidade
- `initialize(admin: Address)`: Define a autoridade administrativa (única execução).
- `registrar_hash(id_texto: IdTexto, hash: BytesN<32>)`: Define o hash oficial de um versículo (Requer auth do admin).
- `verificar_texto(id_texto: IdTexto, texto: Bytes) -> bool`: Valida se o texto fornecido corresponde ao hash oficial.
- `registrar_meta_livro(livro_id: u32, total_versiculos: u32)`: Define a meta de versículos de um livro (Requer auth do admin).

### 2. Prova de Leitura & Recompensas
- `marcar_lido(leitor: Address, id_texto: IdTexto)`: Registra a leitura do versículo e incrementa o progresso do usuário no livro. (Requer auth do leitor).
- `verificar_leitura(leitor: Address, id_texto: IdTexto) -> String`: Retorna status descritivo da leitura.
- `reivindicar_recompensa_livro(leitor: Address, livro_id: u32)`: Verifica se o progresso atinge/supera a meta do livro. Se válido, marca a recompensa como recebida e emite o evento `RecompensaReivindicada` com o valor de `100_0000000` (100 TAL tokens com 7 casas decimais).

### 3. Rede Social (Reflexões, Curtidas e Comentários)
- `adicionar_reflexao(leitor: Address, id_texto: IdTexto, conteudo: String, publica: bool)`: Exige leitura prévia do versículo. Limite de 500 caracteres.
- `obter_reflexao(leitor: Address, id_texto: IdTexto) -> Option<Reflexao>`: Retorna a reflexão do autor.
- `listar_reflexoes_publicas(id_texto: IdTexto, limite: u32, offset: u32) -> Vec<Reflexao>`: Retorna reflexões públicas ativas com suporte a paginação.
- `curtir_reflexao(curtidor: Address, id_texto: IdTexto, autor_reflexao: Address)`: Alterna (*toggle*) o estado da curtida.
- `comentar_reflexao(comentarista: Address, id_texto: IdTexto, autor_reflexao: Address, conteudo: String)`: Adiciona um comentário (máx. 200 caracteres).
- `remover_comentario(usuario: Address, id_texto: IdTexto, autor_reflexao: Address, indice_comentario: u32)`: Permite que o autor remova seu comentário.
- `obter_comentarios(id_texto: IdTexto, autor_reflexao: Address) -> Vec<Comentario>`: Lista os comentários de uma reflexão.
- `verificar_status_reflexao(id_texto: IdTexto, autor_reflexao: Address) -> StatusReflexao`: Consulta o status de visibilidade/moderação.

---

## 🔔 Integração Off-Chain (Eventos)

O contrato **não realiza cunhagem/transferência direta de tokens mintáveis**, delegando isso à arquitetura de microsserviços através da emissão de eventos:

- **Evento**: `RecompensaReivindicada`
- **Payload**:
  - `leitor`: Address
  - `livro_id`: u32
  - `valor`: u128 (`100_0000000`)
- **Funcionamento**: Um listener no backend intercepta o evento emitido no ledger da Stellar e processa a transferência dos tokens TAL para a carteira do usuário.

---

## 🛠️ Comandos de Desenvolvimento

### Testes Unitários e de Integração
```bash
cargo test
```

### Compilação do Contrato (WASM)
```bash
stellar contract build
```
O binário será gerado em: `target/wasm32-unknown-unknown/release/contrato_biblia.wasm`.

### Deployment na Stellar Futurenet/Testnet
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/contrato_biblia.wasm \
  --source-account admin \
  --network futurenet \
  --alias contrato_biblia
```

---

## 💡 Convenções e Boas Práticas
- **`#![no_std]`**: Código otimizado para execução leve em WebAssembly no ambiente Soroban.
- **Validação Antecipada**: Regras de negócio (ex: exigir leitura antes da reflexão, limite de caracteres, evitar duplicidade de reflexão) são validadas com `panic!`.
- **Autenticação Rigorosa**: Uso do `require_auth()` em todas as funções mutáveis que alteram o estado em nome de um usuário ou administrador.
