use soroban_sdk::{contracttype, Address, Symbol, String, BytesN};

// Estrutura principal para armazenar reflexões dos usuários
/// Combina o conteúdo com metadados para verificação e controle
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Reflexao {
    pub leitor: Address,
    pub id_texto: Symbol,
    pub conteudo: String,
    pub timestamp: u64,
    pub hash_reflexao: BytesN<32>,
    pub publica: bool,
    pub curtidas: u32,
}

/// Estrutura para comentários em reflexões públicas
/// Permite discussões e interações entre usuários
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Comentario {
    pub autor: Address,
    pub conteudo: String,
    pub timestamp: u64,
    pub curtidas: u32,
}

/// Enum para controle de status das reflexões
/// Permite moderação e controle de visibilidade
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum StatusReflexao {
    Ativa,
    Removida,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq, Ord, PartialOrd)]
pub struct IdTexto {
    pub livro: u32,
    pub capitulo: u32,
    pub versiculo: u32,
}

// Constantes para validação e limites do sistema
pub const MAX_REFLEXAO_CHARS: u32 = 500;
pub const MAX_COMENTARIO_CHARS: u32 = 200;