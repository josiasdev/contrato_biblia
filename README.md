# Bible Contract - Soroban Smart Contract

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/rust-2021-orange.svg)](https://www.rust-lang.org/)
[![Soroban](https://img.shields.io/badge/stellar-soroban-blue.svg)](https://soroban.stellar.org/)
[![Crates.io](https://img.shields.io/crates/v/contrato_biblia.svg)](https://crates.io/crates/contrato_biblia)

🌐 **Languages / Idiomas:** **English** | [Português (Brasil)](README_PT_BR.md)

**Bible Contract** (`contrato_biblia`) is a Rust library built to deploy a decentralized smart contract on the **Stellar Soroban** platform. It manages text authenticity using **Merkle Trees per Version**, immutable reading proofs, a social community feed of reflections, reward tokens (TAL), and on-chain Soulbound credentials.

---

## 📚 Complete Documentation

- 📌 [Architectural Context (`docs/CONTEXT.md`)](docs/CONTEXT.md)
- 🛠️ [Developer Guide in English (`docs/DEVELOPER_GUIDE.md`)](docs/DEVELOPER_GUIDE.md)
- 🛠️ [Guia do Desenvolvedor em Português (`docs/DEVELOPER_GUIDE_PT_BR.md`)](docs/DEVELOPER_GUIDE_PT_BR.md)

---

## ✨ Smart Contract Features

✅ **Text Authenticity via Merkle Tree**: Stores 1 Merkle Root SHA-256 (32 bytes) per complete Bible version (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`), reducing Soroban storage costs by 99.9%. <br>
✅ **Off-Chain Automatic Ingestion**: High-performance Rust CLI tool (`scripts/ingestor`) to process Public Domain datasets and generate cryptographic proofs. <br>
✅ **Proof of Reading**: Immutable on-chain reading progress tracking system on Stellar. <br>
✅ **Reward System**: Tracks reading progress and emits events (for off-chain backend processing) to distribute tokens (TAL) upon completing a book. <br>
✅ **On-Chain Certificates & Categorization**: Canonical structure for all 66 Bible books and issuance of non-transferable Soulbound Credentials (Books, Categories, Testaments, or Complete Bible). <br>
✅ **Personal Reflections**: Users can write and store public or private reflections on Bible passages. <br>
✅ **Social Engagement**: Like and comment system to promote community interaction. <br>
✅ **Comment Management**: Users can add and delete their own comments. <br>
✅ **Moderation**: Status system for reflection management and moderation. <br>
✅ **Comprehensive Tests**: High unit test coverage across all major features (8/8 passing). <br>
✅ **Type-Safe Documentation**: Fully documented Rust code (`#![no_std]`) with strongly typed structures.

---

## ⚡ Installation via Cargo

Add this library to your Rust / Soroban project:

```toml
[dependencies]
contrato_biblia = "1.1.1"
```

Or via CLI:

```bash
cargo add contrato_biblia
```

---

## 🚀 Quickstart Guide

```bash
# Run unit test suite (8/8 passing)
cargo test

# Build WebAssembly contract
stellar contract build

# Generate Merkle Trees and Cryptographic Proofs via Rust CLI
cargo run --manifest-path scripts/ingestor/Cargo.toml
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.