import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Mine } from '../types';

export interface ComplianceCategorySummary {
  title: string;
  compliance: number;
  target: number;
  status: string;
}

export function exportAdminCompliancePDF(
  categories: ComplianceCategorySummary[],
  mines: Mine[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  // 1. Header Band
  doc.setFillColor(7, 26, 43); // #071a2b
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Emblem / Tiranga Accent Bar
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(0, 28, pageWidth / 3, 2.5, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(pageWidth / 3, 28, pageWidth / 3, 2.5, 'F');
  doc.setFillColor(19, 136, 8); // Green
  doc.rect((pageWidth / 3) * 2, 28, pageWidth / 3, 2.5, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('KOYLA DRISHTI | MINISTRY OF COAL, GOVT. OF INDIA', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 230, 240);
  doc.text('Apex Statutory Compliance & Geotechnical Risk Intelligence Bulletin', 14, 18);
  doc.text(`Generated: ${timestamp} IST | Official DGMS Record`, 14, 23);

  // 2. Summary Overview Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 60);
  doc.text('1. National Compliance Category Benchmarks', 14, 38);

  const categoryTableData = categories.map((c) => [
    c.title,
    `${c.compliance}%`,
    `${c.target}%`,
    c.status
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['Statutory Category Domain', 'National Score', 'Target', 'Assessment']],
    body: categoryTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [12, 36, 58],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [25, 40, 55]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // 3. High Risk Mines Watchlist
  // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
  const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 100;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 60);
  doc.text('2. Priority Statutory Compliance & Risk Watchlist', 14, lastY);

  const priorityMines = mines.filter((m) => m.complianceScore < 85 || m.riskLevel === 'High');

  const mineTableData = priorityMines.map((m) => [
    m.id,
    m.name,
    `${m.district}, ${m.state}`,
    `${m.complianceScore}%`,
    m.riskLevel,
    m.activeViolationsCount?.toString() || '0',
    m.status
  ]);

  autoTable(doc, {
    startY: lastY + 4,
    head: [['Mine ID', 'Mine Name / Facility', 'Location', 'Score', 'Risk', 'Violations', 'Status']],
    body: mineTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [18, 111, 186],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [25, 40, 55]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // 4. Footer Note
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(120, 140, 160);
    doc.text(
      'Document certified under the Directorate General of Mines Safety (DGMS) Digital Governance Framework. For official audit use only.',
      14,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 8);
  }

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`koyla_drishti_national_compliance_summary_${dateStr}.pdf`);
}

export interface MineCategoryScore {
  title: string;
  score: number;
  target: number;
  status: string;
  notes: string;
}

export function exportMineCompliancePDF(
  mine: Mine,
  categories: MineCategoryScore[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  // 1. Header Ribbon
  doc.setFillColor(7, 26, 43); // #071a2b
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setFillColor(255, 153, 51);
  doc.rect(0, 30, pageWidth / 3, 2.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(pageWidth / 3, 30, pageWidth / 3, 2.5, 'F');
  doc.setFillColor(19, 136, 8);
  doc.rect((pageWidth / 3) * 2, 30, pageWidth / 3, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('MINISTRY OF COAL | DIRECTORATE GENERAL OF MINES SAFETY', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 230, 240);
  doc.text(`Colliery Statutory Compliance Scorecard: ${mine.id} - ${mine.name}`, 14, 18);
  doc.text(`Issued for Offline Audit & Statutory Records | ${timestamp} IST`, 14, 24);

  // 2. Mine Metadata Box
  doc.setFillColor(245, 248, 251);
  doc.roundedRect(14, 38, pageWidth - 28, 28, 2, 2, 'F');
  doc.setDrawColor(215, 226, 235);
  doc.roundedRect(14, 38, pageWidth - 28, 28, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 39, 60);
  doc.text(`Operator: ${mine.operator}`, 18, 45);
  doc.text(`Mine Type: ${mine.mineType}`, 18, 51);
  doc.text(`Location: ${mine.district}, ${mine.state}`, 18, 57);
  doc.text(`Coordinates: ${mine.coordinates ? `${mine.coordinates.lat}° N, ${mine.coordinates.lng}° E` : 'Registered Coordinates'}`, 18, 63);

  doc.text(`Overall Score: ${mine.complianceScore}%`, pageWidth / 2 + 10, 45);
  doc.text(`Risk Assessment: ${mine.riskLevel}`, pageWidth / 2 + 10, 51);
  doc.text(`Active Violations: ${mine.activeViolationsCount || 0}`, pageWidth / 2 + 10, 57);
  doc.text(`Safety Officer: ${mine.contactOfficer}`, pageWidth / 2 + 10, 63);

  // 3. Category Scorecard Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 60);
  doc.text('Statutory Performance & Remediation Breakdown', 14, 74);

  const tableRows = categories.map((c) => [
    c.title,
    `${c.score}%`,
    `${c.target}%`,
    c.status,
    c.notes
  ]);

  autoTable(doc, {
    startY: 78,
    head: [['Statutory Audit Domain', 'Score', 'Target', 'Status', 'Observation / Action Notes']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [12, 36, 58],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3.5,
      textColor: [25, 40, 55]
    },
    columnStyles: {
      4: { cellWidth: 70 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 160;

  // 4. DGMS Attestation Block
  doc.setFillColor(250, 252, 254);
  doc.roundedRect(14, finalY, pageWidth - 28, 30, 2, 2, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.roundedRect(14, finalY, pageWidth - 28, 30, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 39, 60);
  doc.text('STATUTORY UNDERTAKING & DIGITAL VERIFICATION', 18, finalY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 100, 120);
  doc.text(
    'This compliance summary is automatically generated from the Ministry of Coal KOYLA DRISHTI regulatory platform.',
    18,
    finalY + 14
  );
  doc.text(
    'Colliery management must display this scorecard at the mine entrance and retain it for DGMS regional review.',
    18,
    finalY + 20
  );
  doc.text(
    `Digital Signature Hash: KD-${mine.id}-${Date.now().toString(36).toUpperCase()}`,
    18,
    finalY + 26
  );

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(120, 140, 160);
    doc.text(
      'Koyla Drishti Compliance Portal | Directorate General of Mines Safety, Ministry of Coal',
      14,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 8);
  }

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`${mine.id}_compliance_scorecard_${dateStr}.pdf`);
}
