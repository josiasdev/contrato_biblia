# Contrato Bíblia (Stellar/Soroban)

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![Stellar](https://img.shields.io/badge/stellar-%23000000.svg?style=for-the-badge&logo=stellar&logoColor=white)
![WebAssembly](https://img.shields.io/badge/webassembly-%23654FF0.svg?style=for-the-badge&logo=webassembly&logoColor=white)

Uma biblioteca Rust para um smart contract na blockchain Stellar (Soroban) focado em uma aplicação social e de estudo da Bíblia Sagrada.


## Tecnologias Utilizadas

* **Linguagem:** Rust (Edição 2021)
* **Blockchain:** Stellar (Futurenet)
* **Plataforma de Smart Contracts:** Soroban
* **SDK:** `soroban-sdk`
* **Ferramenta de Linha de Comando:** `stellar-cli`

## Funcionalidades

✅ **Autenticidade de Textos**: Verificação da integridade de textos bíblicos usando hashes SHA-256. <br>
✅ **Prova de Leitura**: Sistema de registro de progresso de leitura na blockchain. <br>
✅ **Sistema de Recompensas**: Rastreia o progresso de leitura e emite eventos (via backend) para a distribuição de tokens (TAL) quando um livro é concluído. <br>
✅ **Reflexões Pessoais**: Usuários podem escrever e armazenar reflexões (públicas ou privadas) sobre passagens. <br>
✅ **Engajamento Social**: Sistema de curtidas e comentários para promover a interação comunitária. <br>
✅ **Gerenciamento de Comentários**: Usuários podem adicionar e remover seus próprios comentários. <br>
✅ **Moderação**: Sistema de status para gerenciamento e moderação de reflexões. <br>
✅ **Testes Abrangentes**: Cobertura de testes unitários para todas as principais funcionalidades. <br>
✅ **Documentação e Tipagem Segura**: Código totalmente documentado e com tipos de dados bem definidos.

## Como Compilar e Usar

Siga os passos abaixo para compilar, implantar e interagir com este contrato.

### Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:

* **Rust Toolchain**: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
* **WASM Target**: 
```bash
rustup target add wasm32-unknown-unknown
```

* **Stellar CLI**:
```bash
npm install -g stellar-cli
```

### 1. Compilação
Clone este repositório:
```bash
git clone https://github.com/josiasdev/contrato_biblia
cd contrato_biblia
```

Para compilar o contrato para WASM, execute:

```bash
stellar contract build
```

Este comando criará o arquivo `contrato_biblia.wasm` no diretório `target/wasm32-unknown-unknown/release/`.

### 2. Implantação (Deploy)

Para implantar o contrato, você precisará de uma conta na rede de testes `futurenet`.

1.  **Crie e Funde uma Conta:**
    ```bash
    # Crie uma identidade como admin
    stellar keys generate admin --network testnet --fund

    # Obtenha o endereço público
    ADMIN_ADDRESS=$(stellar keys address admin)
    ```
    
    #### Use o Friendbot da Futurenet para obter XLM de teste
    Acesse: [Friendbot: fund a futurenet network account](https://lab.stellar.org/account/fund?$=network$id=futurenet&label=Futurenet&horizonUrl=https:////horizon-futurenet.stellar.org&rpcUrl=https:////rpc-futurenet.stellar.org&passphrase=Test%20SDF%20Future%20Network%20/;%20October%202022;;)

2.  **Implante o Contrato:**
    ```bash
    stellar contract deploy \
      --wasm target/wasm32-unknown-unknown/release/contrato_biblia.wasm \
      --source-account admin \
      --network futurenet \ --alias contrato_biblia
    ```
    Guarde o **ID do Contrato** (ex: `C...`) retornado por este comando.

### 3. Inicialização

Após a implantação, o contrato precisa ser inicializado com o endereço do administrador.

```bash
# Substitua as variáveis pelos seus valores
ID_DO_CONTRATO="C..."
ADMIN_ADDRESS=$(stellar keys address admin) 

stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --source-account admin \
  --network futurenet \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS
```

## Exemplos de Invocação de Funções

**Nota Importante:** Este contrato usa uma `struct` `IdTexto` para identificar versículos. Ao invocar pela CLI, devemos passar um JSON.
```bash
# Helper: JSON para Gênesis 1:1 (Livro 1, Cap 1, Verso 1)
ID_TEXTO_JSON='{"livro":1,"capitulo":1,"versiculo":1}'
```

### Registrando o Hash de um Versículo (Apenas Admin)

O administrador pode registrar o hash de Gênesis 1:1.

```bash
ID_DO_CONTRATO="..."
HASH_GEN_1_1="f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b"

stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --source-account meu_admin \
  --network futurenet \
  -- \
  registrar_hash \
  --id_texto $ID_TEXTO_JSON \
  --hash $HASH_GEN_1_1
```

### Marcando um Versículo como Lido (Qualquer Usuário)

Um usuário (com uma conta `leitor_josias` fundada) pode marcar Gênesis 1:1 como lido.

```bash
stellar keys generate leitor --network futurenet
LEITOR_ADDRESS=$(stellar keys address leitor)

```

```bash
ID_DO_CONTRATO="..."
LEITOR_ADDRESS=$(stellar keys address leitor)


stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --source leitor \
  --network futurenet \
  -- \
  marcar_lido \
  -- leitor $LEITOR_ADDRESS \
  --id_texto $ID_TEXTO_JSON
```

O resultado esperado é: `"Leitura registrada e progresso atualizado!"`

### Verificando a Leitura de um Usuário

Qualquer pessoa pode verificar se `leitor` leu o versículo.

```bash
ID_DO_CONTRATO="..."
LEITOR_ADDRESS=$(stellar keys address leitor)

stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --source admin \
  --network futurenet \
  -- \
  verificar_leitura \
  --leitor $LEITOR_ADDRESS \
  --id_texto $ID_TEXTO_JSON
```

O resultado esperado no terminal será uma `String` descritiva:
```json
"Leitura confirmada!"
```
Ou, caso o registro não exista:
```json
"Registro de leitura não encontrado."
```

### Funções Sociais (Reflexões)

#### Adicionando uma Reflexão Pública

O `leitor_josias` adiciona uma reflexão sobre Gênesis 1:1.

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source leitor_josias \
  --network futurenet \
  -- \
  adicionar_reflexao \
  --leitor $LEITOR_ADDRESS \
  --id_texto $ID_TEXTO_JSON \
  --conteudo "Esta passagem é a base de tudo." \
  --publica true
```

#### Curtindo uma Reflexão

Um segundo usuário (`leitora_ana`) curte a reflexão do Josias.

```bash
# 1. Crie e funde a conta da 'leitora_ana'
stellar keys generate leitora_ana --network futurenet
# ... use o Friendbot

# 2. Invoque a função curtir_reflexao
stellar contract invoke \
  --id $CONTRACT_ID \
  --source leitora_ana \
  --network futurenet \
  -- \
  curtir_reflexao \
  --curtidor $(stellar keys address leitora_ana) \
  --id_texto $ID_TEXTO_JSON \
  --autor_reflexao $LEITOR_ADDRESS
```

#### Comentando em uma Reflexão

A `leitora_ana` também deixa um comentário.

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source leitora_ana \
  --network futurenet \
  -- \
  comentar_reflexao \
  --comentarista $(stellar keys address leitora_ana) \
  --id_texto $ID_TEXTO_JSON \
  --autor_reflexao $LEITOR_ADDRESS \
  --conteudo "Concordo plenamente! Ótima reflexão."
```

#### Listando Reflexões Públicas

Qualquer pessoa pode listar as reflexões públicas de uma passagem (com paginação).

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --network futurenet \
  -- \
  listar_reflexoes_publicas \
  --id_texto $ID_TEXTO_JSON \
  --limite 10 \
  --offset 0
```
O resultado será um vetor (`Vec`) contendo a estrutura completa da reflexão do `leitor_josias`.

---

### Sistema de Recompensas (Token TAL)

#### 1. (Admin) Registrar a Meta de um Livro

O admin define quantos versículos um livro tem para que o contrato saiba quando a leitura foi concluída.

```bash
# Exemplo: Definindo Gênesis (livro 1) com 1533 versículos
stellar contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network futurenet \
  -- \
  registrar_meta_livro \
  --livro_id 1 \
  --total_versiculos 1533
```

#### 2. (Usuário) Reivindicar Recompensa por Livro Concluído

Após ler todos os versículos (ex: 1533 de Gênesis), o usuário chama esta função. Ela não envia o token, mas **emite um evento** que um backend off-chain deve ouvir.

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source leitor_josias \
  --network testnet \
  -- \
  reivindicar_recompensa_livro \
  --leitor $LEITOR_ADDRESS \
  --livro_id 1
```
Se for bem-sucedido, a transação será concluída e o evento `RecompensaReivindicada` será emitido na blockchain para o backend processar o pagamento do token `TAL`.



## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.