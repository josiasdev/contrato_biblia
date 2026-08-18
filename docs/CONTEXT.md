# CONTEXT.md — Contrato Bíblia (Stellar / Soroban)

## 📌 Visão Geral do Projeto

O **Contrato Bíblia** é um smart contract desenvolvido em Rust para a plataforma **Soroban** da blockchain **Stellar**. Ele serve como a infraestrutura descentralizada (on-chain) para uma aplicação social e de incentivo ao estudo da Bíblia Sagrada.

### Objetivos Principais:
1. **Autenticidade de Textos**: Garantir a integridade dos textos bíblicos gravando hashes SHA-256 no estado do contrato.
2. **Prova de Leitura (Proof of Reading)**: Registrar de forma imutável os versículos lidos por cada usuário.
3. **Engajamento Social Descentralizado**: Permitir que leitores criem reflexões (públicas ou privadas), curtam e comentem em reflexões de outros leitores.
4. **Sistema de Recompensas (Token TAL)**: Gamificar a leitura bíblica emitindo eventos on-chain quando um leitor conclui um livro inteiro, acionando o envio de tokens via backend off-chain.
5. **Categorização & Certificados On-Chain**: Categorizar os 66 livros da Bíblia Sagrada (Cânon Protestante/Evangélico) e emitir credenciais não-transferíveis (Soulbound) com hash SHA-256 único para conclusão de Livros, Categorias, Testamentos ou a Bíblia Completa.

---

## 🏗️ Arquitetura e Estrutura do Repositório

O projeto segue a estrutura padrão de contratos Soroban em Rust (`#![no_std]`):

```
contrato_biblia/
├── Cargo.toml               # Configurações do pacote Rust, dependências (soroban-sdk 23.5.3) e perfis WASM
├── README.md / README_PT_BR.md  # Documentação geral e guia de uso rápido (EN / PT-BR)
├── docs/
│   ├── CONTEXT.md              # Contexto arquitetural do smart contract
│   ├── DEVELOPER_GUIDE.md      # Guia técnico em Inglês
│   └── DEVELOPER_GUIDE_PT_BR.md # Guia técnico detalhado em Português
├── src/
│   ├── lib.rs               # Contrato principal (ContratoBiblia), DataKeys, Eventos e Interface Pública
│   ├── types.rs             # Estruturas de dados (IdTexto, Reflexao, Comentario, Certificado, CategoriaLivro, etc.)
│   ├── reflexoes.rs         # Lógica de negócios de reflexões, curtidas e comentários
│   ├── certificados.rs      # Mapeamento canônico, verificações e emissão de certificados
│   └── teste.rs             # Suíte completa de testes unitários e de integração
└── frontend/                # dApp Web em Next.js 16 (App Router, Tailwind v4, i18n)
```

---

## 🔑 Modelos de Dados e Armazenamento

### Tipos de Armazenamento no Soroban
- **Instance Storage**: Usado para metadados globais e configurações de estado do contrato (admin, mapa global de hashes, mapa global de leituras simples).
- **Persistent Storage**: Usado para dados de longo prazo por usuário ou entidade (progresso de leitura por livro, reflexões, comentários, status de recompensa e certificados conquistados).

### Chaves de Estado (`DataKey`)
| Chave | Tipo de Storage | Descrição |
|---|---|---|
| `Admin` | Instance | Endereço (`Address`) do administrador do contrato |
| `Hashes` | Instance | Mapeamento `Map<IdTexto, BytesN<32>>` com os hashes SHA-256 oficiais dos versículos |
| `Leituras` | Instance | Mapeamento `Map<(Address, IdTexto), bool>` indicando se um usuário leu determinado versículo |
| `MetaVersiculosLivro(u32)` | Persistent | Quantidade total de versículos que compõem um determinado livro (ex: Gênesis = 1533) |
| `ProgressoLeitura(Address, u32)` | Persistent | Contador incremental de versículos lidos por um usuário em um livro |
| `RecompensaRecebida(Address, u32)` | Persistent | Flag de controle impedindo duplo resgate da recompensa de um livro concluído |
| `Reflexoes(IdTexto, Address)` | Persistent | Estrutura `Reflexao` armazenada por versículo e autor |
| `ContadorReflexoes(IdTexto)` | Persistent | Total de reflexões públicas em um versículo (usado para paginação) |
| `ReflexoesPublicas(IdTexto, u32)` | Persistent | Mapeamento de índice numérico para o autor da reflexão pública |
| `CurtidasReflexao(IdTexto, Address, Address)` | Persistent | Estado booleano de curtida por (versículo, autor, curtidor) |
| `ComentariosReflexao(IdTexto, Address)` | Persistent | Lista `Vec<Comentario>` vinculada a uma reflexão |
| `StatusReflexoes(IdTexto, Address)` | Persistent | Estado da reflexão (`StatusReflexao::Ativa` ou `StatusReflexao::Removida`) |
| `Certificado(Address, TipoCertificado)` | Persistent | Marcação de emissão do certificado evitando duplicidade |
| `ListaCertificados(Address)` | Persistent | Lista `Vec<Certificado>` armazenando as credenciais emitidas para o leitor |

