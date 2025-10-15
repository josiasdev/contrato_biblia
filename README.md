# Contrato Bíblia (Stellar/Soroban)

Este projeto é uma implementação de um smart contract simples na blockchain Stellar, utilizando a plataforma Soroban e a linguagem de programação Rust. O objetivo é fornecer uma base descentralizada e imutável para aplicações relacionadas à Bíblia Sagrada.

O contrato foi desenvolvido como uma biblioteca Rust (`crate`) e pode ser compilado para WebAssembly (WASM) para ser implantado em qualquer rede Stellar que suporte Soroban (como `futurenet` ou a rede principal).

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
    # Crie uma identidade (ex: 'meu_admin')
    stellar keypair new meu_admin --save

    # Obtenha o endereço público
    ADMIN_ADDRESS=$(stellar keypair address --name meu_admin)

    # Use o Friendbot da Futurenet para obter XLM de teste
    # Acesse: [https://friendbot.stellar.org/?addr=](https://friendbot.stellar.org/?addr=)<SEU_ENDERECO_AQUI>&network=futurenet
    ```

2.  **Implante o Contrato:**
    ```bash
    stellar contract deploy \
      --wasm target/wasm32-unknown-unknown/release/contrato_biblia.wasm \
      --source meu_admin \
      --network futurenet
    ```
    Guarde o **ID do Contrato** (ex: `C...`) retornado por este comando.

### 3. Inicialização

Após a implantação, o contrato precisa ser inicializado com o endereço do administrador.

```bash
# Substitua as variáveis pelos seus valores
ID_DO_CONTRATO="C..."
ADMIN_ADDRESS="..." 

stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --source meu_admin \
  --network futurenet \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS
```

## Exemplos de Invocação de Funções

### Registrando o Hash de um Versículo (Apenas Admin)

O administrador pode registrar o hash de Gênesis 1:1.

```bash
ID_DO_CONTRATO="C..."
HASH_GEN_1_1="f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b"

stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --source meu_admin \
  --network futurenet \
  -- \
  registrar_hash \
  --id_texto GEN_1_1 \
  --hash $HASH_GEN_1_1
```

### Marcando um Versículo como Lido (Qualquer Usuário)

Um usuário (com uma conta `leitor_joao` fundada) pode marcar Gênesis 1:1 como lido.

```bash
ID_DO_CONTRATO="C..."

stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --source leitor_joao \
  --network futurenet \
  -- \
  marcar_lido \
  --id_texto GEN_1_1
```

### Verificando a Leitura de um Usuário

Qualquer pessoa pode verificar se `leitor_joao` leu o versículo.

```bash
ID_DO_CONTRATO="C..."
ENDERECO_DO_LEITOR="..."

stellar contract invoke \
  --id $ID_DO_CONTRATO \
  --network futurenet \
  -- \
  verificar_leitura \
  --leitor $ENDERECO_DO_LEITOR \
  --id_texto GEN_1_1
```
O resultado esperado é `true`.


## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.