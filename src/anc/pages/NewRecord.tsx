import { useMemo, useState } from 'react';
import { ALL_RISKS, type ANCRecord, type RiskFactor, type ServiceType, type ServiceUnit } from '../types';
import { todayISO } from '../lib/thaiDate';

interface Props {
  onSubmit: (record: Omit<ANCRecord, 'id'>) => Promise<void> | void;
  submitting?: boolean;
}

const SERVICE_TYPES: ServiceType[] = [
  'ANC ปกติ',
  'ANC ครั้งแรก',
  'ANC ครรภ์เสี่ยงสูง',
  'หลังคลอด',
  'อื่นๆ',
];

const SERVICE_UNITS: ServiceUnit[] = [
  'ห้องฝากครรภ์ (ANC)',
  'คลินิกครรภ์เสี่ยงสูง',
  'ห้องคลอด',
  'อื่นๆ',
];

const initialRecord = (): Omit<ANCRecord, 'id'> => ({
  serviceDate: todayISO(),
  hn: '',
  name: '',
  age: null,
  gravida: null,
  ga: null,
  visitNumber: null,
  weight: null,
  height: null,
  bpSystolic: null,
  bpDiastolic: null,
  hct: null,
  serviceType: 'ANC ปกติ',
  serviceUnit: 'ห้องฝากครรภ์ (ANC)',
  isFirstVisit: false,
  risks: [],
  notes: '',
});

