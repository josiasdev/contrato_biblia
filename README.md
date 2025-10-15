# Contrato Bíblia (Stellar/Soroban)

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![Stellar](https://img.shields.io/badge/stellar-%23000000.svg?style=for-the-badge&logo=stellar&logoColor=white)
![WebAssembly](https://img.shields.io/badge/webassembly-%23654FF0.svg?style=for-the-badge&logo=webassembly&logoColor=white)

Uma biblioteca Rust para um smart contract na blockchain Stellar (Soroban) focado em uma aplicação da Bíblia Sagrada.

## Tecnologias Utilizadas

* **Linguagem:** Rust (Edição 2021)
* **Blockchain:** Stellar (Futurenet)
* **Plataforma de Smart Contracts:** Soroban
* **SDK:** `soroban-sdk`
* **Ferramenta de Linha de Comando:** `stellar-cli`

## Funcionalidades Principais

O contrato oferece duas funcionalidades essenciais:

1.  **Registro de Autenticidade**: Permite que um administrador registre o hash `SHA-256` de textos bíblicos (capítulos ou versículos). Isso cria um "selo digital" on-chain que pode ser usado para verificar se uma cópia digital do texto é autêntica e não foi adulterada.

2.  **Prova de Leitura**: Qualquer usuário pode interagir com o contrato para marcar um determinado texto como "lido". Isso cria um registro público e permanente do progresso de leitura de um indivíduo, que não pode ser censurado ou alterado.

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
  --id_texto GEN_1_1 \
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
  --id_texto GEN_1_1
```

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
  --id_texto GEN_1_1
```

O resultado esperado no terminal será uma `String` descritiva:
```json
"Leitura confirmada!"
```
Ou, caso o registro não exista:
```json
"Registro de leitura não encontrado."
```

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.