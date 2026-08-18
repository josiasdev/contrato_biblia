# Developer Guide - Smart Contract

🌐 **Languages / Idiomas:** **English** | [Português (Brasil)](DEVELOPER_GUIDE_PT_BR.md)

Welcome to the developer guide for the **Bible Contract**, a decentralized smart contract built for **Stellar Soroban** in Rust.

---

## 🏗️ Architecture Overview

Written in Rust (`#![no_std]`) targeting WebAssembly (`wasm32v1-none`). Uses `soroban-sdk` for storage, crypto, events, and authentication.

```
src/
├── lib.rs          # Contract entrypoint (ContratoBiblia), state keys, and public interface
├── types.rs        # Data structures (IdTexto, Reflexao, Comentario, Certificado, CategoriaLivro)
├── reflexoes.rs    # Business logic for reflections, likes, and comments
├── certificados.rs # Canonical mapping of 66 books, progress checks, and certificate issuance
└── teste.rs        # Unit and integration test suite using Soroban test utilities
```

---

## 🔑 Data Structures & Types

### 1. `CategoriaLivro` & `Testamento`
Maps the 66 books of the Holy Bible (Protestant Canon).
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

### 2. `Certificado` & `TipoCertificado`
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

### Certificate & Categorization System
* `obter_categoria_livro(env: Env, livro_id: u32) -> Option<CategoriaLivro>`
* `obter_testamento_livro(env: Env, livro_id: u32) -> Option<Testamento>`
* `verificar_conclusao_categoria(env: Env, leitor: Address, categoria: CategoriaLivro) -> bool`
* `verificar_conclusao_testamento(env: Env, leitor: Address, testamento: Testamento) -> bool`
* `emitir_certificado(env: Env, leitor: Address, tipo: TipoCertificado) -> Certificado`
* `listar_certificados(env: Env, leitor: Address) -> Vec<Certificado>`

---

## 🧪 Testing

Run test suite:
```bash
cargo test
```

## 🚀 Build & Deployment

```bash
stellar contract build
```
