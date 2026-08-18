export const STELLAR_CONFIG = {
  network: "FUTURENET",
  networkPassphrase: "Test SDF Future Network ; October 2022",
  rpcUrl: "https://rpc-futurenet.stellar.org",
  horizonUrl: "https://horizon-futurenet.stellar.org",
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || "CBIBLIA_SOROBAN_CONTRACT_ID_FUTURENET",
  talTokenAddress: process.env.NEXT_PUBLIC_TAL_TOKEN_ADDRESS || "CTAL_TOKEN_SOROBAN_SAC_ADDRESS",
  adminAddress: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "GADMIN...",
};

export function getExplorerAccountUrl(address: string): string {
  if (!address) return "https://stellar.expert/explorer/futurenet";
  return `https://stellar.expert/explorer/futurenet/account/${address}`;
}

export function getExplorerContractUrl(contractId?: string): string {
  const cid = contractId || STELLAR_CONFIG.contractId;
  return `https://stellar.expert/explorer/futurenet/contract/${cid}`;
}

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

export type VersaoBibliaKey = "ARC" | "KJV" | "RVA";

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
    merkleRoot: "0xff05eb41df67389c9d85bd116534446ce4396f44816c1c0dd7bed61cee90e324",
  },
  {
    id: "KJV",
    name: "KJV (King James Version)",
    language: "EN",
    copyright: "Domínio Público (Open-Source)",
    merkleRoot: "0x296ce7d4954520c44497d027b8298239bf9a2b0bcf5a30efd18b59ef5d3e550b",
  },
  {
    id: "RVA",
    name: "RVA (Reina Valera Antigua)",
    language: "ES",
    copyright: "Domínio Público (Open-Source)",
    merkleRoot: "0xfa571252d0943bd8e839d41f5e4425faa0cafa7c6e677fa42fe0923b1b643a9f",
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
  // Antigo Testamento (39 Livros)
  { id: 1, name: "Gênesis", chapters: 50, verses: 1533, testament: "AT", category: "Pentateuco" },
  { id: 2, name: "Êxodo", chapters: 40, verses: 1213, testament: "AT", category: "Pentateuco" },
  { id: 3, name: "Levítico", chapters: 27, verses: 859, testament: "AT", category: "Pentateuco" },
  { id: 4, name: "Números", chapters: 36, verses: 1288, testament: "AT", category: "Pentateuco" },
  { id: 5, name: "Deuteronômio", chapters: 34, verses: 959, testament: "AT", category: "Pentateuco" },
  { id: 6, name: "Josué", chapters: 24, verses: 658, testament: "AT", category: "HistoricosAT" },
  { id: 7, name: "Juízes", chapters: 21, verses: 618, testament: "AT", category: "HistoricosAT" },
  { id: 8, name: "Rute", chapters: 4, verses: 85, testament: "AT", category: "HistoricosAT" },
  { id: 9, name: "1 Samuel", chapters: 31, verses: 810, testament: "AT", category: "HistoricosAT" },
  { id: 10, name: "2 Samuel", chapters: 24, verses: 695, testament: "AT", category: "HistoricosAT" },
  { id: 11, name: "1 Reis", chapters: 22, verses: 816, testament: "AT", category: "HistoricosAT" },
  { id: 12, name: "2 Reis", chapters: 25, verses: 753, testament: "AT", category: "HistoricosAT" },
  { id: 13, name: "1 Crônicas", chapters: 29, verses: 942, testament: "AT", category: "HistoricosAT" },
  { id: 14, name: "2 Crônicas", chapters: 36, verses: 822, testament: "AT", category: "HistoricosAT" },
  { id: 15, name: "Esdras", chapters: 10, verses: 280, testament: "AT", category: "HistoricosAT" },
  { id: 16, name: "Neemias", chapters: 13, verses: 406, testament: "AT", category: "HistoricosAT" },
  { id: 17, name: "Ester", chapters: 10, verses: 167, testament: "AT", category: "HistoricosAT" },
  { id: 18, name: "Jó", chapters: 42, verses: 1070, testament: "AT", category: "Poeticos" },
  { id: 19, name: "Salmos", chapters: 150, verses: 2461, testament: "AT", category: "Poeticos" },
  { id: 20, name: "Provérbios", chapters: 31, verses: 915, testament: "AT", category: "Poeticos" },
  { id: 21, name: "Eclesiastes", chapters: 12, verses: 222, testament: "AT", category: "Poeticos" },
  { id: 22, name: "Cantares", chapters: 8, verses: 117, testament: "AT", category: "Poeticos" },
  { id: 23, name: "Isaías", chapters: 66, verses: 1292, testament: "AT", category: "ProfetasMaiores" },
  { id: 24, name: "Jeremias", chapters: 52, verses: 1364, testament: "AT", category: "ProfetasMaiores" },
  { id: 25, name: "Lamentações", chapters: 5, verses: 154, testament: "AT", category: "ProfetasMaiores" },
  { id: 26, name: "Ezequiel", chapters: 48, verses: 1273, testament: "AT", category: "ProfetasMaiores" },
  { id: 27, name: "Daniel", chapters: 12, verses: 357, testament: "AT", category: "ProfetasMaiores" },
  { id: 28, name: "Oséias", chapters: 14, verses: 197, testament: "AT", category: "ProfetasMenores" },
  { id: 29, name: "Joel", chapters: 3, verses: 73, testament: "AT", category: "ProfetasMenores" },
  { id: 30, name: "Amós", chapters: 9, verses: 146, testament: "AT", category: "ProfetasMenores" },
  { id: 31, name: "Obadias", chapters: 1, verses: 21, testament: "AT", category: "ProfetasMenores" },
  { id: 32, name: "Jonas", chapters: 4, verses: 48, testament: "AT", category: "ProfetasMenores" },
  { id: 33, name: "Miqueias", chapters: 7, verses: 105, testament: "AT", category: "ProfetasMenores" },
  { id: 34, name: "Naum", chapters: 3, verses: 47, testament: "AT", category: "ProfetasMenores" },
  { id: 35, name: "Habacuque", chapters: 3, verses: 56, testament: "AT", category: "ProfetasMenores" },
  { id: 36, name: "Sofonias", chapters: 3, verses: 53, testament: "AT", category: "ProfetasMenores" },
  { id: 37, name: "Ageu", chapters: 2, verses: 38, testament: "AT", category: "ProfetasMenores" },
  { id: 38, name: "Zacarias", chapters: 14, verses: 211, testament: "AT", category: "ProfetasMenores" },
  { id: 39, name: "Malaquias", chapters: 4, verses: 55, testament: "AT", category: "ProfetasMenores" },

  // Novo Testamento (27 Livros)
  { id: 40, name: "Mateus", chapters: 28, verses: 1071, testament: "NT", category: "Evangelhos" },
  { id: 41, name: "Marcos", chapters: 16, verses: 678, testament: "NT", category: "Evangelhos" },
  { id: 42, name: "Lucas", chapters: 24, verses: 1151, testament: "NT", category: "Evangelhos" },
  { id: 43, name: "João", chapters: 21, verses: 879, testament: "NT", category: "Evangelhos" },
  { id: 44, name: "Atos dos Apóstolos", chapters: 28, verses: 1007, testament: "NT", category: "HistoricoNT" },
  { id: 45, name: "Romanos", chapters: 16, verses: 433, testament: "NT", category: "CartasPaulinas" },
  { id: 46, name: "1 Coríntios", chapters: 16, verses: 437, testament: "NT", category: "CartasPaulinas" },
  { id: 47, name: "2 Coríntios", chapters: 13, verses: 257, testament: "NT", category: "CartasPaulinas" },
  { id: 48, name: "Gálatas", chapters: 6, verses: 149, testament: "NT", category: "CartasPaulinas" },
  { id: 49, name: "Efésios", chapters: 6, verses: 155, testament: "NT", category: "CartasPaulinas" },
  { id: 50, name: "Filipenses", chapters: 4, verses: 104, testament: "NT", category: "CartasPaulinas" },
  { id: 51, name: "Colossenses", chapters: 4, verses: 95, testament: "NT", category: "CartasPaulinas" },
  { id: 52, name: "1 Tessalonicenses", chapters: 5, verses: 89, testament: "NT", category: "CartasPaulinas" },
  { id: 53, name: "2 Tessalonicenses", chapters: 3, verses: 47, testament: "NT", category: "CartasPaulinas" },
  { id: 54, name: "1 Timóteo", chapters: 6, verses: 113, testament: "NT", category: "CartasPaulinas" },
  { id: 55, name: "2 Timóteo", chapters: 4, verses: 83, testament: "NT", category: "CartasPaulinas" },
  { id: 56, name: "Tito", chapters: 3, verses: 46, testament: "NT", category: "CartasPaulinas" },
  { id: 57, name: "Filemom", chapters: 1, verses: 25, testament: "NT", category: "CartasPaulinas" },
  { id: 58, name: "Hebreus", chapters: 13, verses: 303, testament: "NT", category: "CartasGerais" },
  { id: 59, name: "Tiago", chapters: 5, verses: 108, testament: "NT", category: "CartasGerais" },
  { id: 60, name: "1 Pedro", chapters: 5, verses: 105, testament: "NT", category: "CartasGerais" },
  { id: 61, name: "2 Pedro", chapters: 3, verses: 61, testament: "NT", category: "CartasGerais" },
  { id: 62, name: "1 João", chapters: 5, verses: 105, testament: "NT", category: "CartasGerais" },
  { id: 63, name: "2 João", chapters: 1, verses: 13, testament: "NT", category: "CartasGerais" },
  { id: 64, name: "3 João", chapters: 1, verses: 14, testament: "NT", category: "CartasGerais" },
  { id: 65, name: "Judas", chapters: 1, verses: 25, testament: "NT", category: "CartasGerais" },
  { id: 66, name: "Apocalipse", chapters: 22, verses: 404, testament: "NT", category: "Profecia" },
];

export const MULTI_VERSION_VERSES: Record<VersaoBibliaKey, Record<string, { text: string; hash: string }>> = {
  ARC: {
    "1-1-1": { text: "No princípio criou Deus o céu e a terra.", hash: "f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b" },
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
  RVA: {
    "1-1-1": { text: "En el principio crió Dios los cielos y la tierra.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
    "1-1-2": { text: "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la haz del abismo.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
    "19-23-1": { text: "Jehová es mi pastor; nada me faltará.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
    "43-3-16": { text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.", hash: "0x8319e846bc4f1c8cf1c3f6d68080de0fc7fe3ba0be7c419d8a79eba8d422e65c" },
  },
};
