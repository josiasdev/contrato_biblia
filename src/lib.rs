#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Address, Map, BytesN, String, Vec};
use core::cmp::Ordering;

mod types;
mod reflexoes;

pub use types::*;
pub use reflexoes::*;

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
}

#[contract]
pub struct ContratoBiblia;

#[contractimpl]
impl ContratoBiblia {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin){
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
        if let Some(true) = leituras.get((leitor, id_texto)){
            String::from_str(&env, "Leitura confirmada!")
        } else {
            String::from_str(&env, "Registro de leitura não encontrado.")
        }
    }

    // Permite que os usuários adicionarem reflexões pessoais sobre textos bíblicos
    // pode ser pública (visível para todos) ou privada (apenas para o autor)
    // Requer que o usuário tenha marcado o texto como lido
    // Cada usuário pode ter apenas uma reflexão por texto 

    pub fn adicionar_reflexao(
        env: Env,
        leitor: Address,
        id_texto: IdTexto,
        conteudo: String,
        publica: bool,
    ) {
        reflexoes::adicionar_reflexao(env, leitor, id_texto, conteudo, publica)
    }

    // Obtém uma reflexão específica de um usuário sobre um texto
    /// Retorna None se a reflexão não existir ou foi removida
    pub fn obter_reflexao(
        env: Env,
        leitor: Address,
        id_texto: IdTexto,
    ) -> Option<Reflexao> {
        reflexoes::obter_reflexao(env, leitor, id_texto)
    }

    /// Lista reflexões públicas de um texto específico com paginação
    /// Permite navegação através de grandes volumes de reflexões
    /// Filtra automaticamente reflexões removidas ou privadas
    pub fn listar_reflexoes_publicas(
        env: Env,
        id_texto: IdTexto,
        limite: u32,
        offset: u32,
    ) -> Vec<Reflexao> {
        reflexoes::listar_reflexoes_publicas(env, id_texto, limite, offset)
    }

    /// Sistema de engajamento: permite curtir/descurtir reflexões públicas
    /// Funciona como toggle: se já curtiu, remove a curtida
    /// Incrementa/decrementa contador de curtidas da reflexão
    pub fn curtir_reflexao(
        env: Env,
        curtidor: Address,
        id_texto: IdTexto,
        autor_reflexao: Address,
    ) {
        reflexoes::curtir_reflexao(env, curtidor, id_texto, autor_reflexao)
    }

    /// Permite adicionar comentários em reflexões públicas
    /// Cria discussões e interações entre usuários
    /// Comentários ficam permanentemente armazenados no blockchain
    pub fn comentar_reflexao(
        env: Env,
        comentarista: Address,
        id_texto: IdTexto,
        autor_reflexao: Address,
        conteudo: String,
    ) {
        reflexoes::comentar_reflexao(env, comentarista, id_texto, autor_reflexao, conteudo)
    }

    /// Remove um comentário específico do usuário
    /// Apenas o autor do comentário pode removê-lo
    pub fn remover_comentario(
        env: Env,
        usuario: Address,
        id_texto: IdTexto,
        autor_reflexao: Address,
        indice_comentario: u32,
    ) {
        reflexoes::remover_comentario(env, usuario, id_texto, autor_reflexao, indice_comentario)
    }

    /// Obtém todos os comentários de uma reflexão específica
    /// Retorna lista ordenada cronologicamente
    pub fn obter_comentarios(
        env: Env,
        id_texto: IdTexto,
        autor_reflexao: Address,
    ) -> Vec<Comentario> {
        reflexoes::obter_comentarios(env, id_texto, autor_reflexao)
    }

    /// Verifica o status atual de uma reflexão (ativa ou removida)
    /// Usado para controle de moderação e visibilidade
    pub fn verificar_status_reflexao(
        env: Env,
        id_texto: IdTexto,
        autor_reflexao: Address,
    ) -> StatusReflexao {
        reflexoes::verificar_status_reflexao(env, id_texto, autor_reflexao)
    }


    /// (Admin) Define o número total de versículos de um livro.
    /// Ex: livro 1 (Gênesis) tem 1533 versículos.
    pub fn registrar_meta_livro(env: Env, livro_id: u32, total_versiculos: u32){
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let key = DataKey::MetaVersiculosLivro(livro_id);
        env.storage().persistent().set(&key, &total_versiculos);
    }
}

#[cfg(test)]
mod teste;