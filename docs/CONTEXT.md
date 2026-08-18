# CONTEXT.md — Contrato Bíblia (Stellar / Soroban)

## 📌 Visão Geral do Projeto

O **Contrato Bíblia** é um smart contract desenvolvido em Rust para a plataforma **Soroban** da blockchain **Stellar**. Ele serve como a infraestrutura descentralizada (on-chain) para uma aplicação social e de incentivo ao estudo da Bíblia Sagrada.

### Objetivos Principais:
1. **Autenticidade de Textos via Merkle Tree**: Suportar múltiplas versões da Bíblia Sagrada em domínio público (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`) armazenando 1 Merkle Root SHA-256 (32 bytes) por versão no contrato Soroban e verificando a integridade dos versículos via Merkle Proofs.
2. **Prova de Leitura & Devocional Diário (Daily Reading Streak)**: Registrar de forma imutável os versículos lidos por cada usuário e calcular a sequência de dias consecutivos de leitura (`RachaLeitura`), premiando o leitor com **+10 TAL** a cada 7 dias de racha ininterruptos.
3. **Rede Social Descentralizada, Curadoria & Anti-Spam (1 TAL Stake)**: Permitir que leitores criem reflexões (públicas ou privadas) com opção de mídias descentralizadas (IPFS CIDs para áudios/PDFs). Publicações públicas travam 1 TAL de caução anti-spam. Curadores com Certificados Bíblicos podem promover reflexões a **"Insight Teológico em Destaque"**, reembolsando a trava + bônus de 5 TAL.
4. **Sistema de Recompensas On-Chain (Token TAL via SAC / SEP-41)**: Gamificar a leitura bíblica realizando a **transferência direta on-chain de 100 tokens TAL** da tesouraria do contrato para a carteira do leitor via Soroban Token Client (`soroban_sdk::token::Client`).
5. **Categorização & Certificados On-Chain**: Categorizar os 66 livros da Bíblia Sagrada (Cânon Protestante/Evangélico) e emitir credenciais não-transferíveis (Soulbound) com hash SHA-256 único para conclusão de Livros, Categorias, Testamentos ou a Bíblia Completa.
6. **Automação & Indexador de Eventos (`scripts/indexer`)**: Daemon em Rust que escuta eventos `RecompensaReivindicada` e `CertificadoEmitido` via Soroban RPC (`getEvents`), gerando dados analíticos em tempo real.
7. **Ingestor dos 66 Livros (`scripts/ingestor`)**: Gerador de Merkle Trees e Proofs para todos os 66 livros bíblicos em 5 versões em domínio público.

---

## 🏗️ Arquitetura e Estrutura do Repositório

```
contrato_biblia/
├── Cargo.toml               # Configurações do pacote Rust (soroban-sdk 23.5.3, publish=true)
├── README.md / README_PT_BR.md  # Documentação geral
├── docs/
│   ├── CONTEXT.md              # Contexto arquitetural do smart contract
│   ├── DEVELOPER_GUIDE.md      # Guia técnico em Inglês
│   └── DEVELOPER_GUIDE_PT_BR.md # Guia técnico detalhado em Português
├── src/
│   ├── lib.rs               # Contrato principal, Daily Streak (+10 TAL), SAC Token TAL, Merkle Tree, DataKeys
│   ├── types.rs             # Estruturas (RachaLeitura, VersaoBiblia, IdTexto, Reflexao, Comentario, Certificado)
│   ├── reflexoes.rs         # Lógica de reflexões, IPFS, trava anti-spam (1 TAL) e curadoria de destaque
│   ├── certificados.rs      # Mapeamento canônico dos 66 livros e emissão de certificados
│   └── teste.rs             # Suíte de testes unitários (11/11 aprovados)
├── scripts/
│   ├── ingestor/            # CLI em Rust para geração de Merkle Trees & Proofs dos 66 livros
│   └── indexer/             # Servicio daemon em Rust para monitoramento de eventos via Soroban RPC
└── frontend/                # dApp Web em Next.js 16 (App Router, Leaderboard /ranking, IPFS Media, Curadoria)
```

---

## 🔑 Modelos de Dados e Armazenamento

### Chaves de Estado (`DataKey`)
| Chave | Tipo de Storage | Descrição |
|---|---|---|
| `Admin` | Instance | Endereço (`Address`) do administrador do contrato |
| `Hashes` | Instance | Mapeamento `Map<IdTexto, BytesN<32>>` com os hashes legados dos versículos |
| `TokenTAL` | Instance | Endereço (`Address`) do contrato do Token TAL (Stellar Asset Contract / SAC) |
| `MerkleRoot(VersaoBiblia)` | Persistent | Merkle Root SHA-256 (32 bytes) de uma versão inteira da Bíblia (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`) |
| `Leituras` | Instance | Mapeamento `Map<(Address, IdTexto), bool>` de leitura de versículos |
| `RachaLeitura(Address)` | Persistent | Registro `RachaLeitura` (timestamp + dias consecutivos lidos) |
| `MetaVersiculosLivro(u32)` | Persistent | Quantidade total de versículos que compõem um livro |
| `ProgressoLeitura(Address, u32)` | Persistent | Contador incremental de versículos lidos por leitor em um livro |
| `RecompensaRecebida(Address, u32)` | Persistent | Flag prevenindo duplo resgate da recompensa de um livro |
| `Certificado(Address, TipoCertificado)` | Persistent | Marcação de emissão de certificado Soulbound evitando duplicidade |
| `ListaCertificados(Address)` | Persistent | Lista `Vec<Certificado>` por leitor |

