# Bible Smart Contract (Stellar/Soroban)

🌐 **Languages / Idiomas:** **English** | [Português (Brasil)](README_PT_BR.md)

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![Stellar](https://img.shields.io/badge/stellar-%23000000.svg?style=for-the-badge&logo=stellar&logoColor=white)
![WebAssembly](https://img.shields.io/badge/webassembly-%23654FF0.svg?style=for-the-badge&logo=webassembly&logoColor=white)

A Rust smart contract library for the Stellar blockchain (Soroban) focused on a social and Bible study application.

For a detailed technical guide on the architecture and development, check the [Developer Guide](docs/DEVELOPER_GUIDE.md).

## Technologies Used

* **Language:** Rust (2021 Edition)
* **Blockchain:** Stellar (Futurenet / Testnet)
* **Smart Contract Platform:** Soroban
* **SDK:** `soroban-sdk`
* **CLI Tool:** `stellar-cli`

## Features

✅ **Text Authenticity**: Verification of Bible text integrity using SHA-256 hashes. <br>
✅ **Proof of Reading**: On-chain reading progress tracking system. <br>
✅ **Reward System**: Tracks reading progress and emits events (for off-chain backend processing) to distribute tokens (TAL) upon completing a book. <br>
✅ **Personal Reflections**: Users can write and store public or private reflections on Bible passages. <br>
✅ **Social Engagement**: Like and comment system to promote community interaction. <br>
✅ **Comment Management**: Users can add and delete their own comments. <br>
✅ **Moderation**: Status system for reflection management and moderation. <br>
✅ **Comprehensive Tests**: High unit test coverage across all major features. <br>
✅ **Type-Safe Documentation**: Fully documented Rust code with strongly typed structures.

## How to Build and Use

Follow the steps below to build, deploy, and interact with this contract.

### Prerequisites

Before getting started, make sure you have the following tools installed:

* **Rust Toolchain**: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
* **WASM Target**: 
```bash
rustup target add wasm32-unknown-unknown
```

* **Stellar CLI**:
```bash
npm install -g stellar-cli
```

### 1. Build
Clone this repository:
```bash
git clone https://github.com/josiasdev/contrato_biblia
cd contrato_biblia
```

To build the smart contract to WASM, run:

```bash
stellar contract build
```

This command will produce the `contrato_biblia.wasm` binary file inside `target/wasm32-unknown-unknown/release/`.

### 2. Deployment

To deploy the contract, you will need an account on the `futurenet` test network.

1.  **Create and Fund an Account:**
    ```bash
    # Create an admin identity
    stellar keys generate admin --network testnet --fund

    # Get the public address
    ADMIN_ADDRESS=$(stellar keys address admin)
    ```
    
    #### Use Friendbot to receive test XLM
    Visit: [Friendbot: fund a futurenet network account](https://lab.stellar.org/account/fund?$=network$id=futurenet&label=Futurenet&horizonUrl=https:////horizon-futurenet.stellar.org&rpcUrl=https:////rpc-futurenet.stellar.org&passphrase=Test%20SDF%20Future%20Network%20/;%20October%202022;;)

2.  **Deploy the Contract:**
    ```bash
    stellar contract deploy \
      --wasm target/wasm32-unknown-unknown/release/contrato_biblia.wasm \
      --source-account admin \
      --network futurenet \
      --alias contrato_biblia
    ```
    Save the returned **Contract ID** (e.g., `C...`).

### 3. Initialization

After deployment, the contract must be initialized with the administrator address.

```bash
CONTRACT_ID="C..."
ADMIN_ADDRESS=$(stellar keys address admin) 

stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account admin \
  --network futurenet \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS
```

## Function Invocation Examples

**Important Note:** This contract uses an `IdTexto` struct to identify verses. When invoking via CLI, pass parameters as JSON.
```bash
# Helper: JSON for Genesis 1:1 (Book 1, Chapter 1, Verse 1)
ID_TEXTO_JSON='{"livro":1,"capitulo":1,"versiculo":1}'
```

### Registering a Verse Hash (Admin Only)

The administrator can register the official SHA-256 hash for Genesis 1:1.

```bash
CONTRACT_ID="..."
HASH_GEN_1_1="f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b"

stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account admin \
  --network futurenet \
  -- \
  registrar_hash \
  --id_texto $ID_TEXTO_JSON \
  --hash $HASH_GEN_1_1
```

### Marking a Verse as Read (Any User)

A funded user account (`reader`) can mark Genesis 1:1 as read.

```bash
stellar keys generate reader --network futurenet
READER_ADDRESS=$(stellar keys address reader)

stellar contract invoke \
  --id $CONTRACT_ID \
  --source reader \
  --network futurenet \
  -- \
  marcar_lido \
  --leitor $READER_ADDRESS \
  --id_texto $ID_TEXTO_JSON
```

Expected response: `"Leitura registrada e progresso atualizado!"`

### Verifying User Reading Progress

Anyone can check if a user has read a verse.

```bash
CONTRACT_ID="..."
READER_ADDRESS=$(stellar keys address reader)

stellar contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network futurenet \
  -- \
  verificar_leitura \
  --leitor $READER_ADDRESS \
  --id_texto $ID_TEXTO_JSON
```

Expected output:
```json
"Leitura confirmada!"
```
Or if not read yet:
```json
"Registro de leitura não encontrado."
```

### Social Features (Reflections)

#### Adding a Public Reflection

A user adds a public reflection on Genesis 1:1.

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source reader \
  --network futurenet \
  -- \
  adicionar_reflexao \
  --leitor $READER_ADDRESS \
  --id_texto $ID_TEXTO_JSON \
  --conteudo "This passage is foundational." \
  --publica true
```

#### Liking a Reflection

Another user (`reader2`) likes the reflection.

```bash
stellar keys generate reader2 --network futurenet

stellar contract invoke \
  --id $CONTRACT_ID \
  --source reader2 \
  --network futurenet \
  -- \
  curtir_reflexao \
  --curtidor $(stellar keys address reader2) \
  --id_texto $ID_TEXTO_JSON \
  --autor_reflexao $READER_ADDRESS
```

#### Commenting on a Reflection

`reader2` leaves a comment on the reflection.

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source reader2 \
  --network futurenet \
  -- \
  comentar_reflexao \
  --comentarista $(stellar keys address reader2) \
  --id_texto $ID_TEXTO_JSON \
  --autor_reflexao $READER_ADDRESS \
  --conteudo "Fully agree! Great reflection."
```

#### Listing Public Reflections

Anyone can list public reflections for a passage (with pagination).

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

---

### Reward System (TAL Token)

#### 1. (Admin) Register Book Target

The admin sets the total number of verses in a book so the contract knows when reading is completed.

```bash
# Example: Setting Genesis (Book 1) with 1533 verses
stellar contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network futurenet \
  -- \
  registrar_meta_livro \
  --livro_id 1 \
  --total_versiculos 1533
```

#### 2. (User) Claim Reward for Completed Book

Upon reading all verses in a book, the user calls this function. It **emits an event** that an off-chain backend listens for to trigger token transfers.

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source reader \
  --network testnet \
  -- \
  reivindicar_recompensa_livro \
  --leitor $READER_ADDRESS \
  --livro_id 1
```

Upon success, the transaction finishes and emits the `RecompensaReivindicada` event on-chain for the backend listener to process the `TAL` token distribution.

## License

Distributed under the MIT License. See `LICENSE` for more information.