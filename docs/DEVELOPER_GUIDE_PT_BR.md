# Guia do Desenvolvedor - Smart Contract

🌐 **Idiomas / Languages:** [English](DEVELOPER_GUIDE.md) | **Português (Brasil)**

Bem-vindo ao guia do desenvolvedor do **Contrato Bíblia**, um smart contract descentralizado desenvolvido para a plataforma **Stellar Soroban** em Rust.

Este guia oferece uma visão técnica completa da arquitetura, estruturas de dados, modelo de armazenamento de estado, referência de métodos, testes e ciclo de implantação.

---

## 🏗️ Visão Geral da Arquitetura

O smart contract foi escrito em Rust (`#![no_std]`) com foco na compilação WebAssembly (`wasm32-unknown-unknown`). Utiliza a biblioteca `soroban-sdk` (v23.0.3) para manipulação do estado da blockchain, criptografia, eventos e controle de autenticação.

```
src/
├── lib.rs         # Ponto de entrada do contrato (ContratoBiblia), chaves de estado e interface pública
├── types.rs       # Estruturas de dados (IdTexto, Reflexao, Comentario, StatusReflexao)
├── reflexoes.rs   # Lógica de negócios para funções sociais, reflexões, curtidas e comentários
└── teste.rs       # Suíte de testes unitários e de integração utilizando utilitários Soroban
```

---

## 🔑 Estruturas de Dados e Tipos

### 1. `IdTexto` (Identificador de Versículo)
Identifica de forma única um versículo bíblico.
```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq, Ord, PartialOrd)]
pub struct IdTexto {
    pub livro: u32,       // ID do Livro (ex: 1 para Gênesis)
    pub capitulo: u32,    // Número do capítulo
    pub versiculo: u32,   // Número do versículo
}
```

### 2. `Reflexao` (Reflexão do Usuário)
Armazena reflexões pessoais do leitor sobre um versículo com metadados e hash SHA-256 para verificação.
```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Reflexao {
    pub leitor: Address,            // Endereço do autor
    pub id_texto: IdTexto,          // Versículo de referência
    pub conteudo: String,           // Conteúdo da reflexão (Máx 500 caracteres)
    pub timestamp: u64,             // Timestamp do bloco
    pub hash_reflexao: BytesN<32>,  // Hash SHA-256 do conteúdo
    pub publica: bool,              // Flag de visibilidade (pública/privada)
    pub curtidas: u32,              // Contador de curtidas
}
```

### 3. `Comentario` (Comentário em Reflexão)
Representa um comentário comunitário em uma reflexão pública.
```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Comentario {
    pub autor: Address,      // Endereço do comentarista
    pub conteudo: String,     // Conteúdo (Máx 200 caracteres)
    pub timestamp: u64,       // Timestamp do bloco
    pub curtidas: u32,        // Curtidas no comentário
}
```

### 4. `StatusReflexao` (Controle de Moderação)
Enum utilitário para remoção lógica ou moderação de conteúdo.
```rust
#[contracttype]
pub enum StatusReflexao {
    Ativa,      // Ativa e visível
    Removida,   // Removida/oculta
}
```

---

## 💾 Armazenamento de Estado & DataKeys

O Soroban disponibiliza dois tipos de armazenamento: **Instance Storage** (metadados globais do contrato) e **Persistent Storage** (dados do usuário que exigem retenção de longo prazo).

```rust
pub enum DataKey {
    Admin,                                   // Endereço do administrador (Instance)
    Hashes,                                  // Map<IdTexto, BytesN<32>> (Instance)
    Leituras,                                // Map<(Address, IdTexto), bool> (Instance)
    MetaVersiculosLivro(u32),                // Total de versículos de um livro (Persistent)
    ProgressoLeitura(Address, u32),          // Contador de versículos por leitor por livro (Persistent)
    RecompensaRecebida(Address, u32),        // Flag de recompensa resgatada (Persistent)
    Reflexoes(IdTexto, Address),            // Registro da reflexão (Persistent)
    ContadorReflexoes(IdTexto),             // Total de reflexões públicas por versículo (Persistent)
    ReflexoesPublicas(IdTexto, u32),        // Mapeamento para paginação (Persistent)
    CurtidasReflexao(IdTexto, Address, Address), // Estado de curtida do leitor (Persistent)
    ComentariosReflexao(IdTexto, Address),   // Vec<Comentario> (Persistent)
    StatusReflexoes(IdTexto, Address),      // Enum StatusReflexao (Persistent)
}
```

