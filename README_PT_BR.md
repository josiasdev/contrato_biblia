# Contrato Bíblia - Smart Contract Soroban

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/rust-2021-orange.svg)](https://www.rust-lang.org/)
[![Soroban](https://img.shields.io/badge/stellar-soroban-blue.svg)](https://soroban.stellar.org/)
[![Crates.io](https://img.shields.io/crates/v/contrato_biblia.svg)](https://crates.io/crates/contrato_biblia)

🌐 **Idiomas / Languages:** **Português (Brasil)** | [English](README.md)

O **Contrato Bíblia** é uma biblioteca Rust desenvolvida para implantar um smart contract descentralizado na plataforma **Stellar Soroban**. Ele gerencia a integridade de textos sagrados via **Merkle Tree por Versão**, prova de leitura imutável, rede social comunitária de reflexões, tokens de recompensa (TAL) e credenciais Soulbound on-chain.

---

## 📚 Documentação Completa

- 📌 [Contexto Arquitetural (`docs/CONTEXT.md`)](docs/CONTEXT.md)
- 🛠️ [Guia do Desenvolvedor em Português (`docs/DEVELOPER_GUIDE_PT_BR.md`)](docs/DEVELOPER_GUIDE_PT_BR.md)
- 🛠️ [Developer Guide in English (`docs/DEVELOPER_GUIDE.md`)](docs/DEVELOPER_GUIDE.md)

---

## ✨ Funcionalidades do Smart Contract

✅ **Autenticidade de Textos via Merkle Tree**: Armazena 1 Merkle Root SHA-256 (32 bytes) por versão inteira da Bíblia (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`), reduzindo em 99.9% o custo de armazenamento no Soroban. <br>
✅ **Ingestão Automática Off-Chain**: Ferramenta CLI em Rust (`scripts/ingestor`) para carregar textos em Domínio Público e gerar provas criptográficas. <br>
✅ **Prova de Leitura**: Sistema de registro de progresso de leitura imutável na blockchain Stellar. <br>
✅ **Sistema de Recompensas**: Rastreia o progresso de leitura e emite eventos (via backend) para a distribuição de tokens (TAL) quando um livro é concluído. <br>
✅ **Categorização & Certificados On-Chain**: Categorização canônica dos 66 livros bíblicos e emissão de credenciais Soulbound não-transferíveis (Livros, Categorias, Testamentos ou Bíblia Completa). <br>
✅ **Reflexões Pessoais**: Usuários podem escrever e armazenar reflexões (públicas ou privadas) sobre passagens. <br>
✅ **Engajamento Social**: Sistema de curtidas e comentários para promover a interação comunitária. <br>
✅ **Gerenciamento de Comentários**: Usuários podem adicionar e remover seus próprios comentários. <br>
✅ **Moderação**: Sistema de status para gerenciamento e moderação de reflexões. <br>
✅ **Testes Abrangentes**: 8/8 testes unitários aprovados com 100% de sucesso. <br>
✅ **Documentação e Tipagem Segura**: Código totalmente documentado e com tipos de dados bem definidos em Rust (`#![no_std]`).

---

## ⚡ Instalação via Cargo

Para utilizar esta biblioteca em seu projeto Rust / Soroban:

```toml
[dependencies]
contrato_biblia = "1.1.1"
```

Ou via linha de comando:

```bash
cargo add contrato_biblia
```

---

## 🚀 Guia de Uso Rápido

```bash
# Executar a suíte de testes (8/8 aprovados)
cargo test

# Compilar para WebAssembly
stellar contract build

# Gerar Merkle Trees e Provas Criptográficas via CLI Rust
cargo run --manifest-path scripts/ingestor/Cargo.toml
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
