use soroban_sdk::{contracttype, Address, String, BytesN};

/// Versões da Bíblia Sagrada em Domínio Público / Open-Source
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VersaoBiblia {
    ARC, // Almeida Revista e Corrigida (PT)
    ACF, // Almeida Corrigida Fiel (PT)
    KJV, // King James Version (EN)
    ASV, // American Standard Version (EN)
    RVA, // Reina Valera Antigua (ES)
}

/// Testamento Bíblico
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Testamento {
    Antigo,
    Novo,
}

/// Categorias da Bíblia Sagrada (Canônicas Protestante/Evangélica - 66 Livros)
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
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

/// Tipo do Certificado Emitido
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum TipoCertificado {
    Livro(u32),
    Categoria(CategoriaLivro),
    Testamento(Testamento),
    BibliaCompleta,
}

/// Registro do Certificado On-Chain (Soulbound Credential)
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Certificado {
    pub leitor: Address,
    pub tipo: TipoCertificado,
    pub timestamp: u64,
    pub hash_certificado: BytesN<32>,
}

// Estrutura principal para armazenar reflexões dos usuários
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Reflexao {
    pub leitor: Address,
    pub id_texto: IdTexto,
    pub conteudo: String,
    pub timestamp: u64,
    pub hash_reflexao: BytesN<32>,
    pub publica: bool,
    pub curtidas: u32,
    pub destaque: bool,
    pub hash_midia_ipfs: Option<String>,
}

/// Estrutura para comentários em reflexões públicas
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Comentario {
    pub autor: Address,
    pub conteudo: String,
    pub timestamp: u64,
    pub curtidas: u32,
}

/// Enum para controle de status das reflexões
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

/// Registro de Sequência de Leitura Diária (Racha On-Chain)
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RachaLeitura {
    pub ultimo_timestamp: u64,
    pub dias_consecutivos: u32,
}

// Constantes para validação e limites do sistema
pub const MAX_REFLEXAO_CHARS: u32 = 500;
pub const MAX_COMENTARIO_CHARS: u32 = 200;