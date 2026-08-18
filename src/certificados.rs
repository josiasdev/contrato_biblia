use soroban_sdk::{Env, Address, Vec, BytesN, Bytes, contractevent};
use crate::types::*;
use crate::DataKey;

#[contractevent]
pub struct CertificadoEmitido {
    pub leitor: Address,
    pub tipo: TipoCertificado,
    pub hash_certificado: BytesN<32>,
    pub timestamp: u64,
}

/// Mapeia o ID do livro (1 a 66) para sua Categoria Canônica (Protestante/Evangélica)
pub fn obter_categoria_livro(livro_id: u32) -> Option<CategoriaLivro> {
    match livro_id {
        1..=5 => Some(CategoriaLivro::Pentateuco),
        6..=17 => Some(CategoriaLivro::HistoricosAT),
        18..=22 => Some(CategoriaLivro::Poeticos),
        23..=27 => Some(CategoriaLivro::ProfetasMaiores),
        28..=39 => Some(CategoriaLivro::ProfetasMenores),
        40..=43 => Some(CategoriaLivro::Evangelhos),
        44 => Some(CategoriaLivro::HistoricoNT),
        45..=57 => Some(CategoriaLivro::CartasPaulinas),
        58..=65 => Some(CategoriaLivro::CartasGerais),
        66 => Some(CategoriaLivro::Profecia),
        _ => None,
    }
}

/// Mapeia o ID do livro (1 a 66) para seu Testamento (Antigo ou Novo)
pub fn obter_testamento_livro(livro_id: u32) -> Option<Testamento> {
    match livro_id {
        1..=39 => Some(Testamento::Antigo),
        40..=66 => Some(Testamento::Novo),
        _ => None,
    }
}

/// Retorna a lista de IDs dos livros pertencentes a uma determinada categoria
pub fn obter_livros_da_categoria(categoria: CategoriaLivro) -> (u32, u32) {
    match categoria {
        CategoriaLivro::Pentateuco => (1, 5),
        CategoriaLivro::HistoricosAT => (6, 17),
        CategoriaLivro::Poeticos => (18, 22),
        CategoriaLivro::ProfetasMaiores => (23, 27),
        CategoriaLivro::ProfetasMenores => (28, 39),
        CategoriaLivro::Evangelhos => (40, 43),
        CategoriaLivro::HistoricoNT => (44, 44),
        CategoriaLivro::CartasPaulinas => (45, 57),
        CategoriaLivro::CartasGerais => (58, 65),
        CategoriaLivro::Profecia => (66, 66),
    }
}

/// Retorna a faixa de livros (inicio, fim) para um Testamento
pub fn obter_faixa_testamento(testamento: Testamento) -> (u32, u32) {
    match testamento {
        Testamento::Antigo => (1, 39),
        Testamento::Novo => (40, 66),
    }
}

/// Verifica se um leitor concluiu 100% de um livro individual
pub fn verificar_conclusao_livro(env: &Env, leitor: &Address, livro_id: u32) -> bool {
    let key_progresso = DataKey::ProgressoLeitura(leitor.clone(), livro_id);
    let progresso_atual: u32 = env.storage().persistent().get(&key_progresso).unwrap_or(0);

    let key_meta = DataKey::MetaVersiculosLivro(livro_id);
    if let Some(meta_total) = env.storage().persistent().get::<DataKey, u32>(&key_meta) {
        progresso_atual >= meta_total
    } else {
        false
    }
}

/// Verifica se um leitor concluiu 100% de todos os livros de uma categoria
pub fn verificar_conclusao_categoria(env: &Env, leitor: &Address, categoria: CategoriaLivro) -> bool {
    let (inicio, fim) = obter_livros_da_categoria(categoria);
    for livro_id in inicio..=fim {
        if !verificar_conclusao_livro(env, leitor, livro_id) {
            return false;
        }
    }
    true
}

/// Verifica se um leitor concluiu 100% de todos os livros de um testamento
pub fn verificar_conclusao_testamento(env: &Env, leitor: &Address, testamento: Testamento) -> bool {
    let (inicio, fim) = obter_faixa_testamento(testamento);
    for livro_id in inicio..=fim {
        if !verificar_conclusao_livro(env, leitor, livro_id) {
            return false;
        }
    }
    true
}

/// Verifica se um leitor concluiu a Bíblia completa (1 a 66)
pub fn verificar_conclusao_biblia(env: &Env, leitor: &Address) -> bool {
    for livro_id in 1..=66 {
        if !verificar_conclusao_livro(env, leitor, livro_id) {
            return false;
        }
    }
    true
}

/// Emite um certificado on-chain para o leitor
pub fn emitir_certificado(env: Env, leitor: Address, tipo: TipoCertificado) -> Certificado {
    leitor.require_auth();

    // 1. Impedir emissão duplicada do mesmo certificado para o mesmo leitor
    let key_cert = DataKey::Certificado(leitor.clone(), tipo.clone());
    if env.storage().persistent().has(&key_cert) {
        panic!("Certificado ja emitido para este leitor!");
    }

    // 2. Validar requisitos de conclusão conforme o tipo do certificado
    let requisito_cumprido = match &tipo {
        TipoCertificado::Livro(livro_id) => verificar_conclusao_livro(&env, &leitor, *livro_id),
        TipoCertificado::Categoria(cat) => verificar_conclusao_categoria(&env, &leitor, cat.clone()),
        TipoCertificado::Testamento(test) => verificar_conclusao_testamento(&env, &leitor, test.clone()),
        TipoCertificado::BibliaCompleta => verificar_conclusao_biblia(&env, &leitor),
    };

    if !requisito_cumprido {
        panic!("Requisitos de leitura nao foram concluidos para emitir este certificado!");
    }

    let timestamp = env.ledger().timestamp();

    // 3. Gerar Hash SHA-256 único do Certificado on-chain
    let hash_certificado: BytesN<32> = env.crypto().sha256(&Bytes::from_array(&env, &[timestamp as u8])).into();

    let certificado = Certificado {
        leitor: leitor.clone(),
        tipo: tipo.clone(),
        timestamp,
        hash_certificado: hash_certificado.clone(),
    };

    // 4. Salvar marcação individual e adicionar na lista do leitor
    env.storage().persistent().set(&key_cert, &true);

    let key_lista = DataKey::ListaCertificados(leitor.clone());
    let mut lista: Vec<Certificado> = env.storage().persistent().get(&key_lista).unwrap_or_else(|| Vec::new(&env));
    lista.push_back(certificado.clone());
    env.storage().persistent().set(&key_lista, &lista);

    // 5. Emitir evento on-chain para listeners off-chain
    CertificadoEmitido::publish(
        &CertificadoEmitido {
            leitor,
            tipo,
            hash_certificado,
            timestamp,
        },
        &env,
    );

    certificado
}

/// Retorna a lista de certificados conquistados por um leitor
pub fn listar_certificados(env: Env, leitor: Address) -> Vec<Certificado> {
    let key_lista = DataKey::ListaCertificados(leitor);
    env.storage().persistent().get(&key_lista).unwrap_or_else(|| Vec::new(&env))
}
