import { downloadCsv, downloadExcel } from '../lib/exportCsv';
import { isRemoteEnabled } from '../lib/api';
import type { ANCRecord } from '../types';

interface Props {
  records: ANCRecord[];
}

export default function HeaderBar({ records }: Props) {
  const remote = isRemoteEnabled();
  return (
    <header
      className="rounded-2xl px-6 py-5 mb-5 text-white shadow-lg"
      style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center text-2xl shadow">
            <span aria-hidden>🩺</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-tight">
              ระบบเก็บสถิติแผนกฝากครรภ์
            </h1>
            <p className="text-sm md:text-base text-white/85">
              Antenatal Care (ANC) Statistics Dashboard · โรงพยาบาลมหาวิทยาลัยพะเยา
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm">
            <span className={`w-2 h-2 rounded-full ${remote ? 'bg-emerald-400' : 'bg-amber-300'}`} />
            {remote ? 'เชื่อม Google Sheets' : 'โหมดทดลอง (Local)'}
          </span>
          <button
            type="button"
            onClick={() => downloadCsv(records)}
            className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-sm flex items-center gap-1.5 transition"
          >
            <span aria-hidden>📄</span> CSV
          </button>
          <button
            type="button"
            onClick={() => downloadExcel(records)}
            className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-sm flex items-center gap-1.5 transition"
          >
            <span aria-hidden>📊</span> Excel
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-sm flex items-center gap-1.5 transition"
          >
            <span aria-hidden>🖨️</span> พิมพ์
          </button>
        </div>
      </div>
    </header>
  );
}
