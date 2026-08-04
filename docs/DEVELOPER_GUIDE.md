# Smart Contract Developer Guide

🌐 **Languages / Idiomas:** **English** | [Português (Brasil)](DEVELOPER_GUIDE_PT_BR.md)

Welcome to the developer guide for **Contrato Bíblia**, a decentralised smart contract built for the **Stellar Soroban** platform using Rust.

This guide provides developers with a complete walkthrough of the smart contract architecture, data structures, state storage model, method references, testing, and deployment lifecycle.

---

## 🏗️ Architecture Overview

The smart contract is written in Rust (`#![no_std]`) and targets WebAssembly (`wasm32-unknown-unknown`). It uses `soroban-sdk` (v23.0.3) for blockchain state interactions, cryptographic operations, events, and authentication.

```
src/
├── lib.rs         # Contract entry point (ContratoBiblia), state keys, and public interface
├── types.rs       # Data structures (IdTexto, Reflexao, Comentario, StatusReflexao)
├── reflexoes.rs   # Business logic for social features, reflections, likes, and comments
└── teste.rs       # Unit and integration test suite using Soroban test utils
```

---

## 🔑 Data Structures & Types

### 1. `IdTexto` (Verse Identifier)
Identifies a specific Biblical verse.
```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq, Ord, PartialOrd)]
pub struct IdTexto {
    pub livro: u32,       // Book ID (e.g., 1 for Genesis)
    pub capitulo: u32,    // Chapter number
    pub versiculo: u32,   // Verse number
}
```

### 2. `Reflexao` (User Reflection)
Stores user thoughts on a verse along with metadata and SHA-256 content verification.
```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Reflexao {
    pub leitor: Address,            // Author address
    pub id_texto: IdTexto,          // Reference verse
    pub conteudo: String,           // Text content (Max 500 chars)
    pub timestamp: u64,             // Block timestamp
    pub hash_reflexao: BytesN<32>,  // SHA-256 hash of content
    pub publica: bool,              // Public or private flag
    pub curtidas: u32,              // Like counter
}
```

### 3. `Comentario` (Reflection Comment)
Represents a community comment on a public reflection.
```rust
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Comentario {
    pub autor: Address,      // Commenter address
    pub conteudo: String,     // Content (Max 200 chars)
    pub timestamp: u64,       // Block timestamp
    pub curtidas: u32,        // Comment likes
}
```

### 4. `StatusReflexao` (Moderation Control)
Enum used for soft deletion or content moderation.
```rust
#[contracttype]
pub enum StatusReflexao {
    Ativa,      // Active and visible
    Removida,   // Removed/hidden
}
```

---

## 💾 Storage Strategy & Data Keys

Soroban provides two main storage types: **Instance Storage** (contract-wide metadata) and **Persistent Storage** (user data requiring longer lifecycle management).

```rust
pub enum DataKey {
    Admin,                                   // Contract admin address (Instance)
    Hashes,                                  // Map<IdTexto, BytesN<32>> (Instance)
    Leituras,                                // Map<(Address, IdTexto), bool> (Instance)
    MetaVersiculosLivro(u32),                // Total verse count for a book (Persistent)
    ProgressoLeitura(Address, u32),          // Verse counter per user per book (Persistent)
    RecompensaRecebida(Address, u32),        // Claim status flag (Persistent)
    Reflexoes(IdTexto, Address),            // Reflection entry (Persistent)
    ContadorReflexoes(IdTexto),             // Total public reflections for verse (Persistent)
    ReflexoesPublicas(IdTexto, u32),        // Pagination index mapping (Persistent)
    CurtidasReflexao(IdTexto, Address, Address), // Like toggle state (Persistent)
    ComentariosReflexao(IdTexto, Address),   // Vec<Comentario> (Persistent)
    StatusReflexoes(IdTexto, Address),      // StatusReflexao enum (Persistent)
}
```

---

## ⚙️ Contract API Reference

### 1. Administration & Verification
* `initialize(env: Env, admin: Address)`
  - Sets the admin address. Can only be executed once.
* `registrar_hash(env: Env, id_texto: IdTexto, hash: BytesN<32>)`
  - Requires admin authorization. Registers official SHA-256 hash for a verse.
* `verificar_texto(env: Env, id_texto: IdTexto, texto: Bytes) -> bool`
  - Hashes input `texto` using SHA-256 on-chain and checks against registered hash.

### 2. Reading Proof & Rewards
* `marcar_lido(env: Env, leitor: Address, id_texto: IdTexto)`
  - Marks a verse as read for `leitor` and increments `ProgressoLeitura` for that book.
* `verificar_leitura(env: Env, leitor: Address, id_texto: IdTexto) -> String`
  - Queries whether `leitor` has marked `id_texto` as read.
* `registrar_meta_livro(env: Env, livro_id: u32, total_versiculos: u32)`
  - Requires admin authorization. Sets total verses required to finish a book (e.g. Genesis = 1533).
* `reivindicar_recompensa_livro(env: Env, leitor: Address, livro_id: u32)`
  - Verifies if `ProgressoLeitura` >= total book verses and emits `RecompensaReivindicada` event (value: 100 TAL tokens with 7 decimals: `100_0000000`). Off-chain listeners handle token transfer.

### 3. Social & Reflection System
* `adicionar_reflexao(env: Env, leitor: Address, id_texto: IdTexto, conteudo: String, publica: bool)`
  - Validates character limit (<= 500), checks reading proof, stores reflection, and updates pagination if public.
* `obter_reflexao(env: Env, leitor: Address, id_texto: IdTexto) -> Option<Reflexao>`
  - Retrieves active reflection for a specific reader.
* `listar_reflexoes_publicas(env: Env, id_texto: IdTexto, limite: u32, offset: u32) -> Vec<Reflexao>`
  - Paged list of active public reflections for a verse.
* `curtir_reflexao(env: Env, curtidor: Address, id_texto: IdTexto, autor_reflexao: Address)`
  - Toggles like status (adds or removes like counter).
* `comentar_reflexao(env: Env, comentarista: Address, id_texto: IdTexto, autor_reflexao: Address, conteudo: String)`
  - Adds a comment (<= 200 characters) to a public reflection.
* `remover_comentario(env: Env, usuario: Address, id_texto: IdTexto, autor_reflexao: Address, indice_comentario: u32)`
  - Removes a comment at `indice_comentario`. Only author can execute.

---

## 🧪 Testing

The repository contains tests in `src/teste.rs`.

Run the test suite using standard Rust tooling:

```bash
cargo test
```

### Key Test Scenarios:
- `test_funcionalidades_basicas`: Tests initialization, hash registration, reading proof, and text verification.
- `test_reflexoes_completo`: Exercises adding reflections, liking/unliking, and commenting.
- `test_reflexoes_publicas` & `test_reflexao_privada`: Verifies visibility boundaries and pagination.
- `test_reflexao_sem_leitura` (`should_panic`): Enforces reading proof requirement prior to reflecting.
- `test_reflexao_duplicada` (`should_panic`): Prevents multiple reflections by the same author on a single verse.
- `test_reflexao_muito_longa` (`should_panic`): Validates character limit enforcement.

---

## 🚀 Build & Deployment Commands

### Build WASM target:
```bash
stellar contract build
```

### Deploy to Futurenet:
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/contrato_biblia.wasm \
  --source-account admin \
  --network futurenet \
  --alias contrato_biblia
```

---

## 📜 License
Distributed under the MIT License.
