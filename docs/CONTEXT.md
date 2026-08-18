# CONTEXT.md — Contrato Bíblia (Stellar / Soroban)

## 📌 Visão Geral do Projeto

O **Contrato Bíblia** é um smart contract desenvolvido em Rust para a plataforma **Soroban** da blockchain **Stellar**. Ele serve como a infraestrutura descentralizada (on-chain) para uma aplicação social e de incentivo ao estudo da Bíblia Sagrada.

### Objetivos Principais:
1. **Autenticidade de Textos via Merkle Tree**: Suportar múltiplas versões da Bíblia Sagrada em domínio público (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`) armazenando 1 Merkle Root SHA-256 (32 bytes) por versão no contrato Soroban e verificando a integridade dos versículos via Merkle Proofs.
2. **Prova de Leitura (Proof of Reading)**: Registrar de forma imutável os versículos lidos por cada usuário de forma agnóstica à versão utilizada.
3. **Engajamento Social Descentralizado**: Permitir que leitores criem reflexões (públicas ou privadas), curtam e comentem em reflexões de outros leitores.
4. **Sistema de Recompensas (Token TAL)**: Gamificar a leitura bíblica emitindo eventos on-chain quando um leitor conclui um livro inteiro.
5. **Categorização & Certificados On-Chain**: Categorizar os 66 livros da Bíblia Sagrada (Cânon Protestante/Evangélico) e emitir credenciais não-transferíveis (Soulbound) com hash SHA-256 único para conclusão de Livros, Categorias, Testamentos ou a Bíblia Completa.

---

## 🏗️ Arquitetura e Estrutura do Repositório

```
contrato_biblia/
├── Cargo.toml               # Configurações do pacote Rust (soroban-sdk 23.5.3, publish=true, exclude frontend)
├── README.md / README_PT_BR.md  # Documentação geral e guia rápido (EN / PT-BR)
├── docs/
│   ├── CONTEXT.md              # Contexto arquitetural do smart contract
│   ├── DEVELOPER_GUIDE.md      # Guia técnico em Inglês
│   └── DEVELOPER_GUIDE_PT_BR.md # Guia técnico detalhado em Português
├── src/
│   ├── lib.rs               # Contrato principal (ContratoBiblia), Merkle Tree, DataKeys, Eventos
│   ├── types.rs             # Estruturas (VersaoBiblia, IdTexto, Reflexao, Comentario, Certificado, etc.)
│   ├── reflexoes.rs         # Lógica de reflexões, curtidas e comentários
│   ├── certificados.rs      # Mapeamento canônico dos 66 livros e emissão de certificados
│   └── teste.rs             # Suíte completa de testes unitários (8/8 aprovados)
├── scripts/
│   └── ingestor/            # CLI em Rust de alta performance para geração de Merkle Trees & Proofs
└── frontend/                # dApp Web em Next.js 16 (App Router, Tailwind v4, i18n, Seletor de Versão)
```

---

## 🔑 Modelos de Dados e Armazenamento

### Tipos de Armazenamento no Soroban
- **Instance Storage**: Usado para metadados globais e configurações de estado do contrato (`Admin`, `Hashes`, `Leituras`).
- **Persistent Storage**: Usado para dados de longo prazo por usuário ou entidade (`MerkleRoot`, `ProgressoLeitura`, `Reflexoes`, `Certificado`, `ListaCertificados`).

### Chaves de Estado (`DataKey`)
| Chave | Tipo de Storage | Descrição |
|---|---|---|
| `Admin` | Instance | Endereço (`Address`) do administrador do contrato |
| `Hashes` | Instance | Mapeamento `Map<IdTexto, BytesN<32>>` com os hashes legados dos versículos |
| `MerkleRoot(VersaoBiblia)` | Persistent | Merkle Root SHA-256 (32 bytes) de uma versão inteira da Bíblia (`ARC`, `ACF`, `KJV`, `ASV`, `RVA`) |
| `Leituras` | Instance | Mapeamento `Map<(Address, IdTexto), bool>` de leitura de versículos |
| `MetaVersiculosLivro(u32)` | Persistent | Quantidade total de versículos que compõem um livro (ex: Gênesis = 1533) |
| `ProgressoLeitura(Address, u32)` | Persistent | Contador incremental de versículos lidos por um usuário em um livro |
| `RecompensaRecebida(Address, u32)` | Persistent | Flag prevenindo duplo resgate da recompensa de um livro |
| `Reflexoes(IdTexto, Address)` | Persistent | Estrutura `Reflexao` por versículo e autor |
| `ContadorReflexoes(IdTexto)` | Persistent | Total de reflexões públicas em um versículo |
| `ReflexoesPublicas(IdTexto, u32)` | Persistent | Mapeamento de índice para o autor da reflexão pública |
| `CurtidasReflexao(IdTexto, Address, Address)` | Persistent | Estado de curtida por (versículo, autor, curtidor) |
| `ComentariosReflexao(IdTexto, Address)` | Persistent | Lista `Vec<Comentario>` vinculada a uma reflexão |
| `StatusReflexoes(IdTexto, Address)` | Persistent | Estado da reflexão (`StatusReflexao::Ativa` ou `Removida`) |
| `Certificado(Address, TipoCertificado)` | Persistent | Marcação de emissão de certificado Soulbound evitando duplicidade |
| `ListaCertificados(Address)` | Persistent | Lista `Vec<Certificado>` armazenando credenciais do leitor |

---

## ⚡ Referência de Métodos da API (`ContratoBiblia`)

### 1. Administração & Autenticidade
- `initialize(admin: Address)`
- `registrar_hash(id_texto: IdTexto, hash: BytesN<32>)`
- `verificar_texto(id_texto: IdTexto, texto: Bytes) -> bool`
- `registrar_meta_livro(livro_id: u32, total_versiculos: u32)`

### 2. Merkle Tree & Múltiplas Versões
- `registrar_merkle_root_versao(admin: Address, versao: VersaoBiblia, merkle_root: BytesN<32>)`
- `obter_merkle_root_versao(versao: VersaoBiblia) -> Option<BytesN<32>>`
- `verificar_texto_merkle(versao: VersaoBiblia, id_texto: IdTexto, texto: Bytes, merkle_proof: Vec<BytesN<32>>) -> bool`

### 3. Prova de Leitura & Recompensas
- `marcar_lido(leitor: Address, id_texto: IdTexto)`
- `verificar_leitura(leitor: Address, id_texto: IdTexto) -> String`
- `reivindicar_recompensa_livro(leitor: Address, livro_id: u32)`

### 4. Categorização & Certificados On-Chain
- `obter_categoria_livro(livro_id: u32) -> Option<CategoriaLivro>`
- `obter_testamento_livro(livro_id: u32) -> Option<Testamento>`
- `verificar_conclusao_categoria(leitor: Address, categoria: CategoriaLivro) -> bool`
- `verificar_conclusao_testamento(leitor: Address, testamento: Testamento) -> bool`
- `emitir_certificado(leitor: Address, tipo: TipoCertificado) -> Certificado`
- `listar_certificados(leitor: Address) -> Vec<Certificado>`

### 5. Rede Social (Reflexões, Curtidas e Comentários)
- `adicionar_reflexao(leitor: Address, id_texto: IdTexto, conteudo: String, publica: bool)`
- `obter_reflexao(leitor: Address, id_texto: IdTexto) -> Option<Reflexao>`
- `listar_reflexoes_publicas(id_texto: IdTexto, limite: u32, offset: u32) -> Vec<Reflexao>`
- `curtir_reflexao(curtidor: Address, id_texto: IdTexto, autor_reflexao: Address)`
- `comentar_reflexao(comentarista: Address, id_texto: IdTexto, autor_reflexao: Address, conteudo: String)`
- `remover_comentario(usuario: Address, id_texto: IdTexto, autor_reflexao: Address, indice_comentario: u32)`

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Executar Testes Unitários
cargo test

# Compilar Contrato para WebAssembly
stellar contract build

# Gerar Merkle Trees das Versões Bíblicas via CLI Rust
cargo run --manifest-path scripts/ingestor/Cargo.toml
```
