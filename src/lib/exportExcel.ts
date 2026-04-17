import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HAIT_CATEGORIES } from '../data/categories';
import { STATUSES } from '../data/statuses';
import type { Item } from '../types';
import { dayToDateShort } from './date';

function statusLabel(s: string): string {
  return STATUSES[s as keyof typeof STATUSES]?.label || s;
}

export function exportExcel(items: Item[]) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: All items summary
  const allHeaders = ['รหัส', 'หมวด', 'รายการ', 'ผู้รับผิดชอบ', 'สถานะ', 'ครบกำหนด', 'เริ่มต้น', 'สิ้นสุด', 'หมายเหตุ'];
  const allData = items.map(it => {
    const cat = HAIT_CATEGORIES.find(c => c.id === it.catId);
    return [
      it.id,
      cat?.code || '',
      it.title,
      it.owner,
      statusLabel(it.status),
      dayToDateShort(it.end),
      dayToDateShort(it.start),
      dayToDateShort(it.end),
      it.notes || '',
    ];
  });
  const wsAll = XLSX.utils.aoa_to_sheet([allHeaders, ...allData]);

  // Style header row widths
  wsAll['!cols'] = [
    { wch: 8 }, { wch: 12 }, { wch: 40 }, { wch: 18 },
    { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Items');

  // Sheet 2-8: Per category
  HAIT_CATEGORIES.forEach(cat => {
    const catId = cat.id as number;
    const catItems = items.filter(i => i.catId === catId);
    const catDone = catItems.filter(i => i.status === 'completed').length;
    const catPct = catItems.length ? Math.round((catDone / catItems.length) * 100) : 0;

    const summaryRow = [`${cat.code} - ${cat.name}`, '', `Progress: ${catPct}%`, `${catDone}/${catItems.length} completed`];
    const headers = ['รหัส', 'รายการ', 'ผู้รับผิดชอบ', 'สถานะ', 'ครบกำหนด', 'เริ่มต้น', 'สิ้นสุด', 'หมายเหตุ'];
    const rows = catItems.map(it => [
      it.id,
      it.title,
      it.owner,
      statusLabel(it.status),
      dayToDateShort(it.end),
      dayToDateShort(it.start),
      dayToDateShort(it.end),
      it.notes || '',
    ]);

    const ws = XLSX.utils.aoa_to_sheet([summaryRow, [], headers, ...rows]);
    ws['!cols'] = [
      { wch: 8 }, { wch: 40 }, { wch: 18 }, { wch: 16 },
      { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, cat.code);
  });

  // Sheet 9: Status summary
  const statusHeaders = ['Status', 'Count', 'Percentage'];
  const total = items.length;
  const statusData = Object.values(STATUSES).map(s => {
    const count = items.filter(i => i.status === s.value).length;
    return [s.label, count, `${Math.round((count / total) * 100)}%`];
  });
  const wsStatus = XLSX.utils.aoa_to_sheet([statusHeaders, ...statusData]);
  wsStatus['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsStatus, 'Status Summary');

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbOut], { type: 'application/octet-stream' });
  saveAs(blob, `HAIT-Report-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