---

## 🧩 Estruturas de Dados (`src/types.rs`)

```rust
// Categorias Canônicas da Bíblia Sagrada (66 Livros - Evangélica/Protestante)
pub enum CategoriaLivro {
    Pentateuco,          // Livros 1 a 5 (Gênesis a Deuteronômio)
    HistoricosAT,        // Livros 6 a 17 (Josué a Ester)
    Poeticos,            // Livros 18 a 22 (Jó a Cantares de Salomão)
    ProfetasMaiores,     // Livros 23 a 27 (Isaías a Daniel)
    ProfetasMenores,     // Livros 28 a 39 (Oséias a Malaquias)
    Evangelhos,          // Livros 40 a 43 (Mateus a João)
    HistoricoNT,         // Livro 44 (Atos dos Apóstolos)
    CartasPaulinas,      // Livros 45 a 57 (Romanos a Filemom)
    CartasGerais,        // Livros 58 a 65 (Hebreus a Judas)
    Profecia,            // Livro 66 (Apocalipse)
}

// Tipos de Certificado Emitidos
pub enum TipoCertificado {
    Livro(u32),
    Categoria(CategoriaLivro),
    Testamento(Testamento),
    BibliaCompleta,
}

// Credencial do Certificado On-Chain
pub struct Certificado {
    pub leitor: Address,
    pub tipo: TipoCertificado,
    pub timestamp: u64,
    pub hash_certificado: BytesN<32>, // Hash SHA-256 único do certificado
}
```

---

## ⚡ Métodos da API do Contrato

### 1. Administração & Autenticidade
- `initialize(admin: Address)`
- `registrar_hash(id_texto: IdTexto, hash: BytesN<32>)`
- `verificar_texto(id_texto: IdTexto, texto: Bytes) -> bool`
- `registrar_meta_livro(livro_id: u32, total_versiculos: u32)`

### 2. Prova de Leitura & Recompensas
- `marcar_lido(leitor: Address, id_texto: IdTexto)`
- `verificar_leitura(leitor: Address, id_texto: IdTexto) -> String`
- `reivindicar_recompensa_livro(leitor: Address, livro_id: u32)`

### 3. Categorização & Certificados On-Chain
- `obter_categoria_livro(livro_id: u32) -> Option<CategoriaLivro>`
- `obter_testamento_livro(livro_id: u32) -> Option<Testamento>`
- `verificar_conclusao_categoria(leitor: Address, categoria: CategoriaLivro) -> bool`
- `verificar_conclusao_testamento(leitor: Address, testamento: Testamento) -> bool`
- `emitir_certificado(leitor: Address, tipo: TipoCertificado) -> Certificado`
- `listar_certificados(leitor: Address) -> Vec<Certificado>`

### 4. Rede Social (Reflexões, Curtidas e Comentários)
- `adicionar_reflexao(leitor: Address, id_texto: IdTexto, conteudo: String, publica: bool)`
- `obter_reflexao(leitor: Address, id_texto: IdTexto) -> Option<Reflexao>`
- `listar_reflexoes_publicas(id_texto: IdTexto, limite: u32, offset: u32) -> Vec<Reflexao>`
- `curtir_reflexao(curtidor: Address, id_texto: IdTexto, autor_reflexao: Address)`
- `comentar_reflexao(comentarista: Address, id_texto: IdTexto, autor_reflexao: Address, conteudo: String)`
- `remover_comentario(usuario: Address, id_texto: IdTexto, autor_reflexao: Address, indice_comentario: u32)`

---

## 🔔 Integração Off-Chain (Eventos)

- **`RecompensaReivindicada`**: `{ leitor: Address, livro_id: u32, valor: u128 }`
- **`CertificadoEmitido`**: `{ leitor: Address, tipo: TipoCertificado, hash_certificado: BytesN<32>, timestamp: u64 }`

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Executar Testes Unitários
cargo test

# Compilar para WebAssembly
stellar contract build
```
