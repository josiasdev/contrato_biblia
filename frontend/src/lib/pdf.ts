import jsPDF from "jspdf";
import { CertificadoItem } from "./stellar";
import { formatAddress, formatTimestamp } from "./utils";

export function generateCertificatePDF(cert: CertificadoItem, title: string) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background - Dark Navy (#0b1324)
  doc.setFillColor(11, 19, 36);
  doc.rect(0, 0, width, height, "F");

  // Outer Border - Teal (#14b8a6)
  doc.setDrawColor(20, 184, 166);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner Border - Thin Slate
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.5);
  doc.rect(14, 14, width - 28, height - 28);

  // Top Header Tag
  doc.setFillColor(20, 184, 166);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(11, 19, 36);
  doc.rect(width / 2 - 45, 20, 90, 8, "F");
  doc.text("STELLAR SOROBAN • SOULBOUND CREDENTIAL", width / 2, 25.5, { align: "center" });

  // Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICADO BÍBLICO ON-CHAIN", width / 2, 45, { align: "center" });

  // Subtitle / Achievement Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 184, 166);
  doc.text(title.toUpperCase(), width / 2, 58, { align: "center" });

  // Divider Line
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.5);
  doc.line(40, 66, width - 40, 66);

  // Body Text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Certificamos que a conta identificada abaixo concluiu os requisitos de leitura sagrada registrados",
    width / 2,
    76,
    { align: "center" }
  );
  doc.text(
    "de forma imutável e verificável no Soroban Persistent Storage da blockchain Stellar.",
    width / 2,
    83,
    { align: "center" }
  );

  // Reader Address Card Box
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(30, 41, 59);
  doc.rect(30, 93, width - 60, 22, "F");

  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("LEITOR / ENDEREÇO DA CARTEIRA STELLAR:", width / 2, 100, { align: "center" });

  doc.setFont("courier", "bold");
  doc.setFontSize(12);
  doc.setTextColor(45, 212, 191);
  doc.text(cert.leitor, width / 2, 108, { align: "center" });

  // Technical Details Grid Box
  doc.setFillColor(15, 23, 42);
  doc.rect(30, 122, width - 60, 36, "F");

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`DATA DE EMISSÃO ON-CHAIN: ${formatTimestamp(cert.timestamp)}`, 38, 130);
  doc.text("REDE BLOCKCHAIN: Stellar Futurenet (Soroban Smart Contract)", 38, 137);

  // Hash SHA-256
  doc.setFont("courier", "bold");
  doc.setTextColor(250, 204, 21);
  doc.text("HASH SHA-256 DO CERTIFICADO:", 38, 146);
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(20, 184, 166);
  doc.text(cert.hash_certificado, 38, 152);

  // Direct Explorer Link
  const explorerUrl = `https://lab.stellar.org/`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(56, 189, 248);
  doc.textWithLink("VERIFICAR NO STELLAR LAB / EXPLORER ↗", width / 2, 170, {
    url: explorerUrl,
    align: "center",
  });

  // Footer Seal / Branding
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Contrato Bíblia • Credencial Soulbound Não-Transferível • SHA-256 On-Chain Proof",
    width / 2,
    188,
    { align: "center" }
  );

  // Download PDF file
  const fileName = `certificado_biblia_${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.pdf`;
  doc.save(fileName);
}
