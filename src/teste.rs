#[cfg(test)]
mod tests {
    use crate::{
        ContratoBiblia, ContratoBibliaClient, IdTexto, 
        CategoriaLivro, Testamento, TipoCertificado
    };
    use soroban_sdk::{
        testutils::Address as _,
        Address, Env, String
    };

    fn id_gen_1_1() -> IdTexto {
        IdTexto { livro: 1, capitulo: 1, versiculo: 1 }
    }

    #[test]
    fn test_funcionalidades_basicas() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let id_texto = id_gen_1_1();
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
    fn test_categorizacao_livros() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        // Testando Antigo Testamento
        assert_eq!(client.obter_categoria_livro(&1), Some(CategoriaLivro::Pentateuco));
        assert_eq!(client.obter_categoria_livro(&5), Some(CategoriaLivro::Pentateuco));
        assert_eq!(client.obter_categoria_livro(&6), Some(CategoriaLivro::HistoricosAT));
        assert_eq!(client.obter_categoria_livro(&18), Some(CategoriaLivro::Poeticos));
        assert_eq!(client.obter_categoria_livro(&23), Some(CategoriaLivro::ProfetasMaiores));
        assert_eq!(client.obter_categoria_livro(&28), Some(CategoriaLivro::ProfetasMenores));

        // Testando Novo Testamento
        assert_eq!(client.obter_categoria_livro(&40), Some(CategoriaLivro::Evangelhos));
        assert_eq!(client.obter_categoria_livro(&44), Some(CategoriaLivro::HistoricoNT));
        assert_eq!(client.obter_categoria_livro(&45), Some(CategoriaLivro::CartasPaulinas));
        assert_eq!(client.obter_categoria_livro(&58), Some(CategoriaLivro::CartasGerais));
        assert_eq!(client.obter_categoria_livro(&66), Some(CategoriaLivro::Profecia));

        // Testamento
        assert_eq!(client.obter_testamento_livro(&1), Some(Testamento::Antigo));
        assert_eq!(client.obter_testamento_livro(&39), Some(Testamento::Antigo));
        assert_eq!(client.obter_testamento_livro(&40), Some(Testamento::Novo));
        assert_eq!(client.obter_testamento_livro(&66), Some(Testamento::Novo));
    }

    #[test]
    fn test_emissao_certificado_livro() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);
        
        // Define meta do Livro 66 (Apocalipse tem 1 versiculo no teste)
        client.registrar_meta_livro(&66, &1);

        // Leitor marca o versiculo como lido
        client.marcar_lido(&leitor, &IdTexto { livro: 66, capitulo: 1, versiculo: 1 });

        // Emitir certificado de Livro
        let tipo = TipoCertificado::Livro(66);
        let cert = client.emitir_certificado(&leitor, &tipo);

        assert_eq!(cert.leitor, leitor);
        assert_eq!(cert.tipo, tipo);

        let lista = client.listar_certificados(&leitor);
        assert_eq!(lista.len(), 1);
        assert_eq!(lista.get(0).unwrap().tipo, tipo);
    }

    #[test]
    fn test_emissao_certificado_categoria() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);
        
        // Categoria HistoricoNT contem apenas o livro 44 (Atos)
        client.registrar_meta_livro(&44, &1);
        client.marcar_lido(&leitor, &IdTexto { livro: 44, capitulo: 1, versiculo: 1 });

        // Verificar conclusao da categoria
        let concluido = client.verificar_conclusao_categoria(&leitor, &CategoriaLivro::HistoricoNT);
        assert!(concluido);

        // Emitir certificado da Categoria HistoricoNT
        let tipo = TipoCertificado::Categoria(CategoriaLivro::HistoricoNT);
        let cert = client.emitir_certificado(&leitor, &tipo);

        assert_eq!(cert.tipo, tipo);
    }

    #[test]
    #[should_panic]
    fn test_certificado_sem_conclusao_should_panic() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);
        client.registrar_meta_livro(&1, &100);

        // Leitor leu apenas 1 versiculo de 100
        client.marcar_lido(&leitor, &IdTexto { livro: 1, capitulo: 1, versiculo: 1 });

        // Tentar emitir certificado sem completar
        client.emitir_certificado(&leitor, &TipoCertificado::Livro(1));
    }

    #[test]
    #[should_panic]
    fn test_certificado_duplicado_should_panic() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);
        client.registrar_meta_livro(&66, &1);
        client.marcar_lido(&leitor, &IdTexto { livro: 66, capitulo: 1, versiculo: 1 });

        let tipo = TipoCertificado::Livro(66);
        client.emitir_certificado(&leitor, &tipo);
        
        // Tentar emitir novamente o mesmo certificado
        client.emitir_certificado(&leitor, &tipo);
    }

    #[test]
    fn test_reflexoes_completo() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        let curtidor = Address::generate(&env);
        let id_texto = id_gen_1_1();
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
}