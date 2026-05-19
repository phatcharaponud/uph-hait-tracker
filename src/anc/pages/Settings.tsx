import { getApiUrl, isRemoteEnabled } from '../lib/api';

interface Props {
  recordCount: number;
  onReseed: () => void;
  onClear: () => void;
}

export default function Settings({ recordCount, onReseed, onClear }: Props) {
  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span aria-hidden>⚙️</span> การตั้งค่าระบบ
        </h2>
        <dl className="space-y-3 text-sm">
          <Row label="หน่วยงาน">โรงพยาบาลมหาวิทยาลัยพะเยา</Row>
          <Row label="แผนก">แผนกฝากครรภ์ (ANC)</Row>
          <Row label="โหมดเก็บข้อมูล">
            {isRemoteEnabled() ? (
              <span className="inline-flex items-center gap-2 text-emerald-700">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Google Sheets (ออนไลน์)
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-amber-700">
                <span className="w-2 h-2 bg-amber-500 rounded-full" /> Local Storage (ทดลองใช้)
              </span>
            )}
          </Row>
          {isRemoteEnabled() && (
            <Row label="API Endpoint">
              <code className="text-xs bg-slate-100 px-2 py-1 rounded break-all">{getApiUrl()}</code>
            </Row>
          )}
          <Row label="จำนวนข้อมูลปัจจุบัน">
            <span className="font-semibold text-slate-800">{recordCount}</span> รายการ
          </Row>
        </dl>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-3">การเชื่อมต่อ Google Sheets</h3>
        <ol className="text-sm text-slate-700 space-y-2 list-decimal pl-5">
          <li>เปิด Google Sheet ใหม่ ตั้งชื่อแท็บแรกเป็น <code className="bg-slate-100 px-1 rounded">anc_records</code></li>
          <li>เปิด Extensions → Apps Script แล้วคัดลอกโค้ดจาก <code className="bg-slate-100 px-1 rounded">backend/anc-apps-script.gs</code></li>
          <li>กด Deploy → New deployment → Web app (Execute as: Me, Access: Anyone)</li>
          <li>คัดลอก URL ที่ได้ ใส่ในไฟล์ <code className="bg-slate-100 px-1 rounded">.env.local</code> ดังนี้
            <pre className="mt-2 bg-slate-900 text-emerald-200 text-xs p-3 rounded-lg overflow-x-auto">VITE_ANC_API_URL=https://script.google.com/macros/s/XXXX/exec</pre>
          </li>
          <li>รัน <code className="bg-slate-100 px-1 rounded">npm run dev</code> อีกครั้งเพื่อโหลดค่า</li>
        </ol>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-3">การจัดการข้อมูลทดลอง</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onReseed}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
          >
            สร้างข้อมูลตัวอย่าง 70 รายการ
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('ยืนยันลบข้อมูลทั้งหมดในเครื่องนี้?')) onClear();
            }}
            className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm font-medium"
          >
            ล้างข้อมูลทั้งหมด
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          * ปุ่มเหล่านี้กระทำเฉพาะข้อมูลใน browser ของผู้ใช้คนนี้เท่านั้น ไม่ลบข้อมูลใน Google Sheets
        </p>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 py-2 border-b border-slate-100 last:border-b-0">
      <dt className="text-slate-500 md:w-44">{label}</dt>
      <dd className="text-slate-800 flex-1">{children}</dd>
    </div>
  );
}
