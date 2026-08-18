export const STELLAR_CONFIG = {
  network: "FUTURENET",
  networkPassphrase: "Test SDF Future Network ; October 2022",
  rpcUrl: "https://rpc-futurenet.stellar.org",
  horizonUrl: "https://horizon-futurenet.stellar.org",
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || "CBIBLIA_SOROBAN_CONTRACT_ID_FUTURENET",
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

export const BOOKS = [
  { id: 1, name: "Gênesis", chapters: 50, verses: 1533, testament: "AT" },
  { id: 2, name: "Êxodo", chapters: 40, verses: 1213, testament: "AT" },
  { id: 19, name: "Salmos", chapters: 150, verses: 2461, testament: "AT" },
  { id: 40, name: "Mateus", chapters: 28, verses: 1071, testament: "NT" },
  { id: 43, name: "João", chapters: 21, verses: 879, testament: "NT" },
  { id: 66, name: "Apocalipse", chapters: 22, verses: 404, testament: "NT" },
];

export const MOCK_VERSES: Record<string, { text: string; hash: string }> = {
  "1-1-1": {
    text: "No princípio criou Deus o céu e a terra.",
    hash: "f2e9a224a50ee5118533e4544253966a348003183a69620596323145f15a201b",
  },
  "1-1-2": {
    text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
    hash: "a4c28f0909e75525b6826d7cf5a9163e778a876a349b109e9921b790d0b00511",
  },
  "1-1-3": {
    text: "E disse Deus: Haja luz; e houve luz.",
    hash: "c7964b46e336d3c01c05d76d491563f91040f7b0559798031c26f04128f115a3",
  },
  "19-23-1": {
    text: "O Senhor é o meu pastor, nada me faltará.",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  "43-3-16": {
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    hash: "8f48174577f805a8b792e858cf09f18a6e872e428c0a87a8bfa4911f4d92a10a",
  },
};