---

## ⚡ Referência de Métodos da API (`ContratoBiblia`)

### 1. Administração & Token TAL (SAC)
- `initialize(admin: Address)`
- `configurar_token_tal(admin: Address, token_address: Address)`
- `obter_token_tal() -> Option<Address>`
- `registrar_hash(id_texto: IdTexto, hash: BytesN<32>)`
- `verificar_texto(id_texto: IdTexto, texto: Bytes) -> bool`
- `registrar_meta_livro(livro_id: u32, total_versiculos: u32)`

### 2. Merkle Tree & Múltiplas Versões
- `registrar_merkle_root_versao(admin: Address, versao: VersaoBiblia, merkle_root: BytesN<32>)`
- `obter_merkle_root_versao(versao: VersaoBiblia) -> Option<BytesN<32>>`
- `verificar_texto_merkle(versao: VersaoBiblia, id_texto: IdTexto, texto: Bytes, merkle_proof: Vec<BytesN<32>>) -> bool`

### 3. Prova de Leitura, Daily Streak & Recompensas On-Chain (TAL)
- `marcar_lido(leitor: Address, id_texto: IdTexto)` *(Atualiza racha diário e concede +10 TAL no 7º dia)*
- `obter_racha_leitura(leitor: Address) -> RachaLeitura`
- `verificar_leitura(leitor: Address, id_texto: IdTexto) -> String`
- `reivindicar_recompensa_livro(leitor: Address, livro_id: u32)` *(Realiza transferência direta de 100 TAL via SAC Token Client)*

### 4. Categorização & Certificados On-Chain
- `obter_categoria_livro(livro_id: u32) -> Option<CategoriaLivro>`
- `obter_testamento_livro(livro_id: u32) -> Option<Testamento>`
- `verificar_conclusao_categoria(leitor: Address, categoria: CategoriaLivro) -> bool`
- `verificar_conclusao_testamento(leitor: Address, testamento: Testamento) -> bool`
- `emitir_certificado(leitor: Address, tipo: TipoCertificado) -> Certificado`
- `listar_certificados(leitor: Address) -> Vec<Certificado>`

### 5. Rede Social, Mídia IPFS & Curadoria Comunitária
- `adicionar_reflexao(leitor: Address, id_texto: IdTexto, conteudo: String, publica: bool, hash_midia_ipfs: Option<String>)` *(Trava 1 TAL anti-spam para publicações públicas)*
- `marcar_reflexao_destaque(curador: Address, autor_reflexao: Address, id_texto: IdTexto)` *(Exige Certificado no curador; Reembolsa 1 TAL + 5 TAL bônus ao autor)*
- `obter_reflexao(leitor: Address, id_texto: IdTexto) -> Option<Reflexao>`
- `listar_reflexoes_publicas(id_texto: IdTexto, limite: u32, offset: u32) -> Vec<Reflexao>`
- `curtir_reflexao(curtidor: Address, id_texto: IdTexto, autor_reflexao: Address)`
- `comentar_reflexao(comentarista: Address, id_texto: IdTexto, autor_reflexao: Address, conteudo: String)`
- `remover_comentario(usuario: Address, id_texto: IdTexto, autor_reflexao: Address, indice_comentario: u32)`

---

## 🛠️ Comandos de Infraestrutura Off-Chain

```bash
# Ingestão dos 66 Livros Criptográficos (Merkle Trees & Proofs)
cargo run --manifest-path scripts/ingestor/Cargo.toml

# Relayer & Indexador de Eventos Soroban RPC (Analytics)
cargo run --manifest-path scripts/indexer/Cargo.toml
```
