#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, contractevent, Env, Address, Map, BytesN, String, Vec};
use core::cmp::Ordering;

mod types;
mod reflexoes;
mod certificados;

pub use types::*;
pub use reflexoes::*;
pub use certificados::*;

#[contractevent]
struct RecompensaReivindicada {
    leitor: Address,
    livro_id: u32,
    valor: u128,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin, //  Chave para o endereço do administrador
    Hashes, // Chave para o mapa de hashes dos textos (Map<IdTexto, BytesN<32>>)
    Leituras, // Chave para o mapa de leituras Map será Map<(Address, IdTexto), bool>
    MetaVersiculosLivro(u32), // (Admin) Armazena o total de versículos de um livro (ex: Livro 1 -> 1533)
    ProgressoLeitura(Address, u32), // (Usuário) Conta quantos versículos um leitor leu de um livro (ex: (Josias, Livro 1) -> 500)
    RecompensaRecebida(Address, u32), // (Sistema) Marca se um leitor JÁ recebeu a recompensa por um livro (ex: (Josias, Livro 1) -> true)
    Reflexoes(IdTexto, Address),
    ContadorReflexoes(IdTexto),
    ReflexoesPublicas(IdTexto, u32),
    CurtidasReflexao(IdTexto, Address, Address),
    ComentariosReflexao(IdTexto, Address),
    StatusReflexoes(IdTexto, Address),
    Certificado(Address, TipoCertificado), // Marca se um leitor já emitiu determinado certificado
    ListaCertificados(Address),            // Vec<Certificado> por leitor
    MerkleRoot(VersaoBiblia),              // Merkle Root SHA-256 de uma versão completa da Bíblia
    TokenTAL,                              // Address do contrato do Token TAL (Stellar Asset Contract / SAC)
}

#[contract]
pub struct ContratoBiblia;

#[contractimpl]
impl ContratoBiblia {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contrato já inicializado");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn registrar_hash(env: Env, id_texto: IdTexto, hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut hashes: Map<IdTexto, BytesN<32>> = env.storage().instance().get(&DataKey::Hashes).unwrap_or_else(|| Map::new(&env));

