# Developer Guide - Smart Contract

🌐 **Languages / Idiomas:** **English** | [Português (Brasil)](DEVELOPER_GUIDE_PT_BR.md)

Welcome to the developer guide for the **Bible Contract**, a decentralized smart contract built for **Stellar Soroban** in Rust.

---

## 🏗️ Architecture Overview

Written in Rust (`#![no_std]`) targeting WebAssembly (`wasm32v1-none`). Uses `soroban-sdk` (v23.5.3) for storage, crypto, events, and authentication.

```
contrato_biblia/
├── src/
│   ├── lib.rs          # Contract entrypoint (ContratoBiblia), Merkle Tree, state keys, and public interface
│   ├── types.rs        # Data structures (VersaoBiblia, IdTexto, Reflexao, Comentario, Certificado, CategoriaLivro)
│   ├── reflexoes.rs    # Business logic for reflections, likes, and comments
│   ├── certificados.rs # Canonical mapping of 66 books, progress checks, and certificate issuance
│   └── teste.rs        # Unit and integration test suite using Soroban test utilities (8/8 passing)
├── scripts/
│   └── ingestor/       # Rust CLI tool for mass ingestion, Merkle Tree & Merkle Proof generation
└── frontend/           # dApp Web in Next.js 16 (App Router, Tailwind v4, i18n, Version Selector)
```

---

## 🔑 Data Structures & Types

### 1. `VersaoBiblia`
Supported public domain / open-source Bible versions:
```rust
pub enum VersaoBiblia {
    ARC, // Almeida Revista e Corrigida (PT)
    ACF, // Almeida Corrigida Fiel (PT)
    KJV, // King James Version (EN)
    ASV, // American Standard Version (EN)
    RVA, // Reina Valera Antigua (ES)
}
```

### 2. `CategoriaLivro` & `Testamento`
Canonical 66-book Protestant Bible structure.
```rust
pub enum Testamento { Antigo, Novo }

pub enum CategoriaLivro {
    Pentateuco,       // Genesis to Deuteronomy (1..=5)
    HistoricosAT,     // Joshua to Esther (6..=17)
    Poeticos,         // Job to Song of Solomon (18..=22)
    ProfetasMaiores,  // Isaiah to Daniel (23..=27)
    ProfetasMenores,  // Hosea to Malachi (28..=39)
    Evangelhos,       // Matthew to John (40..=43)
    HistoricoNT,      // Acts (44)
    CartasPaulinas,   // Romans to Philemon (45..=57)
    CartasGerais,     // Hebrews to Jude (58..=65)
    Profecia,         // Revelation (66)
}
```

### 3. `Certificado` & `TipoCertificado`
Soulbound credentials issued on-chain with unique SHA-256 hashes.
```rust
pub enum TipoCertificado {
    Livro(u32),
    Categoria(CategoriaLivro),
    Testamento(Testamento),
    BibliaCompleta,
}

pub struct Certificado {
    pub leitor: Address,
    pub tipo: TipoCertificado,
    pub timestamp: u64,
    pub hash_certificado: BytesN<32>,
}
```

---

## ⚙️ Contract API Reference

### 1. Merkle Tree & Multi-Version Support
* `registrar_merkle_root_versao(env: Env, versao: VersaoBiblia, merkle_root: BytesN<32>)`
* `obter_merkle_root_versao(env: Env, versao: VersaoBiblia) -> Option<BytesN<32>>`
* `verificar_texto_merkle(env: Env, versao: VersaoBiblia, id_texto: IdTexto, texto: Bytes, merkle_proof: Vec<BytesN<32>>) -> bool`

### 2. Certificate & Categorization System
* `obter_categoria_livro(env: Env, livro_id: u32) -> Option<CategoriaLivro>`
* `obter_testamento_livro(env: Env, livro_id: u32) -> Option<Testamento>`
* `verificar_conclusao_categoria(env: Env, leitor: Address, categoria: CategoriaLivro) -> bool`
* `verificar_conclusao_testamento(env: Env, leitor: Address, testamento: Testamento) -> bool`
* `emitir_certificado(env: Env, leitor: Address, tipo: TipoCertificado) -> Certificado`
* `listar_certificados(env: Env, leitor: Address) -> Vec<Certificado>`

---

## 🧪 Testing

Run test suite (8/8 tests passing):
```bash
cargo test
```

---

## 🚀 Rust Ingestion CLI (`scripts/ingestor`)

Run high-performance Rust CLI to process Bible datasets and generate Merkle Trees:
```bash
cargo run --manifest-path scripts/ingestor/Cargo.toml
```

---

## 📦 WASM Build

```bash
stellar contract build
```

Generates optimized `target/wasm32v1-none/release/contrato_biblia.wasm` with 24 exported functions.
