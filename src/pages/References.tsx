import { REFS } from '../data/categories';

interface RefLink {
  name: string;
  desc: string;
  url: string;
  tag: string;
}

const OFFICIAL: RefLink[] = [
  {
    name: 'TMI – หน้าการรับรอง',
    desc: 'หลักเกณฑ์ แบบคำขอ กำหนดการตรวจเยี่ยม',
    url: REFS.tmi,
    tag: 'TMI',
  },
  {
    name: 'เอกสาร TMI HAIT/HAIT Star (ทางการ)',
    desc: 'เอกสารจัดทำการประเมิน HAIT (Document_HAIT_HAITStarV1)',
    url: REFS.tmiDoc,
    tag: 'PDF',
  },
  {
    name: 'สารสนเทศเขตสุขภาพที่ 1',
    desc: '⭐ พะเยาอยู่เขตนี้ – แบบประเมินตนเอง + สรุปผลตรวจเยี่ยม 1–7',
    url: REFS.zone1,
    tag: 'เขต 1',
  },
];

const EXAMPLES: RefLink[] = [
  {
    name: 'รพ.บ้านบึง ชลบุรี',
    desc: '⭐ Reference หลัก – เผยแพร่เอกสารครบ 7 หมวด พร้อมดาวน์โหลด',
    url: REFS.banbung,
    tag: '7 หมวดครบ',
  },
  {
    name: 'รพ.วชิระภูเก็ต',
    desc: 'BCP เอกสารสำคัญ + ตารางค่าใช้จ่ายกรณีระบบล่ม',
    url: REFS.vachira,
    tag: 'BCP/DRP',
  },
  {
    name: 'รพ.สารภี เชียงใหม่',
    desc: 'คำสั่งแต่งตั้งคณะทำงาน + Presentation + Cybersecurity',
    url: REFS.sarapee,
    tag: 'คำสั่ง+PPT',
  },
  {
    name: 'รพ.มหาราชนครเชียงใหม่ (สวนดอก)',
    desc: 'แผนแม่บท IT เชิงลึก – ยุทธศาสตร์สู่แผนปฏิบัติการ',
    url: REFS.cmu,
    tag: 'หมวด 1',
  },
  {
    name: 'รพ.สมเด็จพระสังฆราช',
    desc: 'เอกสารประกอบการประชุม HAIT + แผนขับเคลื่อน รพ.อัจฉริยะ',
    url: 'https://www.sshos.go.th/ha-it/',
    tag: 'HAIT+',
  },
];

function RefCard({ link }: { link: RefLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl shadow-sm p-4 block hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex justify-between items-start gap-3 mb-1">
        <div className="font-bold text-slate-800 text-sm">{link.name}</div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 shrink-0">
          {link.tag}
        </span>
      </div>
      <p className="text-xs text-slate-600">{link.desc}</p>
      <div className="text-[10px] text-blue-600 mt-1.5 truncate">{link.url}</div>
    </a>
  );
}

export default function References() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy">📚 เอกสารอ้างอิง</h2>
        <p className="text-slate-500 text-sm">แหล่งข้อมูลมาตรฐานและตัวอย่างจาก รพ. อื่น</p>
      </div>

      {/* Group 1: Official */}
      <div className="mb-6">
        <h3 className="font-bold text-navy text-sm mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-navy" style={{ background: '#1e3a5f' }} />
          มาตรฐาน / เอกสารทางการ
        </h3>
        <div className="grid gap-2">
          {OFFICIAL.map((l) => (
            <RefCard key={l.url} link={l} />
          ))}
        </div>
      </div>

      {/* Group 2: Examples */}
      <div>
        <h3 className="font-bold text-slate-600 text-sm mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          ตัวอย่างจาก รพ. อื่น (ศึกษาเฉพาะ ไม่ใช่เอกสารจริง)
        </h3>
        <div className="grid gap-2">
          {EXAMPLES.map((l) => (
            <RefCard key={l.url} link={l} />
          ))}
        </div>
      </div>
    </div>
  );
}
