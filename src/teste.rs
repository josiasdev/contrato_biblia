#[cfg(test)]
mod tests {
    use crate::{ContratoBiblia, ContratoBibliaClient};
    use soroban_sdk::{
        testutils::Address as _,
        Address, Env, String, symbol_short
    };

    #[test]
    fn test_funcionalidades_basicas() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();


        client.initialize(&admin);

   
        env.mock_all_auths();


        client.registrar_hash(&id_texto, &hash_sha256);


        client.marcar_lido(&leitor, &id_texto);


        let status_leitura = client.verificar_leitura(&leitor, &id_texto);
        assert_eq!(status_leitura, String::from_str(&env, "Leitura confirmada!"));


        let texto_valido = client.verificar_texto(&id_texto, &texto.to_bytes());
        assert!(texto_valido);
    }

    #[test]
    fn test_reflexoes_completo() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let curtidor = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();


        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&leitor, &id_texto);


        let reflexao_conteudo = String::from_str(&env, "Esta passagem me faz refletir sobre...");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao_conteudo, &true);

        let reflexao = client.obter_reflexao(&leitor, &id_texto);
        assert!(reflexao.is_some());
        assert_eq!(reflexao.unwrap().conteudo, reflexao_conteudo);


        client.curtir_reflexao(&curtidor, &id_texto, &leitor);
        let reflexao_curtida = client.obter_reflexao(&leitor, &id_texto).unwrap();
        assert_eq!(reflexao_curtida.curtidas, 1);


        let comentario = String::from_str(&env, "Excelente reflexão!");
        client.comentar_reflexao(&curtidor, &id_texto, &leitor, &comentario);
        
        let comentarios = client.obter_comentarios(&id_texto, &leitor);
        assert_eq!(comentarios.len(), 1);
        assert_eq!(comentarios.get(0).unwrap().conteudo, comentario);

        client.curtir_reflexao(&curtidor, &id_texto, &leitor);
        let reflexao_descurtida = client.obter_reflexao(&leitor, &id_texto).unwrap();
        assert_eq!(reflexao_descurtida.curtidas, 0);
    }

    #[test]
    fn test_reflexoes_publicas() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor1 = Address::generate(&env);
        let leitor2 = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();


        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&leitor1, &id_texto);
        client.marcar_lido(&leitor2, &id_texto);


        let reflexao1 = String::from_str(&env, "Primeira reflexão pública");
        let reflexao2 = String::from_str(&env, "Segunda reflexão pública");
        
        client.adicionar_reflexao(&leitor1, &id_texto, &reflexao1, &true);
        client.adicionar_reflexao(&leitor2, &id_texto, &reflexao2, &true);


        let reflexoes_publicas = client.listar_reflexoes_publicas(&id_texto, &10, &0);
        assert_eq!(reflexoes_publicas.len(), 2);
    }

    #[test]
    fn test_reflexao_privada() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();

  
        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&leitor, &id_texto);

   
        let reflexao_conteudo = String::from_str(&env, "Reflexão privada");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao_conteudo, &false);

     
        let reflexoes_publicas = client.listar_reflexoes_publicas(&id_texto, &10, &0);
        assert_eq!(reflexoes_publicas.len(), 0);

  
        let reflexao = client.obter_reflexao(&leitor, &id_texto);
        assert!(reflexao.is_some());
        assert!(!reflexao.unwrap().publica);
    }

    #[test]
    #[should_panic]
    fn test_reflexao_sem_leitura() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();

        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);

     
        let reflexao_conteudo = String::from_str(&env, "Reflexão sem leitura");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao_conteudo, &true);
    }

    #[test]
    #[should_panic]
    fn test_reflexao_duplicada() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();

   
        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&leitor, &id_texto);

    
        let reflexao1 = String::from_str(&env, "Primeira reflexão");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao1, &true);

    
        let reflexao2 = String::from_str(&env, "Segunda reflexão");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao2, &true);
    }

    #[test]
    #[should_panic]
    fn test_reflexao_muito_longa() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();

   
        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&leitor, &id_texto);

      
        let reflexao_longa = String::from_str(&env, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao_longa, &true);
    }

    #[test]
    fn test_comentarios_funcionalidades() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let comentarista = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();


        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&leitor, &id_texto);

  
        let reflexao_conteudo = String::from_str(&env, "Reflexão sobre criação");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao_conteudo, &true);

     
        let comentario1 = String::from_str(&env, "Primeiro comentário");
        let comentario2 = String::from_str(&env, "Segundo comentário");
        
        client.comentar_reflexao(&comentarista, &id_texto, &leitor, &comentario1);
        client.comentar_reflexao(&comentarista, &id_texto, &leitor, &comentario2);

  
        let comentarios = client.obter_comentarios(&id_texto, &leitor);
        assert_eq!(comentarios.len(), 2);
        assert_eq!(comentarios.get(0).unwrap().conteudo, comentario1);
        assert_eq!(comentarios.get(1).unwrap().conteudo, comentario2);
    }

    #[test]
    fn test_remover_comentario() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let comentarista = Address::generate(&env);
        let id_texto = symbol_short!("GEN_1_1");
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();

        
        env.mock_all_auths();
        client.initialize(&admin);
        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&leitor, &id_texto);

        
        let reflexao_conteudo = String::from_str(&env, "Reflexão sobre criação");
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao_conteudo, &true);

      
        let comentario = String::from_str(&env, "Comentário para ser removido");
        client.comentar_reflexao(&comentarista, &id_texto, &leitor, &comentario);

      
        let comentarios_antes = client.obter_comentarios(&id_texto, &leitor);
        assert_eq!(comentarios_antes.len(), 1);

       
        client.remover_comentario(&comentarista, &id_texto, &leitor, &0);


        let comentarios_depois = client.obter_comentarios(&id_texto, &leitor);
        assert_eq!(comentarios_depois.len(), 0);
    }
}