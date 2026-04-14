import { REFS } from '../data/categories';
import { HAIT_DRIVE_FOLDER_URL, HOSPITAL_NAME, CATEGORY_DRIVE_URLS } from '../data/config';
import { HAIT_CATEGORIES } from '../data/categories';
import { FolderOpen } from 'lucide-react';

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
      className="bg-white rounded-xl shadow-sm p-4 block hover:shadow-md hover:-translate-y-0.5 transition-all border border-slate-100"
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
        <h2 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>
          📚 เอกสารอ้างอิง
        </h2>
        <p className="text-slate-500 text-sm">แหล่งข้อมูลมาตรฐานและตัวอย่างจาก รพ. อื่น</p>
      </div>

      {/* Hospital Drive Folder - Banner */}
      <div className="mb-6">
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FolderOpen size={22} />
            </div>
            <div>
              <div className="font-bold text-lg">คลังเอกสาร HAIT ของ {HOSPITAL_NAME}</div>
            </div>
          </div>

          {/* Main folder button */}
          <a
            href={HAIT_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2.5 text-sm font-medium mb-4"
          >
            📁 เปิดโฟลเดอร์กลาง
          </a>

          {/* 7 Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {HAIT_CATEGORIES.map((cat) => {
              const catId = cat.id as number;
              const url = CATEGORY_DRIVE_URLS[catId] || HAIT_DRIVE_FOLDER_URL;
              return (
                <a
                  key={catId}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-2.5 py-2 text-xs font-medium"
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.code}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Column 1: Official standards */}
        <div>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: '#1e3a5f' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#1e3a5f' }} />
            📋 มาตรฐาน / เอกสารทางการ
            <span className="text-[10px] font-normal text-slate-400 ml-auto">
              {OFFICIAL.length} แหล่ง
            </span>
          </h3>
          <div className="grid gap-2">
            {OFFICIAL.map((l) => (
              <RefCard key={l.url} link={l} />
            ))}
          </div>
        </div>

        {/* Column 2: Hospital examples */}
        <div>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            🏥 ตัวอย่างจาก รพ. อื่น
            <span className="text-[10px] font-normal text-slate-400 ml-auto">
              {EXAMPLES.length} แหล่ง
            </span>
          </h3>
          <div className="grid gap-2">
            {EXAMPLES.map((l) => (
              <RefCard key={l.url} link={l} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
