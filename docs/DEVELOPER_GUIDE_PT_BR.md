# Guia do Desenvolvedor - Smart Contract

🌐 **Idiomas / Languages:** [English](DEVELOPER_GUIDE.md) | **Português (Brasil)**

Bem-vindo ao guia do desenvolvedor do **Contrato Bíblia**, um smart contract descentralizado desenvolvido para a plataforma **Stellar Soroban** em Rust.

Este guia oferece uma visão técnica completa da arquitetura, estruturas de dados, modelo de armazenamento de estado, suporte a Merkle Trees para múltiplas versões, sistema de certificados on-chain, suíte de testes e CLI de ingestão.

---

## 🏗️ Visão Geral da Arquitetura

O smart contract foi escrito em Rust (`#![no_std]`) com foco na compilação WebAssembly (`wasm32v1-none`). Utiliza a biblioteca `soroban-sdk` (versão `23.5.3`) para manipulação do estado da blockchain, criptografia, eventos e controle de autenticação.

```
contrato_biblia/
├── src/
│   ├── lib.rs          # Ponto de entrada do contrato (ContratoBiblia), Merkle Tree, chaves de estado e API pública
│   ├── types.rs        # Estruturas de dados (VersaoBiblia, IdTexto, Reflexao, Comentario, Certificado, CategoriaLivro)
│   ├── reflexoes.rs    # Lógica de negócios para funções sociais, reflexões, curtidas e comentários
│   ├── certificados.rs # Mapeamento canônico dos 66 livros, verificações e emissão de certificados
│   └── teste.rs        # Suíte de testes unitários e de integração utilizando utilitários Soroban
├── scripts/
│   └── ingestor/       # CLI em Rust de alta performance para geração de Merkle Trees & Merkle Proofs
└── frontend/           # dApp Web em Next.js 16 (App Router, Tailwind v4, i18n, Seletor de Versão)
```

---

## 🔑 Estruturas de Dados e Tipos

### 1. `VersaoBiblia`
Mapeia as versões bíblicas em Domínio Público / Open-Source suportadas:
```rust
pub enum VersaoBiblia {
    ARC, // Almeida Revista e Corrigida (PT)
    ACF, // Almeida Corrigida Fiel (PT)
    KJV, // King James Version (EN)
    ASV, // American Standard Version (EN)
    RVA, // Reina Valera Antigua (ES)
}
```

### 2. `CategoriaLivro` e `Testamento`
Mapeia a estrutura canônica dos 66 livros da Bíblia Sagrada (Cânon Protestante/Evangélico).
```rust
pub enum Testamento { Antigo, Novo }

pub enum CategoriaLivro {
    Pentateuco,       // Gênesis a Deuteronômio (1..=5)
    HistoricosAT,     // Josué a Ester (6..=17)
    Poeticos,         // Jó a Cantares (18..=22)
    ProfetasMaiores,  // Isaías a Daniel (23..=27)
    ProfetasMenores,  // Oséias a Malaquias (28..=39)
    Evangelhos,       // Mateus a João (40..=43)
    HistoricoNT,      // Atos (44)
    CartasPaulinas,   // Romanos a Filemom (45..=57)
    CartasGerais,     // Hebreus a Judas (58..=65)
    Profecia,         // Apocalipse (66)
}
```

### 3. `Certificado` e `TipoCertificado`
Credencial Soulbound emitida on-chain com hash SHA-256 único.
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

## 💾 Armazenamento de Estado & DataKeys

```rust
pub enum DataKey {
    Admin,
    Hashes,
    Leituras,
    MetaVersiculosLivro(u32),
    ProgressoLeitura(Address, u32),
    RecompensaRecebida(Address, u32),
    Reflexoes(IdTexto, Address),
    ContadorReflexoes(IdTexto),
    ReflexoesPublicas(IdTexto, u32),
    CurtidasReflexao(IdTexto, Address, Address),
    ComentariosReflexao(IdTexto, Address),
    StatusReflexoes(IdTexto, Address),
    Certificado(Address, TipoCertificado),
    ListaCertificados(Address),
    MerkleRoot(VersaoBiblia), // 1 Merkle Root (32 bytes) por versão inteira da Bíblia
}
```

---

## ⚙️ Referência da API do Contrato

### 1. Merkle Tree & Múltiplas Versões
* `registrar_merkle_root_versao(env: Env, versao: VersaoBiblia, merkle_root: BytesN<32>)`
* `obter_merkle_root_versao(env: Env, versao: VersaoBiblia) -> Option<BytesN<32>>`
* `verificar_texto_merkle(env: Env, versao: VersaoBiblia, id_texto: IdTexto, texto: Bytes, merkle_proof: Vec<BytesN<32>>) -> bool`

### 2. Categorização e Certificados On-Chain
* `obter_categoria_livro(env: Env, livro_id: u32) -> Option<CategoriaLivro>`
* `obter_testamento_livro(env: Env, livro_id: u32) -> Option<Testamento>`
* `verificar_conclusao_categoria(env: Env, leitor: Address, categoria: CategoriaLivro) -> bool`
* `verificar_conclusao_testamento(env: Env, leitor: Address, testamento: Testamento) -> bool`
* `emitir_certificado(env: Env, leitor: Address, tipo: TipoCertificado) -> Certificado`
* `listar_certificados(env: Env, leitor: Address) -> Vec<Certificado>`

---

## 🧪 Testes Unitários (`cargo test`)

Execute a suíte de testes usando o Cargo:

```bash
cargo test
```

### Cenários Testados (8/8 aprovados):
- `test_funcionalidades_basicas`: Inicialização, hashes e prova de leitura.
- `test_merkle_root_versao`: Registro de Merkle Root e verificação de prova criptográfica (Merkle Proof).
- `test_categorizacao_livros`: Validação das categorias canônicas (Pentateuco, Evangelhos, etc.).
- `test_emissao_certificado_livro` & `test_emissao_certificado_categoria`: Emissão de certificados após 100% de leitura.
- `test_certificado_sem_conclusao_should_panic`: Bloqueio de emissão indevida.
- `test_certificado_duplicado_should_panic`: Prevenção de duplicidade.
- `test_reflexoes_completo`: Teste integrado de rede social (reflexões, curtidas e comentários).

---

## 🚀 CLI em Rust de Ingestão (`scripts/ingestor`)

O projeto inclui uma ferramenta CLI em Rust de alta performance para carregar textos em Domínio Público e construir as árvores de Merkle:

```bash
cargo run --manifest-path scripts/ingestor/Cargo.toml
```

Os arquivos JSON com as raízes e provas criptográficas são gerados automaticamente na pasta `scripts/ingestor/output/`.

---

## 📦 Compilação WASM

```bash
stellar contract build
```

O binário otimizado `target/wasm32v1-none/release/contrato_biblia.wasm` será gerado com 24 funções exportadas.
