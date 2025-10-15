#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol, Address, Map, BytesN, String};
use core::cmp::Ordering;


#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin, //  Chave para o endereço do administrador
    Hashes, // Chave para o mapa de hashes dos textos (Symbol -> BytesN<32>)
    Leituras, // Chave para o mapa de leituras ((Address, Symbol) -> bool)
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

    pub fn registrar_hash(env: Env, id_texto: Symbol, hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut hashes: Map<Symbol, BytesN<32>> = env.storage().instance().get(&DataKey::Hashes).unwrap_or_else(|| Map::new(&env));

        hashes.set(id_texto, hash);
        env.storage().instance().set(&DataKey::Hashes, &hashes);
    }

    pub fn verificar_texto(env: Env, id_texto: Symbol, texto: soroban_sdk::Bytes) -> bool {
        let hash_calculado: BytesN<32> = env.crypto().sha256(&texto).into();

        let hashes: Map<Symbol, BytesN<32>> = env.storage().instance()
            .get(&DataKey::Hashes)
            .unwrap_or_else(|| Map::new(&env));

        if let Some(hash_oficial) = hashes.get(id_texto) {
            hash_oficial.cmp(&hash_calculado) == Ordering::Equal
        } else {
            false
        }
    }

    pub fn marcar_lido(env: Env, leitor:Address, id_texto: Symbol) {
        leitor.require_auth();
        let mut leituras: Map<(Address, Symbol), bool> = env.storage().instance().get(&DataKey::Leituras).unwrap_or_else(|| Map::new(&env));

        leituras.set((leitor, id_texto), true);
        env.storage().instance().set(&DataKey::Leituras, &leituras);
    }

    pub fn verificar_leitura(env: Env, leitor: Address, id_texto: Symbol) -> String {
        let leituras: Map<(Address, Symbol), bool> = env.storage().instance()
            .get(&DataKey::Leituras)
            .unwrap_or_else(|| Map::new(&env));
        if let Some(true) = leituras.get((leitor, id_texto)){
            String::from_slice(&env, "Leitura confirmada!")
        } else {
            String::from_slice(&env, "Registro de leitura não encontrado.")
        }

    }


}