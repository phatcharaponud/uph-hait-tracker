import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HAIT_CATEGORIES } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { HOSPITAL_NAME } from '../data/config';
import type { Item, User } from '../types';
import { SARABUN_REGULAR } from './fonts/sarabun-regular';
import { SARABUN_BOLD } from './fonts/sarabun-bold';

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

/** Create a jsPDF instance with Sarabun Thai font registered */
function createDoc(orientation: 'p' | 'l' = 'p'): jsPDF {
  const doc = new jsPDF(orientation, 'mm', 'a4');

  // Register Sarabun fonts
  doc.addFileToVFS('Sarabun-Regular.ttf', SARABUN_REGULAR);
  doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal');

  doc.addFileToVFS('Sarabun-Bold.ttf', SARABUN_BOLD);
  doc.addFont('Sarabun-Bold.ttf', 'Sarabun', 'bold');

  // Set Sarabun as default
  doc.setFont('Sarabun', 'normal');

  return doc;
}

/** Common autoTable styles with Sarabun font */
const tableFont = { font: 'Sarabun' as const };

function addHeader(doc: jsPDF, user: User | null) {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFont('Sarabun', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 95);
  doc.text(HOSPITAL_NAME, pageW / 2, 18, { align: 'center' });
  doc.setFontSize(12);
  doc.text('รายงานความคืบหน้า HAIT', pageW / 2, 26, { align: 'center' });
  doc.setFont('Sarabun', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`วันที่ออกรายงาน: ${todayBE()}`, pageW / 2, 32, { align: 'center' });
  if (user) {
    doc.text(`ผู้ออกรายงาน: ${user.name} (${user.email})`, pageW / 2, 37, { align: 'center' });
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
    doc.setFont('Sarabun', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`หน้า ${i}/${pageCount}`, pageW / 2, pageH - 8, { align: 'center' });
    doc.text('HAIT Tracker - Hospital Accreditation for IT', 14, pageH - 8);
  }
}

