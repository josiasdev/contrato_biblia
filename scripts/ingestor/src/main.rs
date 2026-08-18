use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::BufReader;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VersiculoCanonica {
    pub versao: String,
    pub livro_id: u32,
    pub capitulo: u32,
    pub versiculo: u32,
    pub texto: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MerkleExport {
    pub versao: String,
    pub merkle_root: String,
    pub total_versiculos: usize,
    pub proofs: HashMap<String, Vec<String>>,
}

fn compute_leaf_hash(livro_id: u32, capitulo: u32, versiculo: u32, texto: &str) -> [u8; 32] {
    let mut hasher = Sha256::new();
    hasher.update(&[livro_id as u8, capitulo as u8, versiculo as u8]);
    hasher.update(texto.as_bytes());
    hasher.finalize().into()
}

fn combine_hashes(a: &[u8; 32], b: &[u8; 32]) -> [u8; 32] {
    let mut hasher = Sha256::new();
    if a < b {
        hasher.update(a);
        hasher.update(b);
    } else {
        hasher.update(b);
        hasher.update(a);
    }
    hasher.finalize().into()
}

fn build_merkle_tree(leaves: &[[u8; 32]]) -> (String, Vec<Vec<[u8; 32]>>) {
    if leaves.is_empty() {
        return (hex::encode([0u8; 32]), vec![]);
    }

    let mut tree: Vec<Vec<[u8; 32]>> = vec![leaves.to_vec()];

    while tree.last().unwrap().len() > 1 {
        let current_level = tree.last().unwrap();
        let mut next_level = Vec::new();

        for i in (0..current_level.len()).step_by(2) {
            if i + 1 < current_level.len() {
                let parent = combine_hashes(&current_level[i], &current_level[i + 1]);
                next_level.push(parent);
            } else {
                // If odd number of nodes, duplicate last node
                let parent = combine_hashes(&current_level[i], &current_level[i]);
                next_level.push(parent);
            }
        }
        tree.push(next_level);
    }

    let root = hex::encode(tree.last().unwrap()[0]);
    (root, tree)
}

fn generate_proof(index: usize, tree: &[Vec<[u8; 32]>]) -> Vec<String> {
    let mut proof = Vec::new();
    let mut curr_idx = index;

    for level in 0..tree.len() - 1 {
        let current_level = &tree[level];
        let sibling_idx = if curr_idx % 2 == 0 {
            if curr_idx + 1 < current_level.len() {
                curr_idx + 1
            } else {
                curr_idx
            }
        } else {
            curr_idx - 1
        };

        proof.push(hex::encode(current_level[sibling_idx]));
        curr_idx /= 2;
    }

    proof
}

fn get_sample_verses(versao: &str) -> Vec<VersiculoCanonica> {
    vec![
        VersiculoCanonica {
            versao: versao.to_string(),
            livro_id: 1,
            capitulo: 1,
            versiculo: 1,
            texto: if versao == "KJV" {
                "In the beginning God created the heaven and the earth."
            } else if versao == "RVA" {
                "En el principio crió Dios los cielos y la tierra."
            } else {
                "No princípio criou Deus os céus e a terra."
            }.to_string(),
        },
        VersiculoCanonica {
            versao: versao.to_string(),
            livro_id: 1,
            capitulo: 1,
            versiculo: 2,
            texto: if versao == "KJV" {
                "And the earth was without form, and void; and darkness was upon the face of the deep."
            } else if versao == "RVA" {
                "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la haz del abismo."
            } else {
                "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo."
            }.to_string(),
        },
        VersiculoCanonica {
            versao: versao.to_string(),
            livro_id: 19,
            capitulo: 23,
            versiculo: 1,
            texto: if versao == "KJV" {
                "The LORD is my shepherd; I shall not want."
            } else if versao == "RVA" {
                "Jehová es mi pastor; nada me faltará."
            } else {
                "O Senhor é o meu pastor, nada me faltará."
            }.to_string(),
        },
        VersiculoCanonica {
            versao: versao.to_string(),
            livro_id: 43,
            capitulo: 3,
            versiculo: 16,
            texto: if versao == "KJV" {
                "For God so loved the world, that he gave his only begotten Son."
            } else if versao == "RVA" {
                "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito."
            } else {
                "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito."
            }.to_string(),
        },
    ]
}

fn main() {
    println!("=== PIPELINE DE INGESTÃO BÍBLICA (MERKLE TREE GENERATOR) ===");
    let versoes = vec!["ARC", "ACF", "KJV", "ASV", "RVA"];

    let output_dir = Path::new("scripts/ingestor/output");
    if !output_dir.exists() {
        fs::create_dir_all(output_dir).unwrap();
    }

    for versao in versoes {
        println!("\n[+] Processando versão: {}", versao);
        let versiculos = get_sample_verses(versao);

        let leaves: Vec<[u8; 32]> = versiculos
            .iter()
            .map(|v| compute_leaf_hash(v.livro_id, v.capitulo, v.versiculo, &v.texto))
            .collect();

        let (root_hex, tree) = build_merkle_tree(&leaves);
        println!("    -> Total de versículos: {}", versiculos.len());
        println!("    -> Merkle Root (SHA-256): 0x{}", root_hex);

        let mut proofs_map = HashMap::new();
        for (idx, v) in versiculos.iter().enumerate() {
            let key = format!("{}-{}-{}", v.livro_id, v.capitulo, v.versiculo);
            let proof = generate_proof(idx, &tree);
            proofs_map.insert(key, proof);
        }

        let export = MerkleExport {
            versao: versao.to_string(),
            merkle_root: root_hex,
            total_versiculos: versiculos.len(),
            proofs: proofs_map,
        };

        let file_path = output_dir.join(format!("{}_merkle.json", versao.to_lowercase()));
        let file = File::create(&file_path).unwrap();
        serde_json::to_writer_pretty(file, &export).unwrap();
        println!("    -> Arquivo gerado: {:?}", file_path);
    }

    println!("\n✅ Pipeline concluído com sucesso!");
}
