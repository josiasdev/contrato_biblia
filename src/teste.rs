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
        client.adicionar_reflexao(&leitor, &id_texto, &reflexao_conteudo, &true, &None);

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
    fn test_merkle_root_versao() {
        use crate::VersaoBiblia;
        use soroban_sdk::{Bytes, BytesN, Vec};

        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        env.mock_all_auths();
        client.initialize(&admin);

        let id_texto = id_gen_1_1();
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");

        // Folha 1 (Gen 1:1)
        let mut leaf1_bytes = Bytes::new(&env);
        leaf1_bytes.append(&Bytes::from_array(&env, &[1, 1, 1]));
        leaf1_bytes.append(&texto.to_bytes());
        let hash1: BytesN<32> = env.crypto().sha256(&leaf1_bytes).into();

        // Folha 2 (Folha irmã fictícia Gen 1:2)
        let mut leaf2_bytes = Bytes::new(&env);
        leaf2_bytes.append(&Bytes::from_array(&env, &[1, 1, 2]));
        leaf2_bytes.append(&String::from_str(&env, "E a terra era sem forma e vazia.").to_bytes());
        let hash2: BytesN<32> = env.crypto().sha256(&leaf2_bytes).into();

        // Merkle Root: SHA-256(combine(hash1, hash2))
        let mut combine = Bytes::new(&env);
        if hash1 < hash2 {
            combine.append(&hash1.to_bytes());
            combine.append(&hash2.to_bytes());
        } else {
            combine.append(&hash2.to_bytes());
            combine.append(&hash1.to_bytes());
        }
        let root: BytesN<32> = env.crypto().sha256(&combine).into();

        // Registrar Merkle Root da versão ARC
        client.registrar_merkle_root_versao(&VersaoBiblia::ARC, &root);

        let stored_root = client.obter_merkle_root_versao(&VersaoBiblia::ARC);
        assert_eq!(stored_root, Some(root));

        // Prova de Merkle para folha 1 contem hash2
        let mut proof = Vec::new(&env);
        proof.push_back(hash2);

        // Verificar prova da Folha 1
        let valido = client.verificar_texto_merkle(
            &VersaoBiblia::ARC,
            &id_texto,
            &texto.to_bytes(),
            &proof,
        );
        assert!(valido);
    }

    #[test]
    fn test_reivindicar_recompensa_com_token_tal() {
        use soroban_sdk::token::StellarAssetClient;

        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let leitor = Address::generate(&env);
        env.mock_all_auths();
        client.initialize(&admin);

        // Criar um contrato de token Stellar (SAC mock) para o Token TAL
        let token_admin = Address::generate(&env);
        let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
        let token_address = token_contract.address();
        let token_admin_client = StellarAssetClient::new(&env, &token_address);
        let token_client = soroban_sdk::token::Client::new(&env, &token_address);

        // Mint inicial de 1000 TAL para o contrato bíblico (Tesouraria)
        token_admin_client.mint(&contract_id, &1000_0000000);
        assert_eq!(token_client.balance(&contract_id), 1000_0000000);

        // Admin configura o endereço do Token TAL no Contrato Bíblia
        client.configurar_token_tal(&token_address);
        assert_eq!(client.obter_token_tal(), Some(token_address.clone()));

        // Leitor marca 1 versiculo como lido de um livro de 1 versiculo
        client.registrar_meta_livro(&1, &1);
        client.marcar_lido(&leitor, &id_gen_1_1());

        // Reivindicar recompensa do Livro 1
        client.reivindicar_recompensa_livro(&leitor, &1);

        // Verificar que o leitor recebeu exatamente 100 TAL on-chain
        assert_eq!(token_client.balance(&leitor), 100_0000000);
        // Verificar que a tesouraria do contrato ficou com 900 TAL
        assert_eq!(token_client.balance(&contract_id), 900_0000000);
    }

    #[test]
    fn test_curadoria_destaque_com_certificado() {
        let env = Env::default();
        let contract_id = env.register(ContratoBiblia, ());
        let client = ContratoBibliaClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let autor = Address::generate(&env);
        let curador = Address::generate(&env);
        env.mock_all_auths();
        client.initialize(&admin);

        let id_texto = id_gen_1_1();
        let texto = String::from_str(&env, "No princípio criou Deus os céus e a terra.");
        let hash_sha256 = env.crypto().sha256(&texto.to_bytes()).into();

        client.registrar_hash(&id_texto, &hash_sha256);
        client.marcar_lido(&autor, &id_texto);

        // Autor cria uma reflexão pública com CID IPFS de áudio
        let ipfs_cid = String::from_str(&env, "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");
        let conteudo = String::from_str(&env, "Estudo em áudio sobre a criação divina.");
        client.adicionar_reflexao(&autor, &id_texto, &conteudo, &true, &Some(ipfs_cid.clone()));

        let reflexao_inicial = client.obter_reflexao(&autor, &id_texto).unwrap();
        assert_eq!(reflexao_inicial.hash_midia_ipfs, Some(ipfs_cid));
        assert!(!reflexao_inicial.destaque);

        // Curador conquista 1 certificado (Livro 66)
        client.registrar_meta_livro(&66, &1);
        client.marcar_lido(&curador, &IdTexto { livro: 66, capitulo: 1, versiculo: 1 });
        client.emitir_certificado(&curador, &TipoCertificado::Livro(66));

        // Curador promove a reflexão do autor para "Insight Teológico em Destaque"
        client.marcar_reflexao_destaque(&curador, &autor, &id_texto);

        let reflexao_destacada = client.obter_reflexao(&autor, &id_texto).unwrap();
        assert!(reflexao_destacada.destaque);
    }
}