import type { ANCRecord } from '../types';

const HEADERS: { key: keyof ANCRecord; label: string }[] = [
  { key: 'serviceDate', label: 'วันที่รับบริการ' },
  { key: 'hn', label: 'HN' },
  { key: 'name', label: 'ชื่อ-สกุล' },
  { key: 'age', label: 'อายุ' },
  { key: 'gravida', label: 'ครรภ์ที่' },
  { key: 'ga', label: 'GA (สัปดาห์)' },
  { key: 'visitNumber', label: 'ครั้งที่ฝากครรภ์' },
  { key: 'weight', label: 'น้ำหนัก (กก.)' },
  { key: 'height', label: 'ส่วนสูง (ซม.)' },
  { key: 'bpSystolic', label: 'BP บน' },
  { key: 'bpDiastolic', label: 'BP ล่าง' },
  { key: 'hct', label: 'Hct (%)' },
  { key: 'serviceType', label: 'ประเภทบริการ' },
  { key: 'serviceUnit', label: 'หน่วยบริการ' },
  { key: 'isFirstVisit', label: 'ฝากครั้งแรก' },
  { key: 'risks', label: 'ภาวะเสี่ยง' },
  { key: 'notes', label: 'หมายเหตุ' },
];

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = Array.isArray(value) ? value.join('; ') : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function recordsToCsv(records: ANCRecord[]): string {
  const head = HEADERS.map((h) => h.label).join(',');
  const rows = records.map((r) =>
    HEADERS.map((h) => escapeCsv(r[h.key])).join(',')
  );
  return '﻿' + [head, ...rows].join('\n');
}

export function downloadCsv(records: ANCRecord[], filename = 'anc-records.csv') {
  const blob = new Blob([recordsToCsv(records)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadExcel(records: ANCRecord[], filename = 'anc-records.xls') {
  const headerHtml = HEADERS.map((h) => `<th>${h.label}</th>`).join('');
  const rowsHtml = records
    .map(
      (r) =>
        '<tr>' +
        HEADERS.map((h) => {
          const v = r[h.key];
          const text = Array.isArray(v) ? v.join('; ') : v ?? '';
          return `<td>${String(text).replace(/</g, '&lt;')}</td>`;
        }).join('') +
        '</tr>'
    )
    .join('');
  const html =
    `<html><head><meta charset="UTF-8"/></head><body><table border="1"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
  const blob = new Blob(['﻿', html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
