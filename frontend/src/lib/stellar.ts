export const STELLAR_CONFIG = {
  network: "FUTURENET",
  networkPassphrase: "Test SDF Future Network ; October 2022",
  rpcUrl: "https://rpc-futurenet.stellar.org",
  horizonUrl: "https://horizon-futurenet.stellar.org",
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || "CBIBLIA_SOROBAN_CONTRACT_ID_FUTURENET",
  talTokenAddress: process.env.NEXT_PUBLIC_TAL_TOKEN_ADDRESS || "CTAL_TOKEN_SOROBAN_SAC_ADDRESS",
  adminAddress: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "GADMIN...",
};

export interface IdTexto {
  livro: number;
  capitulo: number;
  versiculo: number;
}

export interface Reflexao {
  leitor: string;
  id_texto: IdTexto;
  conteudo: string;
  timestamp: number;
  hash_reflexao: string;
  publica: boolean;
  curtidas: number;
}

export interface Comentario {
  autor: string;
  conteudo: string;
  timestamp: number;
  curtidas: number;
}

export type CategoriaLivroKey = 
  | "Pentateuco"
  | "HistoricosAT"
  | "Poeticos"
  | "ProfetasMaiores"
  | "ProfetasMenores"
  | "Evangelhos"
  | "HistoricoNT"
  | "CartasPaulinas"
  | "CartasGerais"
  | "Profecia";

export type TipoCertificadoKey = 
  | { type: "Livro"; bookId: number }
  | { type: "Categoria"; category: CategoriaLivroKey }
  | { type: "Testamento"; testament: "Antigo" | "Novo" }
  | { type: "BibliaCompleta" };

export interface CertificadoItem {
  id: string;
  leitor: string;
  tipo: TipoCertificadoKey;
  timestamp: number;
  hash_certificado: string;
}

export type VersaoBibliaKey = "ARC" | "ACF" | "KJV" | "ASV" | "RVA";

export interface VersaoBibliaMeta {
  id: VersaoBibliaKey;
  name: string;
  language: "PT" | "EN" | "ES";
  copyright: "Domínio Público (Open-Source)";
  merkleRoot: string;
}

export const BIBLE_VERSIONS: VersaoBibliaMeta[] = [
  {
    id: "ARC",
    name: "ARC (Almeida Revista e Corrigida)",
    language: "PT",
    copyright: "Domínio Público (Open-Source)",
    merkleRoot: "0xada98826e1980606a075d8560f5a94fe5c1e036ee6f6b05412a1cc63b2cdd182",
  },
  {
    id: "ACF",
    name: "ACF (Almeida Corrigida Fiel)",
    language: "PT",
    copyright: "Domínio Público (Open-Source)",
    merkleRoot: "0xada98826e1980606a075d8560f5a94fe5c1e036ee6f6b05412a1cc63b2cdd182",
  },
  {
    id: "KJV",
    name: "KJV (King James Version)",
    language: "EN",
    copyright: "Domínio Público (Open-Source)",
    merkleRoot: "0xaf262b31fdd0e3031ddab639048a9e4a9142526cd3e898dbe458fc68b7c54662",
  },
  {
    id: "ASV",
    name: "ASV (American Standard Version)",
    language: "EN",
    copyright: "Domínio Público (Open-Source)",
    merkleRoot: "0xada98826e1980606a075d8560f5a94fe5c1e036ee6f6b05412a1cc63b2cdd182",
  },
  {
    id: "RVA",
    name: "RVA (Reina Valera Antigua)",
    language: "ES",
    copyright: "Domínio Público (Open-Source)",
    merkleRoot: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c",
  },
];