---

## ⚙️ Referência da API do Contrato

### 1. Administração e Verificação
* `initialize(env: Env, admin: Address)`
  - Configura o endereço do administrador. Pode ser executada apenas uma vez.
* `registrar_hash(env: Env, id_texto: IdTexto, hash: BytesN<32>)`
  - Requer autorização do admin. Registra o hash SHA-256 oficial do versículo.
* `verificar_texto(env: Env, id_texto: IdTexto, texto: Bytes) -> bool`
  - Gera o hash SHA-256 do `texto` on-chain e compara com o hash registrado.

### 2. Prova de Leitura e Recompensas
* `marcar_lido(env: Env, leitor: Address, id_texto: IdTexto)`
  - Marca o versículo como lido para o `leitor` e incrementa o `ProgressoLeitura` do livro correspondente.
* `verificar_leitura(env: Env, leitor: Address, id_texto: IdTexto) -> String`
  - Consulta se o `leitor` marcou o versículo `id_texto` como lido.
* `registrar_meta_livro(env: Env, livro_id: u32, total_versiculos: u32)`
  - Requer autorização do admin. Define o total de versículos para concluir um livro (ex: Gênesis = 1533).
* `reivindicar_recompensa_livro(env: Env, leitor: Address, livro_id: u32)`
  - Valida se `ProgressoLeitura` >= total de versículos do livro e emite o evento `RecompensaReivindicada` (valor: 100 tokens TAL com 7 decimais: `100_0000000`). Listeners off-chain efetuam o envio dos tokens.

### 3. Sistema Social e Reflexões
* `adicionar_reflexao(env: Env, leitor: Address, id_texto: IdTexto, conteudo: String, publica: bool)`
  - Valida limite de caracteres (<= 500), verifica a prova de leitura, armazena a reflexão e atualiza índices de paginação se for pública.
* `obter_reflexao(env: Env, leitor: Address, id_texto: IdTexto) -> Option<Reflexao>`
  - Retorna a reflexão ativa de um leitor específico.
* `listar_reflexoes_publicas(env: Env, id_texto: IdTexto, limite: u32, offset: u32) -> Vec<Reflexao>`
  - Lista paginada das reflexões públicas ativas de um versículo.
* `curtir_reflexao(env: Env, curtidor: Address, id_texto: IdTexto, autor_reflexao: Address)`
  - Alterna o estado da curtida (*toggle* adicionando ou removendo do contador).
* `comentar_reflexao(env: Env, comentarista: Address, id_texto: IdTexto, autor_reflexao: Address, conteudo: String)`
  - Adiciona um comentário (<= 200 caracteres) em uma reflexão pública.
* `remover_comentario(env: Env, usuario: Address, id_texto: IdTexto, autor_reflexao: Address, indice_comentario: u32)`
  - Remove o comentário no índice indicado. Apenas o autor do comentário pode executar.

---

## 🧪 Testes

Os testes unitários estão definidos em `src/teste.rs`.

Execute a suíte de testes usando a ferramenta padrão do Rust:

```bash
cargo test
```

### Principais Cenários Testados:
- `test_funcionalidades_basicas`: Testa inicialização, registro de hash, prova de leitura e verificação de texto.
- `test_reflexoes_completo`: Testa fluxo completo de reflexões, curtidas, descurtidas e comentários.
- `test_reflexoes_publicas` & `test_reflexao_privada`: Valida regras de visibilidade e paginação.
- `test_reflexao_sem_leitura` (`should_panic`): Garante que a leitura prévia é obrigatória antes de refletir.
- `test_reflexao_duplicada` (`should_panic`): Impede múltiplas reflexões do mesmo leitor no mesmo versículo.
- `test_reflexao_muito_longa` (`should_panic`): Valida a restrição do limite de caracteres.

---

## 🚀 Compilação e Implantação

### Compilar para WASM:
```bash
stellar contract build
```

### Implantar na Futurenet:
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/contrato_biblia.wasm \
  --source-account admin \
  --network futurenet \
  --alias contrato_biblia
```

---

## 📜 Licença
Distribuído sob a licença MIT.
