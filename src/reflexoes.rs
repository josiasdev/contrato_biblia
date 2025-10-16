//! Módulo responsável por toda a lógica de reflexões pessoais
//! 
//! Este módulo implementa um sistema completo de reflexões onde usuários podem:
//! - Adicionar reflexões pessoais sobre textos bíblicos
//! - Compartilhar reflexões publicamente ou mantê-las privadas
//! - Interagir através de curtidas e comentários
//! - Navegar através de reflexões de outros usuários
//! - Remover seus próprios comentários

use soroban_sdk::{Env, Address, String, Vec, Map, Symbol};
use crate::{DataKey, Reflexao, Comentario, StatusReflexao, IdTexto, MAX_REFLEXAO_CHARS, MAX_COMENTARIO_CHARS};

/// Adiciona uma nova reflexão pessoal sobre um texto bíblico
/// 
/// Funcionalidade central que permite usuários expressarem seus pensamentos
/// sobre passagens bíblicas de forma permanente e verificável na blockchain.
/// 
/// Validações:
/// - Usuário deve estar autenticado
/// - Texto deve existir no sistema
/// - Usuário deve ter lido o texto previamente
/// - Apenas uma reflexão por usuário por texto
/// - Respeita limite de caracteres para otimização de custos
pub fn adicionar_reflexao(
    env: Env,
    leitor: Address,
    id_texto: IdTexto,
    conteudo: String,
    publica: bool,
) {
    
    leitor.require_auth();
    
    
    if conteudo.len() > MAX_REFLEXAO_CHARS {
        panic!("Reflexão muito longa");
    }
    
    if conteudo.len() == 0 {
        panic!("Reflexão não pode estar vazia");
    }
    
    
    let hashes: Map<IdTexto, soroban_sdk::BytesN<32>> = env.storage()
        .instance()
        .get(&DataKey::Hashes)
        .unwrap_or(Map::new(&env));
    
    if !hashes.contains_key(id_texto.clone()) {
        panic!("Texto não registrado");
    }
    
   
    let key_leitura = (leitor.clone(), id_texto.clone());
    let leituras: Map<(Address, IdTexto), bool> = env.storage()
        .instance()
        .get(&DataKey::Leituras)
        .unwrap_or(Map::new(&env));
    
    if !leituras.get(key_leitura).unwrap_or(false) {
        panic!("Precisa ler o texto antes de refletir");
    }
    

    let key_reflexao = DataKey::Reflexoes(id_texto.clone(), leitor.clone());
    if env.storage().persistent().has(&key_reflexao) {
        panic!("Já existe uma reflexão sua para este texto");
    }
    

    let hash_conteudo = env.crypto().sha256(&conteudo.to_bytes()).into();
    

    let reflexao = Reflexao {
        leitor: leitor.clone(),
        id_texto: id_texto.clone(),
        conteudo,
        timestamp: env.ledger().timestamp(),
        hash_reflexao: hash_conteudo,
        publica,
        curtidas: 0,
    };
    

    env.storage().persistent().set(&key_reflexao, &reflexao);
    
    let key_status = DataKey::StatusReflexoes(id_texto.clone(), leitor.clone());
    env.storage().persistent().set(&key_status, &StatusReflexao::Ativa);
    
    if publica {
        let mut contador: u32 = env.storage()
            .persistent()
            .get(&DataKey::ContadorReflexoes(id_texto.clone()))
            .unwrap_or(0);
        
        env.storage().persistent().set(
            &DataKey::ReflexoesPublicas(id_texto.clone(), contador),
            &leitor
        );
        
        contador += 1;
        env.storage().persistent().set(
            &DataKey::ContadorReflexoes(id_texto.clone()),
            &contador
        );
    }
}

pub fn obter_reflexao(
    env: Env,
    leitor: Address,
    id_texto: IdTexto,
) -> Option<Reflexao> {
    let key = DataKey::Reflexoes(id_texto.clone(), leitor.clone());
    let key_status = DataKey::StatusReflexoes(id_texto, leitor);
    
    let status: StatusReflexao = env.storage()
        .persistent()
        .get(&key_status)
        .unwrap_or(StatusReflexao::Ativa);
    
    match status {
        StatusReflexao::Removida => None,
        StatusReflexao::Ativa => env.storage().persistent().get(&key),
    }
}

pub fn listar_reflexoes_publicas(
    env: Env,
    id_texto: IdTexto,
    limite: u32,
    offset: u32,
) -> Vec<Reflexao> {
    let contador: u32 = env.storage()
        .persistent()
        .get(&DataKey::ContadorReflexoes(id_texto.clone()))
        .unwrap_or(0);
    
    let mut reflexoes = Vec::new(&env);
    let fim = (offset + limite).min(contador);
    
    for i in offset..fim {
        if let Some(leitor) = env.storage()
            .persistent()
            .get::<DataKey, Address>(&DataKey::ReflexoesPublicas(id_texto.clone(), i)) {
            
            let key_status = DataKey::StatusReflexoes(id_texto.clone(), leitor.clone());
            let status: StatusReflexao = env.storage()
                .persistent()
                .get(&key_status)
                .unwrap_or(StatusReflexao::Ativa);
            
            if let StatusReflexao::Ativa = status {
                if let Some(reflexao) = env.storage()
                    .persistent()
                    .get::<DataKey, Reflexao>(&DataKey::Reflexoes(id_texto.clone(), leitor)) {
                    
                    if reflexao.publica {
                        reflexoes.push_back(reflexao);
                    }
                }
            }
        }
    }
    
    reflexoes
}

