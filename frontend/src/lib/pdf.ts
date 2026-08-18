import jsPDF from "jspdf";
import { CertificadoItem } from "./stellar";
import { formatAddress, formatTimestamp } from "./utils";

export function generateCertificatePDF(cert: CertificadoItem, title: string) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const width = doc.internal.pageSize.getWidth();   // 297mm
  const height = doc.internal.pageSize.getHeight(); // 210mm

  // 1. Background - Premium Light Cream (#fdfbf7)
  doc.setFillColor(253, 251, 247);
  doc.rect(0, 0, width, height, "F");

  // 2. Outer Border & Gold/Dark Geometry
  // Dark Corner Decorative Geometry (Top Left & Bottom Right)
  doc.setFillColor(15, 23, 42); // Dark Slate #0f172a
  doc.triangle(0, 0, 45, 0, 0, 45, "F");
  doc.triangle(width, height, width - 45, height, width, height - 45, "F");

  doc.setFillColor(180, 83, 9); // Gold Line #b45309
  doc.triangle(0, 45, 0, 48, 48, 0, "F");
  doc.triangle(width, height - 45, width, height - 48, width - 48, height, "F");

  // Double Outer Frame Lines
  doc.setDrawColor(15, 23, 42); // Dark Navy
  doc.setLineWidth(1.5);
  doc.rect(8, 8, width - 16, height - 16);

  doc.setDrawColor(180, 83, 9); // Gold Inner Line
  doc.setLineWidth(0.6);
  doc.rect(11, 11, width - 22, height - 22);

  // 3. Top Header Bar (Logos & Subtitle)
  // Left Brand Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(18, 18, 65, 14, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9);
  doc.text("CONTRATO BÍBLIA", 22, 24.5);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("STELLAR SOROBAN SMART CONTRACT", 22, 28.5);

  // Center Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("RECONHECIMENTO DIGITAL • STELLAR SOROBAN • SOULBOUND", width / 2 + 10, 26, { align: "center" });

  // Right Badge Seal
  doc.setFillColor(15, 23, 42);
  doc.circle(width - 25, 25, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(20, 184, 166);
  doc.text("SOROBAN", width - 25, 26, { align: "center" });

  // 4. Main Certificate Header
  doc.setFont("serif", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text("CERTIFICADO DE CONCLUSÃO", width / 2, 50, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("Certificamos que", width / 2, 58, { align: "center" });

  // Recipient Name - FRANCISCO JOSIAS DA SILVA BATISTA
  doc.setFont("serif", "bolditalic");
  doc.setFontSize(22);
  doc.setTextColor(180, 83, 9); // Gold
  doc.text("Francisco Josias da Silva Batista", width / 2, 70, { align: "center" });

  // Dots Under Name
  doc.setFillColor(180, 83, 9);
  doc.circle(width / 2 - 25, 75, 1, "F");
  doc.circle(width / 2 + 25, 75, 1, "F");

  // Certificate Achievement Subtext
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `concluiu com êxito os requisitos do ${title.toUpperCase()}, registrados com imutabilidade e`,
    width / 2,
    83,
    { align: "center" }
  );
  doc.text(
    "transparência no Soroban Persistent Storage da blockchain Stellar.",
    width / 2,
    89,
    { align: "center" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Contrato Bíblia • Credencial Soulbound Não-Transferível", width / 2, 96, { align: "center" });

  // 5. Middle Two-Box Section (On-Chain Account Box + Gov.br Digital Signature Box)
  
  // LEFT BOX: Account Linked to NFT/Soroban
  doc.setFillColor(15, 23, 42); // Black/Navy Box
  doc.rect(20, 106, 115, 36, "F");

  // Check Circle Badge
  doc.setFillColor(20, 184, 166);
  doc.circle(32, 124, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("V", 32, 127.5, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("CONTA VINCULADA ON-CHAIN", 42, 118);
  doc.setFontSize(9);
  doc.setTextColor(20, 184, 166);
  doc.text("STELLAR SOROBAN • SOULBOUND CREDENTIAL", 42, 125);
  
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`LEITOR: ${formatAddress(cert.leitor)}`, 42, 133);

  // RIGHT BOX: ESPAÇO PARA ASSINATURA ELETRÔNICA GOV.BR
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.rect(160, 106, 117, 36, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("ESPAÇO PARA ASSINATURA ELETRÔNICA", 165, 112);

  // Dashed Gov.br Box
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.rect(165, 115, 107, 20, "D");

  // Gov.br Badge
  doc.setFillColor(2, 132, 199); // Gov.br Blue
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.rect(167, 118, 14, 5, "F");
  doc.text("gov.br", 174, 121.5, { align: "center" });

  // Gov.br Signature Text Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Documento assinado digitalmente", 183, 118.5);
  doc.setFont("helvetica", "bold");
  doc.text("FRANCISCO JOSIAS DA SILVA BATISTA", 183, 122);
  doc.setFont("helvetica", "normal");
  doc.text(`Data: ${formatTimestamp(cert.timestamp)}`, 183, 125.5);
  doc.setTextColor(2, 132, 199);
  doc.text("Verifique em https://validar.iti.gov.br", 183, 129);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Assinatura digital via gov.br", 218.5, 139, { align: "center" });

  // 6. Bottom Data Strip Table (Footer)
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.rect(18, 150, width - 36, 24, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);

  doc.text("EMISSÃO", 24, 156);
  doc.text("TIPO", 65, 156);
  doc.text("TITULAR", 115, 156);
  doc.text("CÓDIGO DE VALIDAÇÃO SHA-256", 185, 156);

  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  doc.text(formatTimestamp(cert.timestamp), 24, 164);
  doc.text("SOULBOUND", 65, 164);
  doc.text(formatAddress(cert.leitor), 115, 164);
  
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text(`${cert.hash_certificado.slice(0, 32)}...`, 185, 164);

  // Verification Footer Line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const explorerUrl = "https://lab.stellar.org/";
  doc.textWithLink(`Valide a autenticidade on-chain em: ${explorerUrl}`, width / 2, 182, {
    url: explorerUrl,
    align: "center",
  });

  doc.text("agenticspace.rapport.tec.br", width - 20, 196, { align: "right" });

  // Save PDF file
  const fileName = `certificado_biblia_${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.pdf`;
  doc.save(fileName);
}