export default function NewRecord({ onSubmit, submitting }: Props) {
  const [form, setForm] = useState<Omit<ANCRecord, 'id'>>(initialRecord());
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.serviceDate) e.serviceDate = 'จำเป็น';
    if (!form.hn.trim()) e.hn = 'จำเป็น';
    if (!form.name.trim()) e.name = 'จำเป็น';
    if (form.age != null && (form.age < 10 || form.age > 60)) e.age = '10–60 ปี';
    if (form.ga != null && (form.ga < 0 || form.ga > 45)) e.ga = '0–45 สัปดาห์';
    if (form.hct != null && (form.hct < 10 || form.hct > 60)) e.hct = '10–60%';
    return e;
  }, [form]);

  const handleNumber = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value === '' ? null : Number(value) });
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length > 0) return;
    await onSubmit(form);
    setForm(initialRecord());
    setTouched(false);
  };

  const toggleRisk = (risk: RiskFactor) => {
    setForm((f) => ({
      ...f,
      risks: f.risks.includes(risk) ? f.risks.filter((r) => r !== risk) : [...f.risks, risk],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 md:p-7 shadow-sm">
      <header className="flex items-center gap-2 mb-6">
        <span className="text-2xl text-purple-600" aria-hidden>＋</span>
        <h2 className="text-xl font-semibold text-slate-800">บันทึกข้อมูลการฝากครรภ์</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5">
        <Field label="วันที่รับบริการ" required error={touched ? errors.serviceDate : ''}>
          <input
            type="date"
            value={form.serviceDate}
            onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
            className={inputCls}
            required
          />
        </Field>
        <Field label="HN" required error={touched ? errors.hn : ''}>
          <input
            type="text"
            value={form.hn}
            onChange={(e) => setForm({ ...form, hn: e.target.value })}
            placeholder="เช่น 680001"
            className={inputCls}
          />
        </Field>
        <Field label="ชื่อ-สกุล" required error={touched ? errors.name : ''}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="ชื่อหญิงตั้งครรภ์"
            className={inputCls}
          />
        </Field>

        <Field label="อายุ (ปี)" error={touched ? errors.age : ''}>
          <input
            type="number"
            value={form.age ?? ''}
            onChange={(e) => handleNumber('age', e.target.value)}
            placeholder="ปี"
            className={inputCls}
          />
        </Field>
        <Field label="ครรภ์ที่ (Gravida)">
          <input
            type="number"
            value={form.gravida ?? ''}
            onChange={(e) => handleNumber('gravida', e.target.value)}
            placeholder="G"
            className={inputCls}
          />
        </Field>
        <Field label="อายุครรภ์ GA (สัปดาห์)" error={touched ? errors.ga : ''}>
          <input
            type="number"
            value={form.ga ?? ''}
            onChange={(e) => handleNumber('ga', e.target.value)}
            placeholder="สัปดาห์"
            className={inputCls}
          />
        </Field>

        <Field label="ครั้งที่ฝากครรภ์">
          <input
            type="number"
            value={form.visitNumber ?? ''}
            onChange={(e) => handleNumber('visitNumber', e.target.value)}
            placeholder="ครั้งที่"
            className={inputCls}
          />
        </Field>
        <Field label="น้ำหนัก (กก.)">
          <input
            type="number"
            step="0.1"
            value={form.weight ?? ''}
            onChange={(e) => handleNumber('weight', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="ส่วนสูง (ซม.)">
          <input
            type="number"
            step="0.1"
            value={form.height ?? ''}
            onChange={(e) => handleNumber('height', e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="ความดันโลหิต - บน (Systolic)">
          <input
            type="number"
            value={form.bpSystolic ?? ''}
            onChange={(e) => handleNumber('bpSystolic', e.target.value)}
            placeholder="mmHg"
            className={inputCls}
          />
        </Field>
        <Field label="ความดันโลหิต - ล่าง (Diastolic)">
          <input
            type="number"
            value={form.bpDiastolic ?? ''}
            onChange={(e) => handleNumber('bpDiastolic', e.target.value)}
            placeholder="mmHg"
            className={inputCls}
          />
        </Field>
        <Field label="ความเข้มข้นเลือด Hct (%)" error={touched ? errors.hct : ''}>
          <input
            type="number"
            step="0.1"
            value={form.hct ?? ''}
            onChange={(e) => handleNumber('hct', e.target.value)}
            placeholder="%"
            className={inputCls}
          />
        </Field>

        <Field label="ประเภทบริการ">
          <select
            value={form.serviceType}
            onChange={(e) => setForm({ ...form, serviceType: e.target.value as ServiceType })}
            className={inputCls}
          >
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="หน่วยบริการ">
          <select
            value={form.serviceUnit}
            onChange={(e) => setForm({ ...form, serviceUnit: e.target.value as ServiceUnit })}
            className={inputCls}
          >
            {SERVICE_UNITS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="เป็นการฝากครรภ์ครั้งแรกหรือไม่">
          <select
            value={form.isFirstVisit ? 'first' : 'continued'}
            onChange={(e) => setForm({ ...form, isFirstVisit: e.target.value === 'first' })}
            className={inputCls}
          >
            <option value="continued">ฝากครรภ์ต่อเนื่อง</option>
            <option value="first">ฝากครรภ์ครั้งแรก</option>
          </select>
        </Field>
      </div>

      <div className="mt-7">
        <div className="text-sm font-medium text-slate-700 mb-2">
          ภาวะเสี่ยง / ภาวะแทรกซ้อน (เลือกได้หลายข้อ)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {ALL_RISKS.map((risk) => (
            <label
              key={risk}
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                form.risks.includes(risk)
                  ? 'bg-purple-50 border-purple-400 text-purple-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={form.risks.includes(risk)}
                onChange={() => toggleRisk(risk)}
                className="accent-purple-600"
              />
              <span className="text-sm">{risk}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">หมายเหตุ / การให้คำแนะนำ</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          placeholder="เช่น แนะนำการรับประทานอาหาร, การออกกำลังกาย, การเตรียมตัวคลอด ฯลฯ"
        />
      </div>

      <div className="mt-7 flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => setForm(initialRecord())}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
        >
          ล้างฟอร์ม
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow disabled:opacity-60"
        >
          {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100';

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
      {error && <div className="text-xs text-rose-500 mt-1">{error}</div>}
    </div>
  );
}