function statusLabel(s: string): string {
  return STATUSES[s as keyof typeof STATUSES]?.label || s;
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
  const doc = createDoc('p');
  const pageW = doc.internal.pageSize.getWidth();

  // Page 1: Overview
  addHeader(doc, user);

  const total = items.length;
  const done = items.filter(i => i.status === 'completed').length;
  const pct = Math.round((done / total) * 100);
  const overdue = items.filter(i => i.status !== 'completed' && i.end <= TODAY).length;

  let y = 48;
  doc.setFont('Sarabun', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text('ภาพรวมความคืบหน้า', 14, y);
  y += 8;

  doc.setFont('Sarabun', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`รายการทั้งหมด: ${total}  |  เสร็จแล้ว: ${done}  |  ความคืบหน้า: ${pct}%`, 14, y);
  y += 6;
  if (overdue > 0) {
    doc.setTextColor(239, 68, 68);
    doc.text(`รายการเลยกำหนด: ${overdue}`, 14, y);
    doc.setTextColor(50);
  }
  y += 10;

  // Category summary table
  doc.setFont('Sarabun', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text('สรุปรายหมวด', 14, y);
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
    head: [['รหัส', 'หมวด', 'ทั้งหมด', 'เสร็จ', 'คืบหน้า', 'เลยกำหนด']],
    body: catRows,
    styles: { ...tableFont, fontSize: 9 },
    headStyles: { ...tableFont, fontStyle: 'bold', fillColor: [30, 58, 95], fontSize: 9 },
    bodyStyles: { ...tableFont, fontSize: 9 },
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
    doc.setFont('Sarabun', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(239, 68, 68);
    doc.text('รายการเลยกำหนด', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['รหัส', 'รายการ', 'ผู้รับผิดชอบ', 'ครบกำหนด', 'สถานะ']],
      body: overdueItems.map(it => [
        it.id, it.title, it.owner, dayToDateShort(it.end), statusLabel(it.status),
      ]),
      styles: { ...tableFont, fontSize: 8 },
      headStyles: { ...tableFont, fontStyle: 'bold', fillColor: [239, 68, 68], fontSize: 8 },
      bodyStyles: { ...tableFont, fontSize: 8 },
      margin: { left: 14, right: 14 },
    });
  }

  // Page 2+: Detail per category
  HAIT_CATEGORIES.forEach(cat => {
    const catId = cat.id as number;
    const catItems = items.filter(i => i.catId === catId);
    if (catItems.length === 0) return;

    doc.addPage();
    doc.setFont('Sarabun', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text(`${cat.code} - ${cat.name}`, 14, 18);

    const catDone = catItems.filter(i => i.status === 'completed').length;
    const catPct = Math.round((catDone / catItems.length) * 100);
    doc.setFont('Sarabun', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`${catItems.length} รายการ | เสร็จ ${catDone} | ความคืบหน้า ${catPct}%`, 14, 24);

    autoTable(doc, {
      startY: 28,
      head: [['รหัส', 'รายการ', 'ผู้รับผิดชอบ', 'สถานะ', 'ครบกำหนด', 'ช่วงเวลา']],
      body: catItems.map(it => [
        it.id,
        it.title,
        it.owner,
        statusLabel(it.status),
        dayToDateShort(it.end),
        dayToRange(it.start, it.end),
      ]),
      styles: { ...tableFont, fontSize: 8 },
      headStyles: { ...tableFont, fontStyle: 'bold', fillColor: [30, 58, 95], fontSize: 8 },
      bodyStyles: { ...tableFont, fontSize: 8 },
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
  doc.setFont('Sarabun', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text('สรุปผล', pageW / 2, 30, { align: 'center' });

  doc.setFont('Sarabun', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50);
  const summaryLines = [
    `รายการทั้งหมด: ${total}`,
    `เสร็จแล้ว: ${done} (${pct}%)`,
    `กำลังดำเนินการ: ${items.filter(i => i.status === 'in_progress').length}`,
    `ยังไม่เริ่ม: ${items.filter(i => i.status === 'not_started').length}`,
    `ต้องปรับปรุง: ${items.filter(i => i.status === 'needs_revision').length}`,
    `เลยกำหนด: ${overdue}`,
  ];
  summaryLines.forEach((line, i) => doc.text(line, 14, 44 + i * 7));

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('ผู้อนุมัติ:', 14, 110);
  doc.line(14, 130, 80, 130);
  doc.text('ลงนาม', 47, 136, { align: 'center' });
  doc.line(110, 130, 196, 130);
  doc.text('วันที่', 153, 136, { align: 'center' });

  addFooter(doc);
  doc.save(`HAIT-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportCategoryPdf(catId: number, items: Item[], user: User | null) {
  const cat = HAIT_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  const catItems = items.filter(i => i.catId === catId);
  const doc = createDoc('l'); // landscape for more columns
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFont('Sarabun', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text(HOSPITAL_NAME, pageW / 2, 14, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`${cat.code} - ${cat.name}`, pageW / 2, 21, { align: 'center' });
  doc.setFont('Sarabun', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`วันที่ออกรายงาน: ${todayBE()}${user ? ` | ผู้ออกรายงาน: ${user.name}` : ''}`, pageW / 2, 27, { align: 'center' });
  doc.line(14, 30, pageW - 14, 30);

  const catDone = catItems.filter(i => i.status === 'completed').length;
  const catPct = catItems.length ? Math.round((catDone / catItems.length) * 100) : 0;
  doc.setFontSize(9);
  doc.setTextColor(50);
  doc.text(`รายการ: ${catItems.length} | เสร็จ: ${catDone} | ความคืบหน้า: ${catPct}%`, 14, 36);

  autoTable(doc, {
    startY: 40,
    head: [['รหัส', 'รายการ', 'ผู้รับผิดชอบ', 'สถานะ', 'ครบกำหนด', 'ช่วงเวลา', 'หมายเหตุ']],
    body: catItems.map(it => [
      it.id,
      it.title,
      it.owner,
      statusLabel(it.status),
      dayToDateShort(it.end),
      dayToRange(it.start, it.end),
      it.notes || '-',
    ]),
    styles: { ...tableFont, fontSize: 8 },
    headStyles: { ...tableFont, fontStyle: 'bold', fillColor: [30, 58, 95], fontSize: 8 },
    bodyStyles: { ...tableFont, fontSize: 8 },
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

  const doc = createDoc(imgW > imgH ? 'l' : 'p');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFont('Sarabun', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text(`${HOSPITAL_NAME} - HAIT Gantt Chart`, pageW / 2, 14, { align: 'center' });
  doc.setFont('Sarabun', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`วันที่ออกรายงาน: ${todayBE()}`, pageW / 2, 20, { align: 'center' });

  const maxW = pageW - 20;
  const maxH = pageH - 30;
  const ratio = Math.min(maxW / imgW, maxH / imgH);
  const w = imgW * ratio;
  const h = imgH * ratio;

  doc.addImage(imgData, 'PNG', (pageW - w) / 2, 24, w, h);
  addFooter(doc);
  doc.save(`HAIT-GanttChart-${new Date().toISOString().slice(0, 10)}.pdf`);
}
