import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HAIT_CATEGORIES } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { HOSPITAL_NAME } from '../data/config';
import type { Item, User } from '../types';

const TODAY = 12;

function dayToDateShort(d: number) {
  return d <= 30 ? `${d} เม.ย. 69` : `${d - 30} พ.ค. 69`;
}

function dayToRange(s: number, e: number) {
  return `${dayToDateShort(s)} - ${dayToDateShort(e)}`;
}

function todayBE() {
  return '12 เมษายน 2569';
}

function addHeader(doc: jsPDF, user: User | null) {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 95);
  doc.text(HOSPITAL_NAME, pageW / 2, 18, { align: 'center' });
  doc.setFontSize(12);
  doc.text('HAIT Progress Report', pageW / 2, 26, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`Report date: ${todayBE()}`, pageW / 2, 32, { align: 'center' });
  if (user) {
    doc.text(`By: ${user.name} (${user.email})`, pageW / 2, 37, { align: 'center' });
  }
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.line(14, 40, pageW - 14, 40);
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Page ${i}/${pageCount}`, pageW / 2, pageH - 8, { align: 'center' });
    doc.text('HAIT Tracker - Hospital Accreditation for IT', 14, pageH - 8);
  }
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    needs_revision: 'Needs Revision',
  };
  return map[s] || s;
}

function statusColor(s: string): [number, number, number] {
  const map: Record<string, [number, number, number]> = {
    not_started: [148, 163, 184],
    in_progress: [245, 158, 11],
    completed: [16, 185, 129],
    needs_revision: [239, 68, 68],
  };
  return map[s] || [100, 100, 100];
}

export function exportDashboardPdf(items: Item[], user: User | null) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();

  // Page 1: Overview
  addHeader(doc, user);

  const total = items.length;
  const done = items.filter(i => i.status === 'completed').length;
  const pct = Math.round((done / total) * 100);
  const overdue = items.filter(i => i.status !== 'completed' && i.end <= TODAY).length;

  let y = 48;
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text('Overall Progress', 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`Total items: ${total}  |  Completed: ${done}  |  Progress: ${pct}%`, 14, y);
  y += 6;
  if (overdue > 0) {
    doc.setTextColor(239, 68, 68);
    doc.text(`Overdue items: ${overdue}`, 14, y);
    doc.setTextColor(50);
  }
  y += 10;

  // Category summary table
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text('Category Summary', 14, y);
  y += 4;

  const catRows = HAIT_CATEGORIES.map(cat => {
    const catId = cat.id as number;
    const catItems = items.filter(i => i.catId === catId);
    const catDone = catItems.filter(i => i.status === 'completed').length;
    const catPct = catItems.length ? Math.round((catDone / catItems.length) * 100) : 0;
    const catOverdue = catItems.filter(i => i.status !== 'completed' && i.end <= TODAY).length;
    return [cat.code, cat.name, `${catItems.length}`, `${catDone}`, `${catPct}%`, `${catOverdue}`];
  });

  autoTable(doc, {
    startY: y,
    head: [['Code', 'Category', 'Total', 'Done', 'Progress', 'Overdue']],
    body: catRows,
    headStyles: { fillColor: [30, 58, 95], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 18 },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'center', cellWidth: 20 },
      5: { halign: 'center', cellWidth: 18 },
    },
    margin: { left: 14, right: 14 },
  });

  // Overdue items alert
  if (overdue > 0) {
    const overdueItems = items.filter(i => i.status !== 'completed' && i.end <= TODAY);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(239, 68, 68);
    doc.text('Overdue Items', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['ID', 'Title', 'Owner', 'Due Date', 'Status']],
      body: overdueItems.map(it => [
        it.id, it.title, it.owner, dayToDateShort(it.end), statusLabel(it.status),
      ]),
      headStyles: { fillColor: [239, 68, 68], fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      margin: { left: 14, right: 14 },
    });
  }

  // Page 2+: Detail per category
  HAIT_CATEGORIES.forEach(cat => {
    const catId = cat.id as number;
    const catItems = items.filter(i => i.catId === catId);
    if (catItems.length === 0) return;

    doc.addPage();
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text(`${cat.code} - ${cat.name}`, 14, 18);

    const catDone = catItems.filter(i => i.status === 'completed').length;
    const catPct = Math.round((catDone / catItems.length) * 100);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`${catItems.length} items | ${catDone} completed | ${catPct}%`, 14, 24);

    autoTable(doc, {
      startY: 28,
      head: [['ID', 'Title', 'Owner', 'Status', 'Due Date', 'Period']],
      body: catItems.map(it => [
        it.id,
        it.title,
        it.owner,
        statusLabel(it.status),
        dayToDateShort(it.end),
        dayToRange(it.start, it.end),
      ]),
      headStyles: { fillColor: [30, 58, 95], fontSize: 7 },
      bodyStyles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 14 },
        3: { cellWidth: 24 },
        4: { cellWidth: 22 },
        5: { cellWidth: 30 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 3) {
          const status = catItems[data.row.index]?.status;
          if (status) {
            data.cell.styles.textColor = statusColor(status);
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
      margin: { left: 14, right: 14 },
    });
  });

  // Last page: signature
  doc.addPage();
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text('Summary', pageW / 2, 30, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(50);
  const summaryLines = [
    `Total items: ${total}`,
    `Completed: ${done} (${pct}%)`,
    `In Progress: ${items.filter(i => i.status === 'in_progress').length}`,
    `Not Started: ${items.filter(i => i.status === 'not_started').length}`,
    `Needs Revision: ${items.filter(i => i.status === 'needs_revision').length}`,
    `Overdue: ${overdue}`,
  ];
  summaryLines.forEach((line, i) => doc.text(line, 14, 44 + i * 7));

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Approved by:', 14, 110);
  doc.line(14, 130, 80, 130);
  doc.text('Signature', 40, 136, { align: 'center' });
  doc.line(110, 130, 196, 130);
  doc.text('Date', 153, 136, { align: 'center' });

  addFooter(doc);
  doc.save(`HAIT-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportCategoryPdf(catId: number, items: Item[], user: User | null) {
  const cat = HAIT_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  const catItems = items.filter(i => i.catId === catId);
  const doc = new jsPDF('l', 'mm', 'a4'); // landscape for more columns
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text(HOSPITAL_NAME, pageW / 2, 14, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`${cat.code} - ${cat.name}`, pageW / 2, 21, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`Report date: ${todayBE()}${user ? ` | By: ${user.name}` : ''}`, pageW / 2, 27, { align: 'center' });
  doc.line(14, 30, pageW - 14, 30);

  const catDone = catItems.filter(i => i.status === 'completed').length;
  const catPct = catItems.length ? Math.round((catDone / catItems.length) * 100) : 0;
  doc.setFontSize(9);
  doc.setTextColor(50);
  doc.text(`Items: ${catItems.length} | Completed: ${catDone} | Progress: ${catPct}%`, 14, 36);

  autoTable(doc, {
    startY: 40,
    head: [['ID', 'Title', 'Owner', 'Status', 'Due Date', 'Period', 'Notes']],
    body: catItems.map(it => [
      it.id,
      it.title,
      it.owner,
      statusLabel(it.status),
      dayToDateShort(it.end),
      dayToRange(it.start, it.end),
      it.notes || '-',
    ]),
    headStyles: { fillColor: [30, 58, 95], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 16 },
      3: { cellWidth: 26 },
      4: { cellWidth: 24 },
      5: { cellWidth: 34 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const status = catItems[data.row.index]?.status;
        if (status) {
          data.cell.styles.textColor = statusColor(status);
          data.cell.styles.fontStyle = 'bold';
        }
      }
      // Highlight overdue rows
      if (data.section === 'body') {
        const item = catItems[data.row.index];
        if (item && item.status !== 'completed' && item.end <= TODAY) {
          data.cell.styles.fillColor = [254, 242, 242];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save(`HAIT-${cat.code.replace(/\s+/g, '')}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export async function exportGanttPdf() {
  const { default: html2canvas } = await import('html2canvas');
  const ganttEl = document.querySelector('.gantt-capture') as HTMLElement;
  if (!ganttEl) return;

  const canvas = await html2canvas(ganttEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const imgW = canvas.width;
  const imgH = canvas.height;

  const doc = new jsPDF(imgW > imgH ? 'l' : 'p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text(`${HOSPITAL_NAME} - HAIT Gantt Chart`, pageW / 2, 14, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`Report date: ${todayBE()}`, pageW / 2, 20, { align: 'center' });

  const maxW = pageW - 20;
  const maxH = pageH - 30;
  const ratio = Math.min(maxW / imgW, maxH / imgH);
  const w = imgW * ratio;
  const h = imgH * ratio;

  doc.addImage(imgData, 'PNG', (pageW - w) / 2, 24, w, h);
  addFooter(doc);
  doc.save(`HAIT-GanttChart-${new Date().toISOString().slice(0, 10)}.pdf`);
}