export const CATEGORIES: { id: CategoriaLivroKey; name: string; testament: "AT" | "NT"; bookRange: [number, number]; totalBooks: number }[] = [
  { id: "Pentateuco", name: "Pentateuco (A Lei)", testament: "AT", bookRange: [1, 5], totalBooks: 5 },
  { id: "HistoricosAT", name: "Livros Históricos (AT)", testament: "AT", bookRange: [6, 17], totalBooks: 12 },
  { id: "Poeticos", name: "Livros Poéticos & Sapienciais", testament: "AT", bookRange: [18, 22], totalBooks: 5 },
  { id: "ProfetasMaiores", name: "Profetas Maiores", testament: "AT", bookRange: [23, 27], totalBooks: 5 },
  { id: "ProfetasMenores", name: "Profetas Menores", testament: "AT", bookRange: [28, 39], totalBooks: 12 },
  { id: "Evangelhos", name: "Os Quatro Evangelhos", testament: "NT", bookRange: [40, 43], totalBooks: 4 },
  { id: "HistoricoNT", name: "Histórico (Atos dos Apóstolos)", testament: "NT", bookRange: [44, 44], totalBooks: 1 },
  { id: "CartasPaulinas", name: "Epístolas Paulinas", testament: "NT", bookRange: [45, 57], totalBooks: 13 },
  { id: "CartasGerais", name: "Cartas Gerais (Epístolas)", testament: "NT", bookRange: [58, 65], totalBooks: 8 },
  { id: "Profecia", name: "Profecia (Apocalipse)", testament: "NT", bookRange: [66, 66], totalBooks: 1 },
];

export const BOOKS = [
  { id: 1, name: "Gênesis", chapters: 50, verses: 1533, testament: "AT", category: "Pentateuco" },
  { id: 2, name: "Êxodo", chapters: 40, verses: 1213, testament: "AT", category: "Pentateuco" },
  { id: 19, name: "Salmos", chapters: 150, verses: 2461, testament: "AT", category: "Poeticos" },
  { id: 40, name: "Mateus", chapters: 28, verses: 1071, testament: "NT", category: "Evangelhos" },
  { id: 43, name: "João", chapters: 21, verses: 879, testament: "NT", category: "Evangelhos" },
  { id: 44, name: "Atos dos Apóstolos", chapters: 28, verses: 1007, testament: "NT", category: "HistoricoNT" },
  { id: 66, name: "Apocalipse", chapters: 22, verses: 404, testament: "NT", category: "Profecia" },
];

export const MULTI_VERSION_VERSES: Record<VersaoBibliaKey, Record<string, { text: string; hash: string }>> = {
  ARC: {
    "1-1-1": { text: "No princípio criou Deus o céu e a terra.", hash: "f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b" },
    "1-1-2": { text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo.", hash: "a4c28f0909e75525b6826d7cf5a9163e778a876a349b109e9921b790d0b00511" },
    "19-23-1": { text: "O Senhor é o meu pastor, nada me faltará.", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
    "43-3-16": { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.", hash: "8f48174577f805a8b792e858cf09f18a6e872e428c0a87a8bfa4911f4d92a10a" },
  },
  ACF: {
    "1-1-1": { text: "No princípio criou Deus os céus e a terra.", hash: "f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b" },
    "1-1-2": { text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo.", hash: "a4c28f0909e75525b6826d7cf5a9163e778a876a349b109e9921b790d0b00511" },
    "19-23-1": { text: "O Senhor é o meu pastor, nada me faltará.", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
    "43-3-16": { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.", hash: "8f48174577f805a8b792e858cf09f18a6e872e428c0a87a8bfa4911f4d92a10a" },
  },
  KJV: {
    "1-1-1": { text: "In the beginning God created the heaven and the earth.", hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" },
    "1-1-2": { text: "And the earth was without form, and void; and darkness was upon the face of the deep.", hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" },
    "19-23-1": { text: "The LORD is my shepherd; I shall not want.", hash: "11a566597793d48995a5f7881c15f9d15024d3505c866d9c9a6a8b726487e411" },
    "43-3-16": { text: "For God so loved the world, that he gave his only begotten Son.", hash: "d04b98f48e8f8bcc15c6ae5ac050801cd6dcfd428fb5f9e65c4e16e7807340fa" },
  },
  ASV: {
    "1-1-1": { text: "In the beginning God created the heavens and the earth.", hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" },
    "1-1-2": { text: "And the earth was waste and void; and darkness was upon the face of the deep.", hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" },
    "19-23-1": { text: "Jehovah is my shepherd; I shall not want.", hash: "11a566597793d48995a5f7881c15f9d15024d3505c866d9c9a6a8b726487e411" },
    "43-3-16": { text: "For God so loved the world, that he gave his only begotten Son.", hash: "d04b98f48e8f8bcc15c6ae5ac050801cd6dcfd428fb5f9e65c4e16e7807340fa" },
  },
  RVA: {
    "1-1-1": { text: "En el principio crió Dios los cielos y la tierra.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
    "1-1-2": { text: "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la haz del abismo.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
    "19-23-1": { text: "Jehová es mi pastor; nada me faltará.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
    "43-3-16": { text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
  },
};