        hashes.set(id_texto, hash);
        env.storage().instance().set(&DataKey::Hashes, &hashes);
    }

    pub fn verificar_texto(env: Env, id_texto: IdTexto, texto: soroban_sdk::Bytes) -> bool {
        let hash_calculado: BytesN<32> = env.crypto().sha256(&texto).into();

        let hashes: Map<IdTexto, BytesN<32>> = env.storage().instance()
            .get(&DataKey::Hashes)
            .unwrap_or_else(|| Map::new(&env));

        if let Some(hash_oficial) = hashes.get(id_texto) {
            hash_oficial.cmp(&hash_calculado) == Ordering::Equal
        } else {
            false
        }
    }

    pub fn marcar_lido(env: Env, leitor: Address, id_texto: IdTexto) {
        leitor.require_auth();

        let key_leitura = (leitor.clone(), id_texto.clone());

        let mut leituras: Map<(Address, IdTexto), bool> = env.storage().instance().get(&DataKey::Leituras).unwrap_or_else(|| Map::new(&env));

        if !leituras.get(key_leitura.clone()).unwrap_or(false) {
            leituras.set(key_leitura, true);
            env.storage().instance().set(&DataKey::Leituras, &leituras);

            let livro_id = id_texto.livro;
            let key_progresso = DataKey::ProgressoLeitura(leitor.clone(), livro_id);

            let mut progresso_atual: u32 = env.storage().persistent().get(&key_progresso).unwrap_or(0);
            progresso_atual += 1;
            env.storage().persistent().set(&key_progresso, &progresso_atual);
            String::from_str(&env, "Leitura registrada e progresso atualizado!");
        } else {
            String::from_str(&env, "Este versículo já foi marcado como lido.");
        }
    }

    pub fn verificar_leitura(env: Env, leitor: Address, id_texto: IdTexto) -> String {
        let leituras: Map<(Address, IdTexto), bool> = env.storage().instance()
            .get(&DataKey::Leituras)
            .unwrap_or_else(|| Map::new(&env));
        if let Some(true) = leituras.get((leitor, id_texto)) {
            String::from_str(&env, "Leitura confirmada!")
        } else {
            String::from_str(&env, "Registro de leitura não encontrado.")
        }
    }

    // Permite que os usuários adicionarem reflexões pessoais sobre textos bíblicos
    pub fn adicionar_reflexao(
        env: Env,
        leitor: Address,
        id_texto: IdTexto,
        conteudo: String,
        publica: bool,
    ) {
        reflexoes::adicionar_reflexao(env, leitor, id_texto, conteudo, publica)
    }

    pub fn obter_reflexao(
        env: Env,
        leitor: Address,
        id_texto: IdTexto,
    ) -> Option<Reflexao> {
        reflexoes::obter_reflexao(env, leitor, id_texto)
    }

    pub fn listar_reflexoes_publicas(
        env: Env,
        id_texto: IdTexto,
        limite: u32,
        offset: u32,
    ) -> Vec<Reflexao> {
        reflexoes::listar_reflexoes_publicas(env, id_texto, limite, offset)
    }

    pub fn curtir_reflexao(
        env: Env,
        curtidor: Address,
        id_texto: IdTexto,
        autor_reflexao: Address,
    ) {
        reflexoes::curtir_reflexao(env, curtidor, id_texto, autor_reflexao)
    }

    pub fn comentar_reflexao(
        env: Env,
        comentarista: Address,
        id_texto: IdTexto,
        autor_reflexao: Address,
        conteudo: String,
    ) {
        reflexoes::comentar_reflexao(env, comentarista, id_texto, autor_reflexao, conteudo)
    }

    pub fn remover_comentario(
        env: Env,
        usuario: Address,
        id_texto: IdTexto,
        autor_reflexao: Address,
        indice_comentario: u32,
    ) {
        reflexoes::remover_comentario(env, usuario, id_texto, autor_reflexao, indice_comentario)
    }

    pub fn obter_comentarios(
        env: Env,
        id_texto: IdTexto,
        autor_reflexao: Address,
    ) -> Vec<Comentario> {
        reflexoes::obter_comentarios(env, id_texto, autor_reflexao)
    }

    pub fn verificar_status_reflexao(
        env: Env,
        id_texto: IdTexto,
        autor_reflexao: Address,
    ) -> StatusReflexao {
        reflexoes::verificar_status_reflexao(env, id_texto, autor_reflexao)
    }

    pub fn registrar_meta_livro(env: Env, livro_id: u32, total_versiculos: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let key = DataKey::MetaVersiculosLivro(livro_id);
        env.storage().persistent().set(&key, &total_versiculos);
    }

    /// (Admin) Configura o endereço do contrato do Token TAL (Soroban Asset Contract / SAC)
    pub fn configurar_token_tal(env: Env, token_address: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Contrato não inicializado");
        admin.require_auth();

        env.storage().instance().set(&DataKey::TokenTAL, &token_address);
    }

    /// Retorna o endereço do contrato do Token TAL configurado
    pub fn obter_token_tal(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::TokenTAL)
    }

    pub fn reivindicar_recompensa_livro(env: Env, leitor: Address, livro_id: u32) {
        leitor.require_auth();

        let key_recompensa = DataKey::RecompensaRecebida(leitor.clone(), livro_id);
        if env.storage().persistent().has(&key_recompensa) {
            panic!("Recompensa por este livro já foi recebida!");
        }

        let key_progresso = DataKey::ProgressoLeitura(leitor.clone(), livro_id);
        let progresso_atual: u32 = env.storage().persistent().get(&key_progresso).unwrap_or(0);

        let key_meta = DataKey::MetaVersiculosLivro(livro_id);
        let meta_total: u32 = env.storage().persistent().get(&key_meta)
            .expect("Meta para este livro não foi definida pelo admin");

        if progresso_atual < meta_total {
            panic!("Livro ainda não concluído. Continue lendo!");
        }

        env.storage().persistent().set(&key_recompensa, &true);

        let recompensa_em_tokens: i128 = 100_0000000;

        // Se o contrato do Token TAL estiver configurado, realiza a transferência direta de 100 TAL on-chain
        if let Some(token_address) = env.storage().instance().get::<DataKey, Address>(&DataKey::TokenTAL) {
            let token_client = soroban_sdk::token::Client::new(&env, &token_address);
            token_client.transfer(&env.current_contract_address(), &leitor, &recompensa_em_tokens);
        }

        RecompensaReivindicada::publish(
            &RecompensaReivindicada{
                leitor: leitor,
                livro_id: livro_id,
                valor: recompensa_em_tokens as u128
            }, &env
        );
    }

    // --- NOVAS FUNÇÕES: CATEGORIZAÇÃO E SISTEMA DE CERTIFICADOS ---

    /// Retorna a categoria canônica de um livro (1 a 66)
    pub fn obter_categoria_livro(_env: Env, livro_id: u32) -> Option<CategoriaLivro> {
        certificados::obter_categoria_livro(livro_id)
    }

    /// Retorna o testamento de um livro (1 a 66)
    pub fn obter_testamento_livro(_env: Env, livro_id: u32) -> Option<Testamento> {
        certificados::obter_testamento_livro(livro_id)
    }

    /// Consulta se um leitor concluiu 100% de uma categoria bíblica
    pub fn verificar_conclusao_categoria(env: Env, leitor: Address, categoria: CategoriaLivro) -> bool {
        certificados::verificar_conclusao_categoria(&env, &leitor, categoria)
    }

    /// Consulta se um leitor concluiu 100% de um testamento
    pub fn verificar_conclusao_testamento(env: Env, leitor: Address, testamento: Testamento) -> bool {
        certificados::verificar_conclusao_testamento(&env, &leitor, testamento)
    }

    /// Emite um certificado on-chain (Livro, Categoria, Testamento ou Bíblia Completa)
    pub fn emitir_certificado(env: Env, leitor: Address, tipo: TipoCertificado) -> Certificado {
        certificados::emitir_certificado(env, leitor, tipo)
    }

    /// Retorna a lista de certificados conquistados por um leitor
    pub fn listar_certificados(env: Env, leitor: Address) -> Vec<Certificado> {
        certificados::listar_certificados(env, leitor)
    }

    // --- SUPORTE A MÚLTIPLAS VERSÕES & MERKLE TREE ---

    /// (Admin) Registra a Merkle Root SHA-256 de uma versão completa da Bíblia Sagrada
    pub fn registrar_merkle_root_versao(env: Env, versao: VersaoBiblia, merkle_root: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Contrato não inicializado");
        admin.require_auth();

        env.storage().persistent().set(&DataKey::MerkleRoot(versao), &merkle_root);
    }

    /// Retorna a Merkle Root gravada para determinada versão da Bíblia
    pub fn obter_merkle_root_versao(env: Env, versao: VersaoBiblia) -> Option<BytesN<32>> {
        env.storage().persistent().get(&DataKey::MerkleRoot(versao))
    }

    /// Verifica a integridade de um texto contra a Merkle Root da versão usando Merkle Proof
    pub fn verificar_texto_merkle(
        env: Env,
        versao: VersaoBiblia,
        id_texto: IdTexto,
        texto: soroban_sdk::Bytes,
        merkle_proof: Vec<BytesN<32>>,
    ) -> bool {
        let stored_root: BytesN<32> = match env.storage().persistent().get(&DataKey::MerkleRoot(versao)) {
            Some(root) => root,
            None => return false,
        };

        // 1. Calcular o hash da folha: SHA-256([livro, capitulo, versiculo, texto])
        let mut leaf_bytes = soroban_sdk::Bytes::new(&env);
        leaf_bytes.append(&soroban_sdk::Bytes::from_array(&env, &[
            id_texto.livro as u8,
            id_texto.capitulo as u8,
            id_texto.versiculo as u8,
        ]));
        leaf_bytes.append(&texto);
        let mut current_hash: BytesN<32> = env.crypto().sha256(&leaf_bytes).into();

        // 2. Traversar a prova de Merkle
        for i in 0..merkle_proof.len() {
            let sibling = merkle_proof.get(i).unwrap();
            let mut combine = soroban_sdk::Bytes::new(&env);
            
            if current_hash < sibling {
                combine.append(&current_hash.to_bytes());
                combine.append(&sibling.to_bytes());
            } else {
                combine.append(&sibling.to_bytes());
                combine.append(&current_hash.to_bytes());
            }

            current_hash = env.crypto().sha256(&combine).into();
        }

        // 3. Comparar a raiz calculada com a Merkle Root armazenada no contrato
        current_hash == stored_root
    }
}

#[cfg(test)]
mod teste;