/// Sistema de curtidas tipo "like" para engajamento
/// 
/// Cria gamificação e permite que a comunidade destaque
/// reflexões valiosas através de um sistema de votação simples.
/// Funciona como toggle para permitir descurtir.
pub fn curtir_reflexao(
    env: Env,
    curtidor: Address,
    id_texto: IdTexto,
    autor_reflexao: Address,
) {
    curtidor.require_auth();
    
    let key_reflexao = DataKey::Reflexoes(id_texto.clone(), autor_reflexao.clone());
    let mut reflexao: Reflexao = env.storage()
        .persistent()
        .get(&key_reflexao)
        .expect("Reflexão não encontrada");
    
    let key_status = DataKey::StatusReflexoes(id_texto.clone(), autor_reflexao.clone());
    let status: StatusReflexao = env.storage()
        .persistent()
        .get(&key_status)
        .unwrap_or(StatusReflexao::Ativa);
    
    if let StatusReflexao::Removida = status {
        panic!("Reflexão foi removida");
    }
    
    if !reflexao.publica {
        panic!("Reflexão não é pública");
    }
    
    let key_curtida = DataKey::CurtidasReflexao(id_texto.clone(), autor_reflexao.clone(), curtidor.clone());
    let ja_curtiu: bool = env.storage()
        .persistent()
        .get(&key_curtida)
        .unwrap_or(false);
    
    if ja_curtiu {
        env.storage().persistent().remove(&key_curtida);
        reflexao.curtidas = reflexao.curtidas.saturating_sub(1);
    } else {
        env.storage().persistent().set(&key_curtida, &true);
        reflexao.curtidas += 1;
    }
    
    env.storage().persistent().set(&key_reflexao, &reflexao);
}

/// Sistema de comentários para discussões
/// 
/// Transforma reflexões individuais em pontos de discussão,
/// criando uma comunidade interativa em torno do estudo bíblico.
/// Comentários são permanentes e ordenados cronologicamente.
pub fn comentar_reflexao(
    env: Env,
    comentarista: Address,
    id_texto: IdTexto,
    autor_reflexao: Address,
    conteudo: String,
) {
    comentarista.require_auth();
    
    if conteudo.len() > MAX_COMENTARIO_CHARS {
        panic!("Comentário muito longo");
    }
    
    if conteudo.len() == 0 {
        panic!("Comentário não pode estar vazio");
    }
    
    let key_reflexao = DataKey::Reflexoes(id_texto.clone(), autor_reflexao.clone());
    let reflexao: Reflexao = env.storage()
        .persistent()
        .get(&key_reflexao)
        .expect("Reflexão não encontrada");
    
    if !reflexao.publica {
        panic!("Não é possível comentar reflexão privada");
    }
    
    let key_status = DataKey::StatusReflexoes(id_texto.clone(), autor_reflexao.clone());
    let status: StatusReflexao = env.storage()
        .persistent()
        .get(&key_status)
        .unwrap_or(StatusReflexao::Ativa);
    
    if let StatusReflexao::Removida = status {
        panic!("Reflexão foi removida");
    }
    
    let comentario = Comentario {
        autor: comentarista,
        conteudo,
        timestamp: env.ledger().timestamp(),
        curtidas: 0,
    };
    
    let key_comentarios = DataKey::ComentariosReflexao(id_texto, autor_reflexao);
    let mut comentarios: Vec<Comentario> = env.storage()
        .persistent()
        .get(&key_comentarios)
        .unwrap_or(Vec::new(&env));
    
    comentarios.push_back(comentario);
    env.storage().persistent().set(&key_comentarios, &comentarios);
}

/// Verifica status para controle de moderação
/// 
/// Sistema simples de moderação que permite ocultar
/// conteúdo inadequado sem perder os dados permanentemente.
pub fn obter_comentarios(
    env: Env,
    id_texto: IdTexto,
    autor_reflexao: Address,
) -> Vec<Comentario> {
    let key_comentarios = DataKey::ComentariosReflexao(id_texto, autor_reflexao);
    env.storage()
        .persistent()
        .get(&key_comentarios)
        .unwrap_or(Vec::new(&env))
}

/// Verifica status para controle de moderação
/// 
/// Sistema simples de moderação que permite ocultar
/// conteúdo inadequado sem perder os dados permanentemente.
pub fn verificar_status_reflexao(
    env: Env,
    id_texto: IdTexto,
    autor_reflexao: Address,
) -> StatusReflexao {
    let key_status = DataKey::StatusReflexoes(id_texto, autor_reflexao);
    env.storage()
        .persistent()
        .get(&key_status)
        .unwrap_or(StatusReflexao::Ativa)
}

/// Remove um comentário específico de uma reflexão
/// 
/// Permite que usuários removam seus próprios comentários.
/// Apenas o autor do comentário pode removê-lo.
/// Remove o comentário da lista permanentemente.
pub fn remover_comentario(
    env: Env,
    usuario: Address,
    id_texto: IdTexto,
    autor_reflexao: Address,
    indice_comentario: u32,
) {
    usuario.require_auth();
    
    let key_comentarios = DataKey::ComentariosReflexao(id_texto, autor_reflexao);
    let mut comentarios: Vec<Comentario> = env.storage()
        .persistent()
        .get(&key_comentarios)
        .unwrap_or(Vec::new(&env));
    
    if indice_comentario >= comentarios.len() {
        panic!("Índice de comentário inválido");
    }
    
    let comentario = comentarios.get(indice_comentario).unwrap();
    if comentario.autor != usuario {
        panic!("Apenas o autor pode remover o comentário");
    }
    
    comentarios.remove(indice_comentario);
    env.storage().persistent().set(&key_comentarios, &comentarios);
}