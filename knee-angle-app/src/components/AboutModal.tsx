interface Props {
  open: boolean;
  onClose: () => void;
}

const APP_VERSION = '0.1.0';

export default function AboutModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-[#0f1a2e] p-5 text-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="text-xs text-amber-300">เกี่ยวกับและคำเตือน</div>
            <div className="text-lg font-bold">วัดมุมเข่า – Knee Angle Tracker</div>
            <div className="text-xs text-white/60">เวอร์ชัน {APP_VERSION}</div>
          </div>
          <button onClick={onClose} className="rounded-md bg-white/10 px-3 py-1 text-sm">
            ปิด
          </button>
        </div>

        <section className="mb-4 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm">
          <div className="font-semibold text-amber-200">⚠️ ไม่ใช่อุปกรณ์ทางการแพทย์</div>
          <p className="mt-1 text-amber-100/90">
            เครื่องมือนี้ใช้สำหรับ <b>คัดกรองและติดตามแนวโน้ม</b> เท่านั้น
            ไม่สามารถใช้แทน goniometer หรือเอกซเรย์ในการวินิจฉัย
            ปรึกษาแพทย์เฉพาะทางสำหรับการตัดสินใจรักษา
          </p>
        </section>

        <section className="mb-4 text-sm leading-relaxed">
          <h3 className="mb-1 font-semibold text-amber-300">ความแม่นยำ</h3>
          <ul className="list-disc space-y-1 pl-5 text-white/85">
            <li>ใช้ภาพ 2 มิติประมาณท่าทาง — ความคลาดเคลื่อนปกติ <b>±3–5°</b></li>
            <li>ความแม่นยำขึ้นกับ แสง เสื้อผ้า มุมกล้อง และการจัดท่า</li>
            <li>ควรวัดอย่างน้อย 3 ครั้งแล้วเฉลี่ย</li>
          </ul>
        </section>

        <section className="mb-4 text-sm leading-relaxed">
          <h3 className="mb-1 font-semibold text-amber-300">จุดอ้างอิงที่ใช้</h3>
          <ul className="list-disc space-y-1 pl-5 text-white/85">
            <li>มุมงอเข่า: Hip (greater trochanter) – Knee (lateral epicondyle) – Ankle (lateral malleolus)</li>
            <li>มุมโก่งขา: Hip-Knee-Ankle mechanical axis (varus/valgus classification)</li>
          </ul>
        </section>

        <section className="mb-4 text-sm leading-relaxed">
          <h3 className="mb-1 font-semibold text-amber-300">ความเป็นส่วนตัว</h3>
          <p className="text-white/85">
            ภาพจากกล้อง <b>ไม่ถูกบันทึกหรืออัปโหลด</b> ไปที่ใด ๆ
            การประมวลผลทั้งหมดเกิดขึ้นในอุปกรณ์ของคุณ
          </p>
          <a
            href="./privacy.html"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-amber-300 underline"
          >
            อ่านนโยบายความเป็นส่วนตัวฉบับเต็ม →
          </a>
        </section>

        <section className="mb-2 text-sm">
          <h3 className="mb-1 font-semibold text-amber-300">พัฒนาโดย</h3>
          <p className="text-white/85">
            โรงพยาบาลมหาวิทยาลัยพะเยา
            <br />
            <a href="mailto:hospital@up.ac.th" className="text-amber-300 underline">
              hospital@up.ac.th
            </a>
          </p>
        </section>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-amber-400 py-3 font-semibold text-[#1e3a5f]"
        >
          เข้าใจแล้ว
        </button>
      </div>
    </div>
  );
}
