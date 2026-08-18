# CONTEXT.md — Contrato Bíblia (Stellar / Soroban)

## 📌 Visão Geral do Projeto

O **Contrato Bíblia** é um smart contract desenvolvido em Rust para a plataforma **Soroban** da blockchain **Stellar**. Ele serve como a infraestrutura descentralizada (on-chain) para uma aplicação social e de incentivo ao estudo da Bíblia Sagrada.

### Objetivos Principais:
1. **Autenticidade de Textos via Merkle Tree**: Suportar múltiplas versões da Bíblia Sagrada em domínio público (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`) armazenando 1 Merkle Root (32 bytes) por versão no contrato Soroban e verificando a integridade dos versículos via Merkle Proofs.
2. **Prova de Leitura (Proof of Reading)**: Registrar de forma imutável os versículos lidos por cada usuário de forma agnóstica à versão utilizada.
3. **Engajamento Social Descentralizado**: Permitir que leitores criem reflexões (públicas ou privadas), curtam e comentem em reflexões de outros leitores.
4. **Sistema de Recompensas (Token TAL)**: Gamificar a leitura bíblica emitindo eventos on-chain quando um leitor conclui um livro inteiro.
5. **Categorização & Certificados On-Chain**: Categorizar os 66 livros da Bíblia Sagrada e emitir credenciais não-transferíveis (Soulbound) com hash SHA-256 único para conclusão de Livros, Categorias, Testamentos ou a Bíblia Completa.

---

## 🏗️ Arquitetura e Estrutura do Repositório

```
contrato_biblia/
├── Cargo.toml               # Configurações do pacote Rust (soroban-sdk 23.5.3)
├── README.md / README_PT_BR.md  # Documentação geral
├── docs/
│   ├── CONTEXT.md              # Contexto arquitetural do smart contract
│   ├── DEVELOPER_GUIDE.md      # Guia técnico em Inglês
│   └── DEVELOPER_GUIDE_PT_BR.md # Guia técnico detalhado em Português
├── src/
│   ├── lib.rs               # Contrato principal (ContratoBiblia), Merkle Tree, DataKeys, Eventos
│   ├── types.rs             # Estruturas (VersaoBiblia, IdTexto, Reflexao, Comentario, Certificado)
│   ├── reflexoes.rs         # Lógica de reflexões, curtidas e comentários
│   ├── certificados.rs      # Mapeamento canônico e emissão de certificados
│   └── teste.rs             # Suíte completa de testes unitários (8/8 aprovados)
├── scripts/
│   └── ingestor/            # [NOVO] CLI em Rust para ingestão em massa e geração de Merkle Trees
└── frontend/                # dApp Web em Next.js 16 (App Router, Tailwind v4, i18n, Seletor de Versão)
```

---

## 🔑 Modelos de Dados e Armazenamento

### Chaves de Estado (`DataKey`)
| Chave | Tipo de Storage | Descrição |
|---|---|---|
| `Admin` | Instance | Endereço (`Address`) do administrador do contrato |
| `Hashes` | Instance | Mapeamento `Map<IdTexto, BytesN<32>>` com hashes legados de versículos |
| `MerkleRoot(VersaoBiblia)` | Persistent | Merkle Root SHA-256 (32 bytes) de uma versão inteira da Bíblia (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`) |
| `Leituras` | Instance | Mapeamento `Map<(Address, IdTexto), bool>` de leitura de versículos |
| `MetaVersiculosLivro(u32)` | Persistent | Quantidade total de versículos que compõem um livro |
| `ProgressoLeitura(Address, u32)` | Persistent | Contador incremental de versículos lidos por leitor em um livro |
| `RecompensaRecebida(Address, u32)` | Persistent | Flag prevenindo duplo resgate de recompensa |
| `Certificado(Address, TipoCertificado)` | Persistent | Marcação de emissão de certificado Soulbound |
| `ListaCertificados(Address)` | Persistent | Lista `Vec<Certificado>` por leitor |

---

## ⚙️ Métodos de Merkle Tree & Múltiplas Versões

- `registrar_merkle_root_versao(admin: Address, versao: VersaoBiblia, merkle_root: BytesN<32>)`
- `obter_merkle_root_versao(versao: VersaoBiblia) -> Option<BytesN<32>>`
- `verificar_texto_merkle(versao: VersaoBiblia, id_texto: IdTexto, texto: Bytes, merkle_proof: Vec<BytesN<32>>) -> bool`
