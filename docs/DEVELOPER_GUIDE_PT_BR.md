# Guia do Desenvolvedor - Smart Contract

🌐 **Idiomas / Languages:** [English](DEVELOPER_GUIDE.md) | **Português (Brasil)**

Bem-vindo ao guia do desenvolvedor do **Contrato Bíblia**, um smart contract descentralizado desenvolvido para a plataforma **Stellar Soroban** em Rust.

Este guia oferece uma visão técnica completa da arquitetura, estruturas de dados, modelo de armazenamento de estado, referência de métodos, testes e ciclo de implantação.

---

## 🏗️ Visão Geral da Arquitetura

O smart contract foi escrito em Rust (`#![no_std]`) com foco na compilação WebAssembly (`wasm32v1-none`). Utiliza a biblioteca `soroban-sdk` para manipulação do estado da blockchain, criptografia, eventos e controle de autenticação.

```
src/
├── lib.rs          # Ponto de entrada do contrato (ContratoBiblia), chaves de estado e interface pública
├── types.rs        # Estruturas de dados (IdTexto, Reflexao, Comentario, Certificado, CategoriaLivro, etc.)
├── reflexoes.rs    # Lógica de negócios para funções sociais, reflexões, curtidas e comentários
├── certificados.rs # Mapeamento canônico dos 66 livros, verificações e emissão de certificados
└── teste.rs        # Suíte de testes unitários e de integração utilizando utilitários Soroban
```

---

## 🔑 Estruturas de Dados e Tipos

### 1. `CategoriaLivro` e `Testamento`
Mapeia os 66 livros da Bíblia Sagrada (Cânon Protestante/Evangélico).
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

### 2. `Certificado` e `TipoCertificado`
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
}
```

---

## ⚙️ Referência da API do Contrato

### 1. Categorização e Certificados On-Chain
* `obter_categoria_livro(env: Env, livro_id: u32) -> Option<CategoriaLivro>`
* `obter_testamento_livro(env: Env, livro_id: u32) -> Option<Testamento>`
* `verificar_conclusao_categoria(env: Env, leitor: Address, categoria: CategoriaLivro) -> bool`
* `verificar_conclusao_testamento(env: Env, leitor: Address, testamento: Testamento) -> bool`
* `emitir_certificado(env: Env, leitor: Address, tipo: TipoCertificado) -> Certificado`
* `listar_certificados(env: Env, leitor: Address) -> Vec<Certificado>`

---

## 🧪 Testes

Execute a suíte de testes usando a ferramenta padrão do Rust:

```bash
cargo test
```

### Principais Cenários Testados:
- `test_funcionalidades_basicas`: Inicialização, hashes e leitura.
- `test_categorizacao_livros`: Validação das categorias canônicas (Pentateuco, Evangelhos, etc.).
- `test_emissao_certificado_livro` & `test_emissao_certificado_categoria`: Emissão de certificados após 100% de leitura.
- `test_certificado_sem_conclusao_should_panic`: Bloqueio de emissão indevida.
- `test_certificado_duplicado_should_panic`: Prevenção de duplicidade.

---

## 🚀 Compilação e Implantação

```bash
stellar contract build
```

Implantar na Futurenet:
```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/contrato_biblia.wasm \
  --source-account admin \
  --network futurenet \
  --alias contrato_biblia
```
