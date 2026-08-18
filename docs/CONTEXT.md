# CONTEXT.md — Contrato Bíblia (Stellar / Soroban)

## 📌 Visão Geral do Projeto

O **Contrato Bíblia** é um smart contract desenvolvido em Rust para a plataforma **Soroban** da blockchain **Stellar**. Ele serve como a infraestrutura descentralizada (on-chain) para uma aplicação social e de incentivo ao estudo da Bíblia Sagrada.

### Objetivos Principais:
1. **Autenticidade de Textos via Merkle Tree (3 Versões Oficiais em Domínio Público)**: Suportar as 3 versões canônicas da Bíblia Sagrada em domínio público (`ARC` para Português, `KJV` para Inglês e `RVA` para Espanhol) armazenando 1 Merkle Root SHA-256 (32 bytes) por versão no contrato Soroban e verificando a integridade dos versículos via Merkle Proofs.
2. **Adaptação Automática de Idioma no dApp**: Sincronização automática entre o idioma selecionado no site (`PT`, `EN`, `ES`) e a versão bíblica ativa no Leitor (`ARC`, `KJV`, `RVA`).
3. **Prova de Leitura & Devocional Diário (Daily Reading Streak)**: Registrar de forma imutável os versículos lidos por cada usuário e calcular a sequência de dias consecutivos de leitura (`RachaLeitura`), premiando o leitor com **+10 TAL** a cada 7 dias de racha ininterruptos.
4. **Rede Social Descentralizada, Curadoria & Anti-Spam (1 TAL Stake)**: Permitir que leitores criem reflexões (públicas ou privadas) com opção de mídias descentralizadas (IPFS CIDs para áudios/PDFs). Publicações públicas travam 1 TAL de caução anti-spam. Curadores com Certificados Bíblicos podem promover reflexões a **"Insight Teológico em Destaque"**, reembolsando a trava + bônus de 5 TAL.
5. **Sistema de Recompensas On-Chain (Token TAL via SAC / SEP-41)**: Gamificar a leitura bíblica realizando a **transferência direta on-chain de 100 tokens TAL** da tesouraria do contrato para a carteira do leitor via Soroban Token Client (`soroban_sdk::token::Client`).
6. **Categorização & Certificados On-Chain**: Categorizar todos os 66 livros da Bíblia Sagrada (Cânon Protestante/Evangélico) e emitir credenciais não-transferíveis (Soulbound) com hash SHA-256 único para conclusão de Livros, Categorias, Testamentos ou a Bíblia Completa.
7. **Leitura em Áudio (Text-to-Speech Interativo)**: Player de narração em áudio integrado ao Leitor Bíblico com sintetizador de voz nativo Web Speech API (`pt-BR`, `en-US`, `es-ES`), destaque do versículo em leitura e controle de velocidade (1x a 2x).
8. **Suporte PWA & Sincronização Offline**: PWA instalável no celular e desktop (`manifest.json`), com suporte a marcação de leituras offline e sincronização automática das provas SHA-256 no Soroban assim que a conexão com a internet é restabelecida.
9. **Automação & Indexador de Eventos (`scripts/indexer`)**: Daemon em Rust que escuta eventos `RecompensaReivindicada` e `CertificadoEmitido` via Soroban RPC (`getEvents`), gerando dados analíticos em tempo real.

---

## 🔑 Modelos de Dados e Armazenamento

### Chaves de Estado (`DataKey`)
| Chave | Tipo de Storage | Descrição |
|---|---|---|
| `Admin` | Instance | Endereço (`Address`) do administrador do contrato |
| `Hashes` | Instance | Mapeamento `Map<IdTexto, BytesN<32>>` com os hashes legados dos versículos |
| `TokenTAL` | Instance | Endereço (`Address`) do contrato do Token TAL (Stellar Asset Contract / SAC) |
| `MerkleRoot(VersaoBiblia)` | Persistent | Merkle Root SHA-256 (32 bytes) de uma versão inteira da Bíblia (`ARC`, `KJV`, `RVA`) |
| `Leituras` | Instance | Mapeamento `Map<(Address, IdTexto), bool>` de leitura de versículos |
| `RachaLeitura(Address)` | Persistent | Registro `RachaLeitura` (timestamp + dias consecutivos lidos) |
| `MetaVersiculosLivro(u32)` | Persistent | Quantidade total de versículos que compõem um livro |
| `ProgressoLeitura(Address, u32)` | Persistent | Contador incremental de versículos lidos por leitor em um livro |
| `RecompensaRecebida(Address, u32)` | Persistent | Flag prevenindo duplo resgate da recompensa de um livro |
| `Certificado(Address, TipoCertificado)` | Persistent | Marcação de emissão de certificado Soulbound evitando duplicidade |
| `ListaCertificados(Address)` | Persistent | Lista `Vec<Certificado>` por leitor |
